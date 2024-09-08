<template>
    <form @submit.prevent="submitForm" class="content-section p-5 form w-50 mx-auto" enctype="multipart/form-data">
        <h1 class="fs-2 text-center">Edit Profile</h1>
        <hr class="fs-2 bold-hr" />
        <div class="form-group">
            <label class="fs-4 form-label mt-2" for="name">Name:</label>
            <input
                :class="'form-control form-control-lg special-input mt-1' + (errors.name ? ' is-invalid' : '') + (role === 'librarian' ? ' disabled-style' : '')"
                type="text" id="name" v-model="formData.name" @input="validateName" maxLength="60"
                :disabled="role === 'librarian'" />
            <p class="text-danger fs-6 mt-1" v-if="errors.name">
                {{ errors.name }}
            </p>
        </div>
        <div class="form-group">
            <label class="fs-4 form-label mt-3" for="username">Username:</label>
            <input
                :class="'form-control form-control-lg special-input mt-1' + (errors.username ? ' is-invalid' : '') + (role === 'librarian' ? ' disabled-style' : '')"
                type="text" id="username" v-model="formData.username" @input="validateUsername" maxLength="32"
                :disabled="role === 'librarian'" />
            <p class="text-danger mt-1" v-if="errors.username">
                {{ errors.username }}
            </p>
        </div>
        <div class="form-group">
            <label class="fs-4 form-label mt-3" for="email">Email:</label>
            <input :class="'form-control form-control-lg special-input mt-1' + (errors.email ? ' is-invalid' : '')"
                type="email" id="email" v-model="formData.email" @input="validateEmail" />
            <p class="text-danger fs-6 mt-1" v-if="errors.email">
                {{ errors.email }}
            </p>
        </div>
        <div class="form-group">
            <label class="fs-4 form-label mt-3">Delete Profile Picture:</label>
            <div class="radio-group">
                <div v-for="val in ['yes', 'no']" class="form-check">
                    <input type="radio" :id="'delete-' + val" :value="val" v-model="formData.delete_profile_picture"
                        class="form-check-input" />
                    <label class="form-check-label fs-4 ms-2" :for="'delete-' + val">{{ val.charAt(0).toUpperCase() +
                        val.slice(1) }}</label>
                </div>
            </div>
            <p class="text-danger fs-6 mt-1" v-if="errors.delete_profile_picture">
                {{ errors.delete_profile_picture }}
            </p>
        </div>
        <div class="form-group">
            <label class="fs-4 form-label mt-3" for="image">Profile Picture:</label>
            <input class="form-control special-file-upload special-input form-control-lg form-control-file mt-1"
                type="file" id="image" accept="image/png,image/jpeg,image/jpg" @change="handleImageChange" />
            <p class="text-danger fs-6 mt-1" v-if="errors.image">
                {{ errors.image }}
            </p>
        </div>
        <div class="form-group">
            <label class="fs-4 form-label mt-3" for="password">
                Enter Your Password To Edit:
            </label>
            <input :class="'form-control form-control-lg special-input mt-1' + (errors.password ? ' is-invalid' : '')"
                :type="field" id="password" v-model="formData.password" @input="validatePassword" maxLength="60" />
            <p class="text-danger fs-6 mt-1" v-if="errors.password">
                {{ errors.password }}
            </p>
        </div>
        <div class="mt-1">
            <input class="me-1 text-lg" type="checkbox" id="showPass" @change="toggleField" />
            <label for="showPass">Show Password</label>
        </div>
        <div class="container mt-2"></div>
        <a href="#" @click.prevent="forgotPassword">
            Forgot Password?
        </a>
        <div class="row mt-4">
            <div class="col-md-6">
                <button @click="goBack" class="btn btn-lg btn-danger">
                    <i class="bi bi-x-circle me-1"></i>
                    Cancel
                </button>
            </div>
            <div class="col-md-6 text-end">
                <button class="btn btn-lg btn-primary" id="submit" name="submit" type="submit">
                    <i class="bi bi-pencil-square me-1"></i>
                    Edit
                </button>
            </div>
        </div>
    </form>
</template>

<script>
import {
    nameValidator,
    usernameValidator,
    emailValidator,
    passwordValidator,
    check,
    pictureValidator
} from "../utils/validators.js";
import { router } from "../../router.js";
import { notify } from "../utils/utils.js";

export default {
    props: ["role"],
    data() {
        return {
            formData: {
                name: "",
                username: "",
                email: "",
                delete_profile_picture: "",
                profile_picture: null,
                password: ""
            },
            errors: {
                name: "",
                username: "",
                email: "",
                delete_profile_picture: "",
                profile_picture: "",
                password: ""
            },
            field: "password"
        };
    },
    mounted() {
        this.fetchUser();
    },
    methods: {
        async fetchUser() {
            try {
                const response = await fetch(`http://127.0.0.1:5000/api/common/account`, {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${localStorage.getItem(
                            "userToken"
                        )}`
                    }
                });
                const data = await response.json();
                if (!response.ok) {
                    if (!response.ok) {
                        throw new Error(
                            data.error ||
                            "An error occurred while fetching sections."
                        );
                    }
                }
                for (let key in this.formData) {
                    this.formData[key] = data[key];
                }
                this.formData.profile_picture = null;
                this.formData.delete_profile_picture = "no";
            } catch (error) {
                notify(error.message || error, "error");
            }
        },
        toggleField() {
            this.field = this.field === "password" ? "text" : "password";
        },
        validateName() {
            this.errors.name = nameValidator(this.formData.name);
        },
        validateUsername() {
            this.errors.username = usernameValidator(this.formData.username);
        },
        validateEmail() {
            this.errors.email = emailValidator(this.formData.email);
        },
        validateDeleteProfilePicture() {
            if (
                this.formData.delete_profile_picture !== "yes" &&
                this.formData.delete_profile_picture !== "no"
            ) {
                this.errors.delete_profile_picture = "Please select an option.";
            } else {
                this.errors.delete_profile_picture = "";
            }
        },
        validateProfilePicture() {
            this.errors.profile_picture = pictureValidator(
                this.formData.profile_picture
            );
        },
        handleImageChange(event) {
            const file = event.target.files[0];
            if (file) {
                this.formData.profile_picture = file;
                this.validateProfilePicture();
            }
        },
        validatePassword() {
            this.errors.password = passwordValidator(
                this.formData.password,
                false
            );
        },
        async forgotPassword() {
            try {
                const response = await fetch(`http://127.0.0.1:5000/api/common/reset`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${localStorage.getItem(
                            "userToken"
                        )}`
                    }
                });
                const data = await response.json();
                if (!response.ok) {
                    throw new Error(
                        data.error || "An unexpected error occurred."
                    );
                }
                notify(data?.message, "success");
            } catch (error) {
                notify(error.message || error, "error");
            }
        },
        async submitForm() {
            this.validateName();
            this.validateUsername();
            this.validateEmail();
            this.validateDeleteProfilePicture();
            this.validateProfilePicture();
            this.validatePassword();
            if (check(this.errors)) {
                try {
                    const formData = new FormData();
                    formData.append("name", this.formData.name);
                    formData.append("username", this.formData.username);
                    formData.append("email", this.formData.email);
                    formData.append(
                        "delete_profile_picture",
                        this.formData.delete_profile_picture
                    );
                    formData.append("password", this.formData.password);
                    if (this.formData.profile_picture) {
                        formData.append(
                            "profile_picture",
                            this.formData.profile_picture
                        );
                    }
                    const response = await fetch(`http://127.0.0.1:5000/api/common/account`, {
                        method: "POST",
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem(
                                "userToken"
                            )}`
                        },
                        body: formData
                    });
                    const data = await response.json();
                    if (!response.ok) {
                        throw new Error(
                            data.error || "An unexpected error occurred."
                        );
                    }
                    notify("Account updated successfully.", "success");
                    router.push(`/${this.role}/account`);
                } catch (error) {
                    notify(error.message || error, "error");
                }
            } else {
                return;
            }
        },
        goBack() {
            router.back();
        }
    },
};
</script>

<style></style>
