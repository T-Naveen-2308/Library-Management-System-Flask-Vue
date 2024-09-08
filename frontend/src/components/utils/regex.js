const nameRegex = /^[A-Za-z\s,'.]{3,60}$/;

const usernameRegex = /^[a-z][a-z0-9_]{4,31}$/;

const emailRegex = /^([a-z\d\.-]+)@([a-z\d-]+)\.([a-z]{2,8})(\.[a-z]{2,8})?$/;

const passwordRegex =
    /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*()\-_=+{};:,<.>]).{8,60}$/;

const titleRegex = /^[A-Za-z0-9\s\-',.!?]{3,60}$/;

const descriptionRegex = /^[\w\s.,!?'\-:;\"()]{10,120}$/;

const searchTermRegex = /[A-Za-z0-9\s\-',.!?]{1,60}$/;

export {
    nameRegex,
    usernameRegex,
    emailRegex,
    passwordRegex,
    titleRegex,
    descriptionRegex,
    searchTermRegex
};