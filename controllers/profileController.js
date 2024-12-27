const controller = {}; 
// Tạo một đối tượng controller để chứa các phương thức xử lý logic.

const models = require("../models"); 
// Import các model từ thư mục "models" để thao tác với cơ sở dữ liệu.

const { validationResult } = require("express-validator"); 
// Import phương thức `validationResult` từ thư viện express-validator để kiểm tra và xử lý lỗi từ các middleware xác thực.

controller.showProfile = (req, res) => {
    res.render("profile");
};
// Định nghĩa phương thức `showProfile` để hiển thị trang hồ sơ người dùng.

controller.update_profile = async (req, res) => { 
// Định nghĩa phương thức `update_profile` để xử lý logic cập nhật thông tin hồ sơ người dùng.

  if (res.locals.message) { 
    // Nếu biến `res.locals.message` tồn tại (lỗi xác thực trước đó), render lại trang hồ sơ.
    return res.render("profile");
  }

  const { username, bio, avatar } = req.body; 
  // Lấy thông tin `username`, `bio` và `avatar` từ body của request.

  try { 
    const User = await models.User.findByPk(req.session.User.id); 
    // Tìm người dùng trong cơ sở dữ liệu dựa trên ID lưu trong session.

    if (!User) { 
      // Nếu không tìm thấy người dùng, trả về lỗi với mã trạng thái 400.
      return res.status(400).send("User not found.");
    }

    // Cập nhật thông tin trong session của người dùng.
    req.session.User.username = username; 
    req.session.User.bio = bio;
    req.session.User.profilePicture = avatar;

    // Cập nhật thông tin trong cơ sở dữ liệu.
    User.username = username;
    User.bio = bio;
    User.profilePicture = avatar;

    await User.save(); 
    // Lưu thay đổi vào cơ sở dữ liệu.

    res.render("profile"); 
    // Render lại trang hồ sơ người dùng sau khi cập nhật thành công.

  } catch (error) { 
    // Bắt lỗi nếu xảy ra vấn đề trong quá trình cập nhật.
    console.error("Update error:", error.message); 
    // Ghi log lỗi ra console.
    res.status(400).send("Invalid."); 
    // Trả về mã trạng thái 400 và thông báo lỗi.
  }
};

controller.handleError = (req, res, next) => { 
  // Định nghĩa middleware `handleError` để xử lý lỗi từ các middleware xác thực trước đó.

  const errors = validationResult(req); 
  // Lấy danh sách lỗi từ `validationResult`.

  if (!errors.isEmpty()) { 
    // Nếu danh sách lỗi không rỗng, xử lý các lỗi này.
    let message = ""; 
    // Tạo biến `message` để chứa các thông báo lỗi.
    errors.array().forEach((error) => (message += error.msg + "<br>")); 
    // Gộp các thông báo lỗi thành một chuỗi HTML.
    res.locals.message = message; 
    // Lưu chuỗi thông báo lỗi vào `res.locals.message` để sử dụng trong các middleware hoặc view.
  }
  next(); 
  // Chuyển tiếp sang middleware hoặc route handler tiếp theo.
};

module.exports = controller; 
// Xuất đối tượng `controller` để sử dụng trong các file khác.
