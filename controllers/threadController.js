const controller = {};
const models = require('../models');
const sequelize = require('sequelize');
const Op = sequelize.Op;

const multer = require('multer');
const path = require('path');

// Cấu hình multer để lưu ảnh vào thư mục "uploads" và đặt tên tệp ngẫu nhiên
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Đảm bảo thư mục này tồn tại hoặc tạo mới
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname)); // Lưu với tên tệp duy nhất
  }
});

// Giới hạn loại tệp là ảnh và dung lượng tối đa
const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // Giới hạn dung lượng ảnh là 5MB
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png|gif/;
    const mimetype = filetypes.test(file.mimetype);
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'), false);
    }
  }
}).single('image'); // 'image' là tên trường trong form HTML

controller.showHome = (req, res) => {
  res.render('homeIndex');
}

controller.show = async (req, res) => {
	let threads = await models.Thread.findAll({
		include: [{ model: models.Like }, { model: models.Comment }, { model: models.User }],
		attributes: ['content', 'mediaUrl', 'createdAt', 'userId', 'id'],
		order: [['createdAt', 'DESC']],
	});

	res.locals.threads = threads;
	res.render('index', {
    layout: 'layout',
    partial: 'header'
  });
};

controller.showDetail = async (req, res) => {
	let id = isNaN(req.params.id) ? 0 : parseInt(req.params.id);
	let thread = await models.Thread.findOne({
		include: [
			{ model: models.Like },
			{ model: models.Comment, include: [{ model: models.User }] },
			{ model: models.User },
		],
		attributes: ['content', 'mediaUrl', 'createdAt', 'userId', 'id'],
		where: { id },
	});
	let threadId = id;
	let comments = await models.Comment.findAll({
		attributes: ['content', 'userId', 'createdAt', 'id'],
		include: [{ model: models.User }],
		where: { threadId },
		order: [['createdAt', 'DESC']],
	});
	res.locals.comments = comments;
	res.locals.thread = thread;

	res.render('thread', {layout: 'layout'});
};

controller.createThread = async (req, res) => {
	let userId = req.session.User.id;

  // Tải ảnh lên và xử lý nếu có ảnh
  upload(req, res, async (err) => {
    if (err) {
      console.error(err);
      return res.render('thread', { layout: 'layout', errorMessage: 'Error uploading file. Please try again.' });
    }

    try {
      const { content } = req.body; // Lấy nội dung đăng bài từ form
      const mediaUrl = req.file ? `/uploads/${req.file.filename}` : '/assets/images/anhdaidien.jpg'; // Đường dẫn ảnh, nếu không có ảnh, dùng ảnh mặc định

      // Tạo Thread mới
      let newThread = await models.Thread.create({
        userId: userId,
        content: content,
        mediaUrl: mediaUrl,
      });

      // Lấy tất cả các Thread để hiển thị
      let threads = await models.Thread.findAll({
        include: [
          {
            model: models.User,
            attributes: ['username', 'profilePicture'], // Chỉ lấy thông tin cần thiết
          },
        ],
        order: [['createdAt', 'DESC']], // Sắp xếp theo TG tạo mới nhất
      });

      threads = threads.map(thread => {
        thread.dataValues.avatarUrl =
          thread.User.profilePicture || '/assets/images/anhdaidien.jpg'; 
        return thread;
      });

      res.locals.threads = threads; 
      res.redirect('/');
    } catch (error) {
      console.error(error);
      res.render('thread', {
        layout: 'layout',
        errorMessage: 'Oops, cannot post content!',
      });
    }
  });
};
  

module.exports = controller;
