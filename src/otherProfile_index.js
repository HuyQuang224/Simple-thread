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

