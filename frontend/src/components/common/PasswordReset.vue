<template>
    <form @submit.prevent="submitForm" class="content-section p-5 form w-50 mx-auto">
        <h1 class="fs-2 text-center">Password Reset</h1>
        <hr class="fs-2 bold-hr" />
        <div class="form-group mt-2">
            <label class="fs-4 form-label mt-2" for="password">New Password:</label>
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
        <div class="container text-center mt-4">
            <button class="btn btn-lg btn-success" id="submit" name="submit" type="submit" value="Login">
                <i class="bi bi-arrow-counterclockwise"></i>
                Reset
            </button>
        </div>
    </form>
</template>

<script>
import { router } from "../../router.js";
import { notify } from "../utils/utils.js";
import { passwordValidator, check } from "../utils/validators.js";

export default {
    props: ["role", "token"],
    data() {
        return {
            formData: {
                password: "",
                confirmPassword: ""
            },
            errors: {
                password: "",
                confirmPassword: ""
            },
            field1: "password",
            field2: "password"
        };
    },
    mounted() {
        if (this.role === "" && !localStorage.getItem("token")) {
            notify(
                "You must send request for reset to access this page.",
                "error"
            );
            router.push("/request-reset");
            return;
        }
    },
    methods: {
        toggleField(i) {
            if (i === 1) {
                this.field1 = this.field1 === "password" ? "text" : "password";
            } else if (i === 2) {
                this.field2 = this.field2 === "password" ? "text" : "password";
            }
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
        async submitForm() {
            this.validatePassword();
            this.validateConfirmPassword();
            if (check(this.errors)) {
                try {
                    const response = await fetch(
                        `http://127.0.0.1:5000/api/${this.role === "" ? "main" : "common"
                        }/password-reset/${this.token}`,
                        {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json",
                                Authorization: `Bearer ${this.role === ""
                                    ? localStorage.getItem("token")
                                    : localStorage.getItem("userToken")
                                    }`
                            },
                            body: JSON.stringify(this.formData)
                        }
                    );
                    const data = await response.json();
                    if (!response.ok) {
                        throw new Error(
                            data.error || "An unexpected error occurred."
                        );
                    }
                    notify(
                        "Password changed successfully. Please log in with new password.",
                        "success"
                    );
                    router.push("/login");
                } catch (error) {
                    notify(error.message || error, "error");
                    router.push(
                        this.role === "" ? "/request-reset" : `/${role}/account`
                    );
                }
            }
        }
    },
};
</script>

<style></style>
