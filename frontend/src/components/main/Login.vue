<template>
    <form @submit.prevent="submitForm" class="content-section p-5 form w-50 mx-auto">
        <h1 class="fs-2 text-center">
            {{ role === "librarian" ? "Librarian" : "" }} Login
        </h1>
        <hr class="fs-2 bold-hr" />
        <div class="form-group">
            <label class="h5 fw-normal form-control-label mt-2" for="username">Username:</label>
            <input class="form-control form-control-lg mt-1" type="text" id="username" v-model="formData.username"
                @input="validateUsername" maxLength="32" />
            <p class="text-danger fs-6 mt-1" v-if="errors.username">{{ errors.username }}</p>
        </div>
        <div class="form-group mt-2">
            <label class="h5 fw-normal form-control-label mt-2" for="password">Password:</label>
            <input class="form-control form-control-lg mt-1" :type="field" id="password" v-model="formData.password"
                @input="validatePassword" maxLength="60" />
            <p class="text-danger fs-6 mt-1" v-if="errors.password">{{ errors.password }}</p>
        </div>
        <div class="mt-1">
            <input class="me-1 text-lg" type="checkbox" id="showPass" @change="toggleField" />
            <label for="showPass">Show Password</label>
        </div>
        <div class="container mt-2"></div>
        <router-link to="/request-reset">Forgot Password?</router-link>
        <div class="container text-center mt-2">
            <button class="btn btn-lg btn-success" id="submit" name="submit" type="submit" value="Login">
                <i class="bi bi-box-arrow-in-right me-1"></i>
                Login
            </button>
        </div>
        <div v-if="role === 'librarian'">
            <div class="container mt-2"></div>
            <router-link to="/login">Login as User</router-link>
        </div>
        <div v-else>
            <div class="container mt-3"></div>
            <router-link to="/register">Don't Have an Account?</router-link>
            <div class="container mt-2"></div>
            <router-link to="/lib-login">Login as Librarian</router-link>
        </div>
    </form>
</template>

<script>
import { router } from "../../router.js";
import { notify } from "../utils/utils.js";
import {
    usernameValidator,
    passwordValidator,
    check
} from "../utils/validators.js";

export default {
    props: ["role"],
    data() {
        return {
            formData: {
                username: "",
                password: "",
                role: this.role
            },
            errors: {
                username: "",
                password: ""
            },
            field: "password"
        };
    },
    methods: {
        toggleField() {
            this.field = this.field === "password" ? "text" : "password";
        },
        validateUsername() {
            this.errors.username = usernameValidator(this.formData?.username);
        },
        validatePassword() {
            this.errors.password = passwordValidator(
                this.formData?.password,
                false
            );
        },
        async submitForm() {
            this.validateUsername();
            this.validatePassword();
            if (check(this.errors)) {
                try {
                    console.log(this.formData);
                    const response = await fetch(`http://127.0.0.1:5000/api/main/login`, {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify(this.formData)
                    });
                    const data = await response.json();
                    if (!response.ok) {
                        if (data?.roleError) {
                            notify(
                                `Please login in as ${this.role === "librarian"
                                    ? "user"
                                    : "librarian"
                                }.`,
                                "warning"
                            );
                            router.push(
                                this.role === "librarian"
                                    ? "/login"
                                    : "/lib-login"
                            );
                            return;
                        }
                        throw new Error(
                            data.error || "An unexpected error occurred."
                        );
                    }
                    localStorage.setItem("userToken", data?.token);
                    localStorage.setItem("userRole", this.role);
                    notify("Logged in successfully.", "success");
                    router.push(`/${this.role}/sections`);
                } catch (error) {
                    notify(error.message || error, "error");
                }
            }
        }
    },
};
</script>

<style></style>
