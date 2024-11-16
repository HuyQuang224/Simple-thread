// JavaScript for Toggling Overlay
const editProfileButton = document.getElementById('editProfileButton');
const overlay = document.getElementById('overlay');
const closeOverlay = document.getElementById('closeOverlay');

// Show overlay when "Chỉnh sửa trang cá nhân" is clicked
editProfileButton.addEventListener('click', () => {
    overlay.classList.remove('hidden');
});

// Hide overlay when "Xong" button is clicked
closeOverlay.addEventListener('click', () => {
    overlay.classList.add('hidden');
});

// Hide overlay when clicking outside of the modal content
overlay.addEventListener('click', (event) => {
    // Check if the clicked element is the overlay itself, not the modal content
    if (event.target === overlay) {
        overlay.classList.add('hidden');
    }
});


// JavaScript for Toggling Overlay and Tab Switching
const openFollowersOverlay = document.getElementById('openFollowersOverlay');
const followersOverlay = document.getElementById('followersOverlay');
const closeFollowersOverlay = document.getElementById('closeFollowersOverlay');
const followersTab = document.getElementById('followersTab');
const followingTab = document.getElementById('followingTab');
const followersContent = document.getElementById('followersContent');
const followingContent = document.getElementById('followingContent');

// Show overlay when "Xem Người Theo Dõi" is clicked
openFollowersOverlay.addEventListener('click', () => {
    followersOverlay.classList.remove('hidden');
});

// Hide overlay when "Xong" button is clicked or when clicking outside the modal
closeFollowersOverlay.addEventListener('click', () => {
    followersOverlay.classList.add('hidden');
});

followersOverlay.addEventListener('click', (event) => {
    if (event.target === followersOverlay) {
        followersOverlay.classList.add('hidden');
    }
});

// Tab switching logic
followersTab.addEventListener('click', () => {
    followersTab.classList.add('text-white', 'font-semibold', 'border-b-2', 'border-white');
    followingTab.classList.remove('text-white', 'font-semibold', 'border-b-2', 'border-white');
    followersContent.classList.remove('hidden');
    followingContent.classList.add('hidden');
});

followingTab.addEventListener('click', () => {
    followingTab.classList.add('text-white', 'font-semibold', 'border-b-2', 'border-white');
    followersTab.classList.remove('text-white', 'font-semibold', 'border-b-2', 'border-white');
    followingContent.classList.remove('hidden');
    followersContent.classList.add('hidden');
});




// JavaScript for Toggling Overlay
const openThreadModalButtons = document.querySelectorAll('.open-thread-modal');
const threadOverlay = document.getElementById('threadOverlay');
const closeThreadOverlay = document.getElementById('closeThreadOverlay');

// Show overlay when any button with the "open-thread-modal" class is clicked
openThreadModalButtons.forEach(button => {
    button.addEventListener('click', () => {
        threadOverlay.classList.remove('hidden');
    });
});

// Hide overlay when "Huỷ" button is clicked
closeThreadOverlay.addEventListener('click', () => {
    threadOverlay.classList.add('hidden');
});

// Hide overlay when clicking outside of the modal content
threadOverlay.addEventListener('click', (event) => {
    if (event.target === threadOverlay) {
        threadOverlay.classList.add('hidden');
    }
});





// Tab elements
const threadsTab = document.getElementById('threadsTab');
const repliedThreadsTab = document.getElementById('repliedThreadsTab');
const repostedThreadsTab = document.getElementById('repostedThreadsTab');

// Content elements
const threadsContent = document.getElementById('threadsContent');
const repliedThreadsContent = document.getElementById('repliedThreadsContent');
const repostedThreadsContent = document.getElementById('repostedThreadsContent');

// Function to clear active tab styling
function clearActiveTab() {
    threadsTab.classList.remove('text-white', 'font-semibold', 'border-b-2', 'border-white');
    repliedThreadsTab.classList.remove('text-white', 'font-semibold', 'border-b-2', 'border-white');
    repostedThreadsTab.classList.remove('text-white', 'font-semibold', 'border-b-2', 'border-white');

    threadsContent.classList.add('hidden');
    repliedThreadsContent.classList.add('hidden');
    repostedThreadsContent.classList.add('hidden');
}

// Event listeners for each tab
threadsTab.addEventListener('click', () => {
    clearActiveTab();
    threadsTab.classList.add('text-white', 'font-semibold', 'border-b-2', 'border-white');
    threadsContent.classList.remove('hidden');
});

repliedThreadsTab.addEventListener('click', () => {
    clearActiveTab();
    repliedThreadsTab.classList.add('text-white', 'font-semibold', 'border-b-2', 'border-white');
    repliedThreadsContent.classList.remove('hidden');
});

repostedThreadsTab.addEventListener('click', () => {
    clearActiveTab();
    repostedThreadsTab.classList.add('text-white', 'font-semibold', 'border-b-2', 'border-white');
    repostedThreadsContent.classList.remove('hidden');
});

