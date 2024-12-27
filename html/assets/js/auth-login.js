function togglePassword() {
    const passwordField = document.getElementById("password");
    const eyeIcon = document.getElementById("eyeIcon");
    const eyeButton = document.getElementById("eyeButton");

    if (passwordField.type === "password") {
        passwordField.type = "text";
        // Eye icon with a line through it (showing the password is visible)
        eyeIcon.innerHTML = '<path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" />'; 
    } else {
        passwordField.type = "password";
        // Eye icon with a line through it (password is hidden)
        eyeIcon.innerHTML = '<path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><path d="M1 1l22 22"/><circle cx="12" cy="12" r="3" />'; // Eye-off icon (with a line through it)
    }
}

// Event listener to show/hide the eye icon based on password input
document.getElementById("password").addEventListener("input", function() {
    const eyeButton = document.getElementById("eyeButton");
    if (this.value.length > 0) {
        eyeButton.classList.remove("hidden");
    } else {
        eyeButton.classList.add("hidden");
    }
});
