// Import module Express
const express = require("express");

// Khởi tạo Router của Express
const router = express.Router();

// Import controller xử lý logic liên quan đến profile
const controller = require("../controllers/profileController");

// Import models (liên kết với cơ sở dữ liệu)
const models = require("../models");

// Import middleware `body` từ express-validator để kiểm tra và validate dữ liệu
const { body } = require("express-validator");

// Định nghĩa route GET để hiển thị trang profile
router.get("/profile", controller.showProfile);

// Định nghĩa route POST để cập nhật thông tin profile
router.post(
    "/update_profile", // Đường dẫn API cho việc cập nhật thông tin profile

    // Middleware để kiểm tra trường `username`
    body("username")
        .notEmpty() // Đảm bảo `username` không được để trống
        .withMessage("Username is required") // Thông báo lỗi khi `username` bị bỏ trống
        .matches(/^[a-zA-Z0-9._-]{1,30}$/) // Ràng buộc định dạng `username` phải là ký tự chữ, số, hoặc gồm các ký tự `-`, `_`, `.` với độ dài tối đa 30
        .withMessage("Username should be alphanumeric and can include dash, underscore, or dot, with a maximum length of 30 characters"), // Thông báo lỗi khi không đúng định dạng

    controller.handleError, // Middleware xử lý lỗi từ quá trình validate

    controller.update_profile // Controller xử lý logic cập nhật thông tin profile
);

// Xuất module router để sử dụng ở các phần khác
module.exports = router;
