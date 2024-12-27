const express = require("express"); // Import thư viện Express để tạo router
const jwt = require("jsonwebtoken"); // Import thư viện JSON Web Token để xử lý token
const router = express.Router(); // Tạo một instance của router
const controller = require("../controllers/authController"); // Import controller để xử lý logic
const models = require("../models"); // Import models để tương tác với database
const { body } = require("express-validator"); // Import hàm body từ express-validator để kiểm tra dữ liệu đầu vào

// Định nghĩa route GET /login và gắn với hàm showLogin trong controller
router.get("/login", controller.showLogin); 

// Định nghĩa route GET /signup và gắn với hàm showSignup trong controller
router.get("/signup", controller.showSignup);

// Định nghĩa route GET /resetPass và gắn với hàm showResetPass trong controller
router.get("/resetPass", controller.showResetPass);

// Định nghĩa route POST /signup với các middleware kiểm tra đầu vào và hàm xử lý signup
router.post(
    "/signup",
    [
        // Kiểm tra trường username
        body("username")
            .notEmpty()
            .withMessage("Username is required") // Thông báo nếu username bị bỏ trống
            .matches(/^[a-zA-Z0-9._-]{1,30}$/)
            .withMessage("Username should be alphanumeric and can include dash, underscore, or dot, with a maximum length of 30 characters"), // Kiểm tra username hợp lệ
        // Kiểm tra trường email
        body("email")
            .notEmpty()
            .withMessage("Email is required") // Thông báo nếu email bị bỏ trống
            .matches('^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$')
            .withMessage("Email must be a valid email address"), // Kiểm tra định dạng email
        // Kiểm tra trường password
        body("password")
            .notEmpty()
            .withMessage("Password is required") // Thông báo nếu password bị bỏ trống
            .isLength({min: 8})
            .withMessage("Password must be at least 8 characters long"), // Kiểm tra độ dài password
    ],
    controller.handleError, // Middleware xử lý lỗi nếu có
    controller.signup // Hàm xử lý signup
);

// Định nghĩa route POST /login với kiểm tra đầu vào và hàm xử lý login
router.post(
    "/login", 
    body("usernameOremail").notEmpty().withMessage("Username/Email is required"), // Kiểm tra trường usernameOremail
    body("password").notEmpty().withMessage("Password is required"), // Kiểm tra trường password
    controller.handleError, // Middleware xử lý lỗi nếu có
    controller.login // Hàm xử lý login
);

// Định nghĩa route POST /resetPass với kiểm tra đầu vào và hàm xử lý resetPass
router.post(
    "/resetPass",
    body("email").notEmpty().withMessage("Email is required"), // Kiểm tra trường email
    controller.handleError, // Middleware xử lý lỗi nếu có
    controller.resetPass // Hàm xử lý resetPass
);

// Định nghĩa route GET /newPass và gắn với hàm showNewPass trong controller
router.get("/newPass", controller.showNewPass);

// Định nghĩa route POST /newPass với kiểm tra đầu vào và hàm xử lý newPass
router.post(
    "/newPass",
    body("password")
        .notEmpty()
        .withMessage("Password is required") // Kiểm tra password không được bỏ trống
        .isLength({min: 8})
        .withMessage("Password must be at least 8 characters long"), // Kiểm tra độ dài password
    controller.handleError, // Middleware xử lý lỗi nếu có
    controller.newPass // Hàm xử lý newPass
);

// Định nghĩa route GET /verify-email để xác thực email qua token
router.get("/verify-email", async (req, res) => {
    const { token } = req.query; // Lấy token từ query parameters

    try {
        // Giải mã token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decoded.userId; // Lấy userId từ token

        // Tìm user theo userId
        const user = await models.User.findByPk(userId);
        if (!user) {
            return res.status(400).send("Invalid token or user not found."); // Nếu user không tồn tại
        }

        if (user.isEmailVerified) {
            return res.send("Your email is already verified!"); // Nếu email đã xác thực trước đó
        }

        user.isEmailVerified = true; // Cập nhật trạng thái xác thực email
        await user.save(); // Lưu thay đổi vào database

        res.send("Email verification successful! You can now log in."); // Phản hồi thành công
    } catch (error) {
        console.error("Verification error:", error.message); // Log lỗi
        res.status(400).send("Invalid or expired token."); // Phản hồi lỗi
    }
});

// Định nghĩa route GET /logout và gắn với hàm logout trong controller
router.get("/logout", controller.logout);

// Xuất module router để sử dụng trong ứng dụng
module.exports = router;
