// Email validation function
function validateEmail() {
    const email = document.getElementById("email").value;
    const emailError = document.getElementById("emailError");
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    // Check if email matches the regex pattern
    if (email.length > 0 && !emailRegex.test(email)) {
        emailError.classList.remove("hidden");
    } else {
        emailError.classList.add("hidden");
    }
}

function togglePassword(fieldId) {
    const passwordField = document.getElementById(fieldId);
    const eyeIconPassword = document.getElementById("eyeIconPassword");

    if (passwordField.type === "password") {
        passwordField.type = "text";
        // Eye icon with a line through it (showing the password is visible)
        eyeIconPassword.innerHTML = '<path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" />'; 
    } else {
        passwordField.type = "password";
        // Eye icon with a line through it (password is hidden)
        eyeIconPassword.innerHTML = '<path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><path d="M1 1l22 22"/><circle cx="12" cy="12" r="3" />'; // Eye-off icon (with a line through it)
    }
}

function toggleConfirm(fieldId) {
    const confirmField = document.getElementById(fieldId);
    const eyeIconConfirm = document.getElementById("eyeIconConfirm");

    if (confirmField.type === "password") {
        confirmField.type = "text";
        // password is visible
        eyeIconConfirm.innerHTML = '<path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" />'; 
    } else {
        confirmField.type = "password";
        // password is hidden
        eyeIconConfirm.innerHTML = '<path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><path d="M1 1l22 22"/><circle cx="12" cy="12" r="3" />'; // Eye-off icon (with a line through it)
    }
}

document.getElementById("password").addEventListener("input", validatePasswords);
document.getElementById("confirmPassword").addEventListener("input", validatePasswords);

// Validate if password and confirm password match
function validatePasswords() {
    const password = document.getElementById("password").value;
    const confirmPassword = document.getElementById("confirmPassword").value;
    const errorMessage = document.getElementById("errorMessage");

    // Only show error message if confirm password is not empty and passwords don't match
    if (confirmPassword.length > 0 && password !== confirmPassword) {
        errorMessage.classList.remove("hidden");
    } else {
        errorMessage.classList.add("hidden");
    }

    // Toggle eye button visibility when there's input
    const eyeButtonPassword = document.getElementById("eyeButtonPassword");
    const eyeButtonConfirm = document.getElementById("eyeButtonConfirm");

    if (password.length > 0) {
        eyeButtonPassword.classList.remove("hidden");
    } else {
        eyeButtonPassword.classList.add("hidden");
    }

    if (confirmPassword.length > 0) {
        eyeButtonConfirm.classList.remove("hidden");
    } else {
        eyeButtonConfirm.classList.add("hidden");
    }
}