const initModels = require("./init-models"); // Import hàm initModels từ file init-models.js
const Sequelize = require("sequelize"); // Import thư viện Sequelize cho tương tác với cơ sở dữ liệu

const env = process.env.NODE_ENV || "development"; // Lấy môi trường hiện tại, mặc định là "development"
const config = require(__dirname + "/../config/config.json")[env]; // Lấy cấu hình tương ứng với môi trường từ file config.json

let sequelize; 
if (config.use_env_variable) { // Kiểm tra xem có sử dụng biến môi trường hay không
  sequelize = new Sequelize(process.env[config.use_env_variable], config); 
  // Tạo kết nối đến cơ sở dữ liệu bằng biến môi trường
} else {
  sequelize = new Sequelize(
    config.database, 
    config.username, 
    config.password, 
    config 
  );
  // Tạo kết nối đến cơ sở dữ liệu bằng thông tin trực tiếp từ file config.json
}

let db = initModels(sequelize); // Gọi hàm initModels để khởi tạo các model
db.sequelize = sequelize; // Lưu trữ đối tượng sequelize vào thuộc tính sequelize của db
db.Sequelize = Sequelize; // Lưu trữ đối tượng Sequelize vào thuộc tính Sequelize của db

module.exports = db; // Xuất đối tượng db để sử dụng trong các file khác