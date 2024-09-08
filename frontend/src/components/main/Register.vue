<template>
    <form @submit.prevent="submitForm" class="content-section p-5 form w-50 mx-auto">
        <h1 class="fs-2 text-center">User Register</h1>
        <hr class="fs-2 bold-hr" />
        <div class="form-group">
            <label class="fs-4 form-label mt-2" for="name">Name:</label>
            <input :class="'form-control form-control-lg special-input mt-1' + (errors.name ? ' is-invalid' : '')"
                type="text" id="name" v-model="formData.name" @input="validateName" maxLength="60" />
            <p class="text-danger fs-6 mt-1" v-if="errors.name">
                {{ errors.name }}
            </p>
        </div>
        <div class="form-group">
            <label class="fs-4 form-label mt-2" for="username">Username:</label>
            <input :class="'form-control form-control-lg special-input mt-1' + (errors.username ? ' is-invalid' : '')"
                type="text" id="username" v-model="formData.username" @input="validateUsername" maxLength="32" />
            <p class="text-danger mt-1" v-if="errors.username">
                {{ errors.username }}
            </p>
        </div>
        <div class="form-group">
            <label class="fs-4 form-label mt-2" for="email">Email:</label>
            <input :class="'form-control form-control-lg special-input mt-1' + (errors.email ? ' is-invalid' : '')"
                type="email" id="email" v-model="formData.email" @input="validateEmail" />
            <p class="text-danger fs-6 mt-1" v-if="errors.email">
                {{ errors.email }}
            </p>
        </div>
        <div class="form-group mt-2">
            <label class="fs-4 form-label mt-2" for="password">Password:</label>
            <input :class="'form-control form-control-lg special-input mt-1' + (errors.password ? ' is-invalid' : '')"
                :type="field1" id="password" v-model="formData.password" @input="validatePassword" maxLength="60" />
            <p class="text-danger fs-6 mt-1" v-if="errors.password">
                {{ errors.password }}
            </p>
        </div>
        <div class="mt-1">
            <input class="me-1 text-lg" type="checkbox" id="showPass" @change="toggleField(1)" />
            <label for="showPass">Show Password</label>
        </div>
        <div class="form-group mt-2">
            <label class="fs-4 form-label mt-2" for="confirmPassword">
                Confirm Password:
            </label>
            <input
                :class="'form-control form-control-lg special-input mt-1' + (errors.confirmPassword ? ' is-invalid' : '')"
                :type="field2" id="confirmPassword" v-model="formData.confirmPassword" @input="validateConfirmPassword"
                maxLength="60" />
            <p class="text-danger fs-6 mt-1" v-if="errors.confirmPassword">
                {{ errors.confirmPassword }}
            </p>
        </div>
        <div class="mt-1">
            <input class="me-1 text-lg" type="checkbox" id="showConfirmPass" @change="toggleField(2)" />
            <label for="showConfirmPass">Show Confirm Password</label>
        </div>
        <div class="form-group mt-2">
            <label class="fs-4 form-label mt-2" for="image">Image:</label>
            <input class="form-control special-file-upload special-input form-control-lg form-control-file mt-1"
                type="file" id="image" accept="image/png,image/jpeg,image/jpg" @input="validateImage" />
            <p class="text-danger fs-6 mt-1" v-if="errors.image">
                {{ errors.image }}
            </p>
        </div>
        <div class="container text-center mt-4">
            <button class="btn btn-lg btn-success" id="submit" name="submit" type="submit" value="Login">
                <i class="bi bi-person-fill-add me-1"></i>
                Register
            </button>
        </div>
        <div class="container mt-4"></div>
        <router-link to="/login">Already Have An Account?</router-link>
    </form>
</template>

<script>
import { router } from "../../router.js";
import { notify } from "../utils/utils.js";
import {
    nameValidator,
    usernameValidator,
    emailValidator,
    passwordValidator,
    pictureValidator,
    check
} from "../utils/validators.js";

export default {
    data() {
        return {
            formData: {
                name: "",
                username: "",
                email: "",
                password: "",
                confirmPassword: "",
                profile_picture: null
            },
            errors: {
                name: "",
                username: "",
                email: "",
                password: "",
                confirmPassword: "",
                profile_picture: ""
            },
            field1: "password",
            field2: "password"
        };
    },
    methods: {
        toggleField(i) {
            if (i === 1) {
                this.field1 =
                    this.field1 === "password" ? "text" : "password";
            } else if (i === 2) {
                this.field2 =
                    this.field2 === "password" ? "text" : "password";
            }
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
        validatePassword() {
            this.errors.password = passwordValidator(this.formData.password);
        },
        validateConfirmPassword() {
            this.errors.confirmPassword =
                this.formData?.confirmPassword === this.formData?.password
                    ? ""
                    : "Confirm Password should be equal to Password.";
        },
        validateProfilePicture() {
            this.errors.profile_picture = pictureValidator(this.formData.profile_picture);
        },
        async submitForm() {
            this.validateName();
            this.validateUsername();
            this.validateEmail();
            this.validatePassword();
            this.validateConfirmPassword();
            this.validateProfilePicture();
            if (check(this.errors)) {
                try {
                    const formData = new FormData();
                    formData.append("name", this.formData.name);
                    formData.append("username", this.formData.username);
                    formData.append("email", this.formData.email);
                    formData.append("password", this.formData.password);
                    if (this.formData.profile_picture) {
                        formData.append(
                            "profile_picture",
                            this.formData.profile_picture
                        );
                    }
                    const response = await fetch(`http://127.0.0.1:5000/api/main/register`, {
                        method: "POST",
                        body: formData
                    });
                    const data = await response.json();
                    if (!response.ok) {
                        throw new Error(
                            data.error ||
                            "An unexpected error occurred."
                        );
                    }
                    notify("Registered successfully. Please log in.", "success");
                    router.push("/login");
                } catch (error) {
                    notify(error.message || error, "error");
                }
            }
        }
    },
};
</script>

<style></style>
