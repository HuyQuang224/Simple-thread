const controller = {};
const models = require('../models');
const sequelize = require('sequelize');
const Op = sequelize.Op;

controller.createComment = async (req, res) => {
  let userId = req.session.User.id;

  try {
    const { content, threadId } = req.body; // Lấy nội dung bình luận và ID bài viết từ form

    // Tạo Comment mới
    let newComment = await models.Comment.create({
      userId: userId,
      threadId: threadId,
      content: content,
    });

    // Sau khi đăng thành công, hiển thị lại trang với thông tin mới
    // Lấy tất cả các Comment của Thread để hiển thị
    let comments = await models.Comment.findAll({
      where: { threadId: threadId },
      include: [{ model: models.User }],
      order: [['createdAt', 'DESC']], // Sắp xếp theo thời gian tạo mới nhất
    });

    // Lưu bình luận vào res.locals để render lại trên trang
    res.locals.comments = comments;

    // Điều hướng lại trang bài viết chi tiết
    res.redirect(`/thread/${threadId}`);
  } catch (error) {
    res.render('thread', {
      errorMessage: 'Opps, can not post comment!',
    });
  }
};

module.exports = controller;