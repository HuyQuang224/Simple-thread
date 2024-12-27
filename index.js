const express = require('express'); // Import thư viện Express để tạo ứng dụng web
const app = express(); // Khởi tạo ứng dụng Express
const port = process.env.PORT || 3000; // Thiết lập cổng ứng dụng, ưu tiên lấy từ biến môi trường, nếu không thì mặc định là 3000
const expressHbs = require('express-handlebars'); // Import thư viện Handlebars để làm view engine
const session = require("express-session"); // Import thư viện express-session để quản lý session
require('dotenv').config(); // Tải các biến môi trường từ file .env

// Sử dụng thư mục tĩnh để phục vụ các file HTML
app.use(express.static(__dirname + '/html')); 
app.use(express.static(__dirname));

// Thiết lập engine Handlebars cho ứng dụng
app.engine(
	'hbs', // Sử dụng đuôi .hbs cho các file template
	expressHbs.engine({
		defaultLayout: 'homeLayout', // Layout mặc định là homeLayout
		layoutDir: __dirname + '/views/layouts', // Đường dẫn thư mục chứa layout
		extname: 'hbs', // Định dạng file template là .hbs
		runtimeOptions: {
			allowProtoPropertiesByDefault: true, // Cho phép các thuộc tính prototype được sử dụng
		},
		helpers: { // Các hàm trợ giúp trong template
			formatDate: date => { // Định dạng ngày tháng theo kiểu "ngày tháng năm"
				return date.toLocaleDateString('en-US', {
					year: 'numeric',
					month: 'long',
					day: 'numeric',
				});
			},
		},
	}),
);
app.set('view engine', 'hbs'); // Thiết lập view engine là Handlebars

// Middleware xử lý JSON và URL-encoded
app.use(express.json()); // Hỗ trợ parse dữ liệu JSON từ client
app.use(express.urlencoded({ extended: false })); // Hỗ trợ parse dữ liệu URL-encoded

// Thiết lập session cho ứng dụng
app.use(
	session({
	  secret: process.env.SESSION_SECRET || "my secret", // Chuỗi bí mật để mã hóa session
	  resave: false, // Không lưu lại session nếu không có thay đổi
	  saveUninitialized: false // Không lưu session trống
	})
);
  
// Middleware để lấy thông tin người dùng đã đăng nhập và truyền vào res.locals
app.use((req, res, next) => {
	res.locals.User = req.session.User; // Gắn thông tin user từ session vào biến cục bộ
	next(); // Tiếp tục xử lý các middleware tiếp theo
});

// Định nghĩa các tuyến đường (routes) cho ứng dụng
app.use('/', require('./routes/likeRouter')); // Route xử lý logic "like"
app.use('/', require('./routes/commentRouter')); // Route xử lý logic "comment"
app.use('/', require('./routes/threadRouter')); // Route xử lý logic "thread"
app.use('/profile', (req, res) => { // Route /profile trả về trang profile
	res.render('profile'); // Render file profile.hbs
});
app.use("/", require("./routes/authRouter")); // Route xử lý xác thực người dùng
app.use("/", require("./routes/profileRouter")); // Route xử lý thông tin hồ sơ cá nhân

// Lắng nghe ứng dụng trên cổng được chỉ định
app.listen(port, () => console.log(`Example app listening on port ${port}!`));
