const DataTypes = require("sequelize").DataTypes; // Import DataTypes từ Sequelize
const ThreadDB = require("./Thread"); // Import mô hình Thread
const UserDB = require("./User"); // Import mô hình User
const CommentDB = require("./Comment"); // Import mô hình Comment
const LikeDB = require("./Like"); // Import mô hình Like

function initModels(sequelize) {
  const User = UserDB(sequelize, DataTypes); // Khởi tạo mô hình User
  const Thread = ThreadDB(sequelize, DataTypes); // Khởi tạo mô hình Thread
  const Comment = CommentDB(sequelize, DataTypes); // Khởi tạo mô hình Comment
  const Like = LikeDB(sequelize, DataTypes); // Khởi tạo mô hình Like

  // Thiết lập mối quan hệ giữa các mô hình
  Thread.belongsTo(User, { foreignKey: "userId" }); // Thread thuộc về User
  User.hasMany(Thread, { foreignKey: "userId" }); // User có nhiều Thread

  Comment.belongsTo(Thread, { foreignKey: "threadId" }); // Comment thuộc về Thread
  Thread.hasMany(Comment, { foreignKey: "threadId" }); // Thread có nhiều Comment

  Like.belongsTo(Thread, { foreignKey: "threadId" }); // Like thuộc về Thread
  Thread.hasMany(Like, { foreignKey: "threadId" }); // Thread có nhiều Like

  Comment.belongsTo(User, { foreignKey: "userId" }); // Comment thuộc về User
  User.hasMany(Comment, { foreignKey: "userId" }); // User có nhiều Comment
  
  Like.belongsTo(User, { foreignKey: "userId" }); // Like thuộc về User
  User.hasMany(Like, { foreignKey: "userId" }); // User có nhiều Like

  return {
    Comment,
    Like,
    Thread,
    User,
  };
}

module.exports = initModels; // Xuất hàm initModels
module.exports.initModels = initModels; // Xuất hàm initModels
module.exports.default = initModels; // Xuất hàm initModels là mặc định