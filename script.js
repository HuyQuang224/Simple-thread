
		// Lấy các phần tử cần thiết
		const heartButton = document.getElementById('heart-icon');
		const sidebar = document.querySelector('.notification-sidebar');

		// Biến để theo dõi trạng thái của sidebar
		let isSidebarVisible = false;
		
		function toggleSidebar() {
		// Thay đổi trạng thái sidebar
		if (isSidebarVisible) {
			sidebar.classList.remove('show'); // Ẩn sidebar
		} else {
			sidebar.classList.add('show'); // Hiện sidebar
		}
		isSidebarVisible = !isSidebarVisible; // Lật lại trạng thái
		}
	
  		
		const likeButtons = document.querySelectorAll('.like-button');

likeButtons.forEach(button => {
  button.addEventListener('click', function(event) {
    const threadId = event.target.dataset.threadId; // Lấy threadId từ data-attribute của nút Like
    const likeCountElement = document.querySelector(`#like-count-${threadId}`);

    // Cập nhật số lượt like ngay lập tức trên giao diện người dùng (tăng giảm 1)
    if (likeCountElement) {
      let currentLikeCount = parseInt(likeCountElement.textContent);
      
      // Kiểm tra xem người dùng đã like chưa và cập nhật số lượt like
      if (event.target.classList.contains('liked')) {
        currentLikeCount--; // Nếu đã liked, giảm 1
      } else {
        currentLikeCount++; // Nếu chưa liked, tăng 1
      }

      likeCountElement.textContent = currentLikeCount; // Cập nhật số lượng like
    }

    // Gửi yêu cầu toggle like qua fetch
    fetch('/toggle-like', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ threadId: threadId }) // Gửi threadId trong body của yêu cầu
    })
    .then(response => response.json())  // Nhận phản hồi dưới dạng JSON
    .then(data => {
      // Nếu cần, cập nhật lại số lượng like từ server hoặc trạng thái nút like
      const likeCountElement = document.querySelector(`#like-count-${threadId}`);
      if (likeCountElement) {
        likeCountElement.textContent = data.LikeCount; // Cập nhật lại số lượng like từ server
      }

      // Cập nhật trạng thái của nút like (liked hoặc chưa liked)
      event.target.classList.toggle('liked', data.liked); // Thêm hoặc bỏ class liked
    })
    .catch(error => {
      console.error('Error:', error);
    });
  });
});

// Lấy các tham số truy vấn từ URL
const urlParams = new URLSearchParams(window.location.search);
const userLiked = urlParams.get('userLiked') === 'true'; // Kiểm tra nếu 'userLiked' là true
const likeCount = urlParams.get('likeCount'); // Lấy số lượt thích

// Lấy nút "like" và biểu tượng
const likeButton = document.getElementById('like-button');
const likeIcon = document.getElementById('like-icon');
const likeCountSpan = document.getElementById('like-count-{{id}}');

// Cập nhật nút "like" dựa trên 'userLiked' và 'likeCount'
if (userLiked) {
    likeButton.classList.add('text-red-500'); // Thêm màu đỏ khi đã thích
    likeIcon.setAttribute('fill', 'currentColor'); // Đặt màu "fill" theo màu hiện tại
} else {
    likeIcon.setAttribute('fill', 'none'); // Đặt không có màu "fill"
}

// Cập nhật số lượt thích
likeCountSpan.textContent = likeCount;


