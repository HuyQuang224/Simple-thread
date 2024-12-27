const controller = {};
const models = require('../models');
const Like = models.Like;

const toggleLike = async (req, res) => {
    const userId = req.session.User.id; // Giả sử user đã đăng nhập
    const { threadId } = req.body;

    try {
        // Kiểm tra nếu user đã like bài viết
        const like = await models.Like.findOne({
            where: { userId, threadId },
        });

        if (like) {
            // Nếu đã like, xóa like
            await like.destroy();
        } else {
            // Nếu chưa like, thêm like
            await models.Like.create({ userId, threadId });
        }

        // Đếm lại tổng số like
        const likeCount = await models.Like.count({
            where: { threadId },
        });

        // Lấy danh sách likes để kiểm tra người dùng đã like chưa
        const likes = await models.Like.findAll({
            where: { threadId },
            attributes: ['userId'],
        });
        

        // Tạo mảng chứa tất cả userId đã like bài viết
        const likeUserIds = likes.map(like => like.userId);
        console.log("userLiked:", likeUserIds.includes(userId));
        console.log("likeCount:", likeCount);
        // Chuyển hướng đến trang thread và truyền thông tin qua query parameters
        res.redirect(`/thread/${threadId}?likeCount=${likeCount}&userLiked=${likeUserIds.includes(userId)}`);
    } catch (error) {
        console.error(error);
        res.status(500).redirect('/error'); // Chuyển hướng đến trang lỗi nếu có sự cố
    }
};

module.exports = { toggleLike };
