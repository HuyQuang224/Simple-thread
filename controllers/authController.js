const controller = {}; // Tạo một đối tượng controller để chứa các phương thức xử lý
const sequelize = require('sequelize'); // Import thư viện sequelize
const Op = sequelize.Op; // Khai báo toán tử (Operators) của Sequelize
const nodemailer = require("nodemailer"); // Import thư viện nodemailer để gửi email
const jwt = require("jsonwebtoken"); // Import thư viện jsonwebtoken để làm việc với token
const models = require("../models"); // Import models để tương tác với cơ sở dữ liệu
const bcrypt = require("bcryptjs"); // Import thư viện bcryptjs để băm mật khẩu
const { validationResult } = require("express-validator"); // Import express-validator để kiểm tra và xử lý dữ liệu đầu vào

// Hiển thị trang đăng nhập
controller.showLogin = (req, res) => {
  res.render("auth-login", { layout: "auth" }); // Render view 'auth-login' với layout 'auth'
};

// Hiển thị trang đăng ký
controller.showSignup = (req, res) => {
  res.render("auth-signup", { layout: "auth" }); // Render view 'auth-signup' với layout 'auth'
};

// Hiển thị trang nhập email để đặt lại mật khẩu
controller.showResetPass = (req, res) => {
  res.render("reset-pass-form", { layout: "auth" }); // Render view 'reset-pass-form' với layout 'auth'
}

// Hiển thị trang đặt lại mật khẩu mới
controller.showNewPass = (req, res) => {
  const { token } = req.query; // Lấy token từ query params
  res.render("passwordReset", { layout: "auth", token }); // Render view 'passwordReset' với layout 'auth' và truyền token
}

// Đăng xuất người dùng
controller.logout = (req, res) => {
  req.session.destroy(); // Xóa session của người dùng
  res.redirect("/home"); // Chuyển hướng về trang chủ
}

// Tạo transporter cho nodemailer để gửi email
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST, // Host của email server
  port: process.env.EMAIL_PORT, // Cổng của email server
  secure: false, // Nếu sử dụng cổng 465 thì đặt true
  auth: {
    user: process.env.EMAIL_USER, // Tên đăng nhập email
    pass: process.env.EMAIL_PASS, // Mật khẩu email
  },
});

// Xử lý yêu cầu đặt lại mật khẩu
controller.resetPass = async (req, res) => {
  if (res.locals.message) { // Nếu có lỗi, render lại form
    return res.render("reset-pass-form", {
      layout: "auth",
    });
  }
  const { email } = req.body; // Lấy email từ body của request

  const user = await models.User.findOne({ where: { email } }); // Tìm người dùng theo email

  if (!user) { // Nếu không tìm thấy người dùng
    return res.status(400).send("Email not found."); // Trả về lỗi 400
  }

  // Tạo token xác minh
  const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
    expiresIn: "1h", // Token hết hạn sau 1 giờ
  });

  await models.User.update({ reset_token: token }, { where: { id: user.id } }); // Lưu token vào cơ sở dữ liệu

  // Gửi email xác minh
  const resetLink = `${process.env.BASE_URL}/newPass?token=${token}`; // Tạo liên kết đặt lại mật khẩu
  await transporter.sendMail({
    from: `"Threads App" <${process.env.EMAIL_USER}>`, // Người gửi
    to: email, // Người nhận
    subject: "Reset your Thread password account", // Chủ đề email
    html: `
      <h1>Welcome to Threads!</h1>
      <p>Reset your password by clicking the link below:</p>
      <a href="${resetLink}">Reset Password</a>
    `, // Nội dung email
  });

  res.redirect("/login"); // Chuyển hướng đến trang đăng nhập
}

// Xử lý yêu cầu tạo mật khẩu mới
controller.newPass = async (req, res) => {
  if (res.locals.message) { // Nếu có lỗi, render lại form
    return res.render("passwordReset", {
      layout: "auth",
    });
  }

  const { token, password, confirmPassword } = req.body; // Lấy token, mật khẩu và xác nhận mật khẩu từ body của request

  if (password !== confirmPassword) { // Kiểm tra xem mật khẩu và xác nhận mật khẩu có khớp không
    return res.render("passwordReset", {
      layout: "auth",
      message: "Password do not match!", // Hiển thị thông báo lỗi nếu không khớp
    });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10); // Mã hóa mật khẩu mới
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // Giải mã token để lấy thông tin userId
    const userId = decoded.userId; // Lấy userId từ token

    const user = await models.User.findByPk(userId); // Tìm người dùng theo userId

    if (!user) { // Nếu không tìm thấy người dùng
      return res.status(400).send("Invalid token or user not found."); // Trả về lỗi 400
    }

    if (user.reset_token !== token) { // Kiểm tra token trong cơ sở dữ liệu có khớp không
      return res.status(400).send("This reset link is invalid or has expired."); // Nếu không khớp, báo lỗi
    }

    user.password = hashedPassword; // Cập nhật mật khẩu
    user.reset_token = null; // Xóa token
    await user.save(); // Lưu thay đổi vào cơ sở dữ liệu

    res.render("auth-login", {
      layout: "auth",
      message: "Reset password successful!", // Hiển thị thông báo thành công
    });

  } catch (error) { // Bắt lỗi
    console.error("Reset error:", error.message); // Log lỗi ra console
    res.status(400).send("Invalid or expired token."); // Báo lỗi cho client
  }
}

controller.signup = async (req, res) => {
  if (res.locals.message) { 
    // Nếu đã có thông báo từ middleware handleError, render lại trang đăng ký
    return res.render("auth-signup", {
      layout: "auth"
    });
  }
  const { username, fullname, email, password, confirmPassword } = req.body;
  // Kiểm tra password và confirmPassword có giống nhau không
  if (password !== confirmPassword) {
      return res.render("auth-signup", {
        layout: "auth",
        message: "Password do not match!" // Hiển thị thông báo lỗi nếu không khớp
      });
  }
  try {
    // Mã hóa mật khẩu trước khi lưu vào cơ sở dữ liệu
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await models.User.create({
      username, 
      email, 
      password: hashedPassword,
      isEmailVerified: false, // Gán trạng thái chưa xác minh email
    });
    // Tạo token xác minh email
    const token = jwt.sign({ userId: newUser.id }, process.env.JWT_SECRET, {
      expiresIn: "1h", // Token có hiệu lực trong 1 giờ
    });

    // Tạo link xác minh email và gửi qua email
    const verifyLink = `${process.env.BASE_URL}/verify-email?token=${token}`;
    await transporter.sendMail({
      from: `"Threads App" <${process.env.EMAIL_USER}>`, // Người gửi
      to: email, // Email người nhận
      subject: "Verify your Threads account", // Tiêu đề email
      html: `
        <h1>Welcome to Threads!</h1>
        <p>Please verify your email by clicking the link below:</p>
        <a href="${verifyLink}">Verify Email</a>
      `, // Nội dung email
    });

    // Hiển thị thông báo thành công và hướng dẫn xác minh email
    res.render("auth-login", {
      layout: "auth",
      message: "Signup successful! Please check your email to verify your account.",
    });

  } catch (error) {
    console.error(error); // Log lỗi ra console
    res.render("auth-signup", {
      layout: "auth",
      message: "Something went wrong!", // Hiển thị lỗi chung nếu có lỗi xảy ra
    });
  }
}

controller.login = async (req, res) => {
if (res.locals.message) { 
  // Nếu có thông báo lỗi từ middleware handleError, render lại trang đăng nhập
  return res.render("auth-login", {
    layout: "auth",
  });
}

const { usernameOremail, password } = req.body; // Lấy thông tin từ form đăng nhập

try {
  // Tìm user theo username hoặc email
  const user = await models.User.findOne({
    where: {
      [Op.or]: [
        { username: usernameOremail }, // Tìm theo username
        { email: usernameOremail } // Tìm theo email
      ]
    }
  });

  if (!user) {
    // Hiển thị lỗi nếu không tìm thấy người dùng
    return res.render("auth-login", {
      layout: "auth",
      message: "User not found",
    });
  }

  // So sánh mật khẩu nhập vào với mật khẩu trong cơ sở dữ liệu
  if (!bcrypt.compareSync(password, user.password)) {
    return res.render("auth-login", {
      layout: "auth",
      message: "Wrong password", // Hiển thị thông báo sai mật khẩu
    });
  }

  // Kiểm tra trạng thái xác minh email của tài khoản
  if (!user.isEmailVerified) {
    return res.render("auth-login", {
      layout: "auth",
      message: "Account is not verified", // Hiển thị thông báo nếu email chưa xác minh
    });
  }

  // Lưu thông tin user vào session
  req.session.User = {
    id: user.id,
    username: user.username,
    bio: user.bio,
    profilePicture: user.profilePicture
  };

  // Chuyển hướng người dùng đến trang chủ
  res.redirect("/");
} catch (error) {
  console.error(error); // Log lỗi ra console
  res.render("auth-login", {
    layout: "auth",
    message: "Something went wrong!", // Hiển thị thông báo lỗi chung nếu có lỗi xảy ra
  });
}
};

controller.handleError = (req, res, next) => {
const errors = validationResult(req); // Kiểm tra lỗi từ middleware validate
if (!errors.isEmpty()) {
  let message = "";
  // Tạo thông báo lỗi từ danh sách lỗi
  errors.array().forEach((error) => (message += error.msg + "<br>"));
  res.locals.message = message; // Lưu thông báo lỗi vào res.locals để dùng sau
}
next(); // Chuyển sang middleware tiếp theo
}

controller.authenticate = (req, res, next) => {
if (!req.session.user) {
  // Nếu user chưa đăng nhập, chuyển hướng đến trang chủ
  return res.redirect("/home");
}
next(); // Nếu đã đăng nhập, chuyển sang middleware tiếp theo
}

controller.loginAuthenticate = (req, res, next) => {
if (req.session.user) {
  // Nếu user đã đăng nhập, chuyển hướng đến trang chính
  return res.redirect("/");
}
next(); // Nếu chưa đăng nhập, chuyển sang middleware tiếp theo
}

module.exports = controller; // Xuất module để dùng trong file khác
