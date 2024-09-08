import {
    nameRegex,
    usernameRegex,
    emailRegex,
    passwordRegex,
    titleRegex,
    descriptionRegex,
    searchTermRegex
} from "./regex.js";

function nameValidator(name) {
    if (!name) {
        return "Name is required.";
    }
    if (name.length < 3) {
        return "Name must be at least 5 characters long.";
    }
    if (name.length > 60) {
        return "Name cannot be more than 32 characters long.";
    }
    if (!nameRegex.test(name)) {
        return "Name can only contain lowercase letters, digits and underscore.";
    }
    return "";
}

function usernameValidator(username) {
    if (!username) {
        return "Username is required.";
    }
    if (username.length < 5) {
        return "Username must be at least 5 characters long.";
    }
    if (username.length > 32) {
        return "Username cannot be more than 32 characters long.";
    }
    if (!usernameRegex.test(username)) {
        return "Username can only contain lowercase letters, digits and underscore.";
    }
    return "";
}

function titleValidator(title) {
    if (!title) {
        return "Title is required.";
    }
    if (title.length < 3) {
        return "Title must be at least 3 characters long.";
    }
    if (title.length > 60) {
        return "Title cannot be more than 60 characters long.";
    }
    if (!titleRegex.test(title)) {
        return "Title can only contain lowercase letters, digits and underscore.";
    }
    return "";
}

function descriptionValidator(description) {
    if (!description) {
        return "Description is required.";
    }
    if (description.length < 10) {
        return "Description must be at least 10 characters long.";
    }
    if (description.length > 120) {
        return "Description cannot be more than 120 characters long.";
    }
    if (!descriptionRegex.test(description)) {
        return "Description can only contain lowercase letters, digits and underscore.";
    }
    return "";
}

function searchTermValidator(query) {
    if (!query) {
        return "Query is required.";
    }
    if (query.length < 1) {
        return "Query must be at least 1 characters long.";
    }
    if (query.length > 60) {
        return "Query cannot be more than 60 characters long.";
    }
    if (!searchTermRegex.test(query)) {
        return "Query can only contain lowercase letters, digits and underscore.";
    }
    return "";
}

function emailValidator(email) {
    if (!email) {
        return "Email is required.";
    }
    if (!emailRegex.test(email)) {
        return "Invalid Email.";
    }
    return "";
}

function passwordValidator(password, flag = true) {
    if (!password) {
        return "Password is required.";
    }
    if (password.length < 8) {
        return "Password must be at least 8 characters long.";
    }
    if (password.length > 60) {
        return "Password cannot be more than 60 characters long.";
    }
    if (flag && !passwordRegex.test(password)) {
        return "Password must contain at least eight characters, one uppercase, one lowercase, one number and one special character.";
    }
    return "";
}

function pictureValidator(file) {
    if (!file) {
        return "";
    }
    if (!["image/jpeg", "image/png", "image/jpg"].includes(file.type)) {
        return "Invalid image type";
    }
    return "";
}

function pdfValidator(file) {
    if (!file) {
        return "";
    }
    if (file.type !== "application/pdf") {
        return "Invalid file type. Only PDF files are allowed.";
    }
    return "";
}

function check(errors) {
    for (const key in errors) {
        if (errors[key]) {
            return false;
        }
    }
    return true;
}

export {
    nameValidator,
    usernameValidator,
    titleValidator,
    descriptionValidator,
    searchTermValidator,
    emailValidator,
    passwordValidator,
    pictureValidator,
    pdfValidator,
    check
};
