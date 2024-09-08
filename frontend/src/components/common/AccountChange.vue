<template>
    <form @submit.prevent="submitForm" class="content-section p-5 form w-50 mx-auto">
        <h1 class="fs-2 text-center">Change Password</h1>
        <hr class="fs-2 bold-hr" />
        <div class="form-group mt-2">
            <label class="fs-4 form-label mt-2" for="currentPassword">
                Current Password:
            </label>
            <input
                :class="'form-control form-control-lg special-input mt-1' + (errors.current_password ? ' is-invalid' : '')"
                :type="field1" id="currentPassword" v-model="formData.current_password" @input="validateCurrentPassword"
                maxLength="60" />
            <p class="text-danger fs-6 mt-1" v-if="errors.current_password">
                {{ errors.current_password }}
            </p>
        </div>
        <div class="mt-1">
            <input class="me-1 text-lg" type="checkbox" id="showCurrentPassword" @change="toggleField(1)" />
            <label for="showCurrentPassword">Show Current Password</label>
        </div>
        <div class="form-group mt-2">
            <label class="fs-4 form-label mt-2" for="newPassword">
                New Password:
            </label>
            <input
                :class="'form-control form-control-lg special-input mt-1' + (errors.new_password ? ' is-invalid' : '')"
                :type="field2" id="newPassword" v-model="formData.new_password" @input="validateNewPassword"
                maxLength="60" />
            <p class="text-danger fs-6 mt-1" v-if="errors.new_password">
                {{ errors.new_password }}
            </p>
        </div>
        <div class="mt-1">
            <input class="me-1 text-lg" type="checkbox" id="showNewPassword" @change="toggleField(2)" />
            <label for="showNewPassword">Show New Password</label>
        </div>
        <div class="form-group mt-2">
            <label class="fs-4 form-label mt-2" for="confirmPassword">
                Confirm Password:
            </label>
            <input
                :class="'form-control form-control-lg special-input mt-1' + (errors.confirm_password ? ' is-invalid' : '')"
                :type="field3" id="confirmPassword" v-model="formData.confirm_password" @input="validateConfirmPassword"
                maxLength="60" />
            <p class="text-danger fs-6 mt-1" v-if="errors.confirm_password">
                {{ errors.confirm_password }}
            </p>
        </div>
        <div class="mt-1">
            <input class="me-1 text-lg" type="checkbox" id="showConfirmPassword" @change="toggleField(3)" />
            <label for="showConfirmPassword">Show Confirm Password</label>
        </div>
        <div class="container mt-3"></div>
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
                <button class="btn btn-lg btn-success" id="submit" name="submit" type="submit">
                    <i class="bi bi-arrow-clockwise me-1"></i>
                    Change
                </button>
            </div>
        </div>
    </form>
</template>

<script>
import { router } from "../../router.js";
import { notify } from "../utils/utils.js";
import { passwordValidator, check } from "../utils/validators.js";

export default {
    props: ["role"],
    data() {
        return {
            formData: {
                current_password: "",
                new_password: "",
                confirm_password: ""
            },
            errors: {
                current_password: "",
                new_password: "",
                confirm_password: ""
            },
            field1: "password",
            field2: "password",
            field3: "password"
        };
    },
    methods: {
        toggleField(i) {
            if (i === 1) {
                this.field1 = this.field1 === "password" ? "text" : "password";
            } else if (i === 2) {
                this.field2 = this.field2 === "password" ? "text" : "password";
            } else if (i == 3) {
                this.field3 = this.field3 === "password" ? "text" : "password";
            }
        },
        validateCurrentPassword() {
            this.errors.current_password = passwordValidator(
                this.formData.current_password,
                false
            );
        },
        validateNewPassword() {
            this.errors.new_password = passwordValidator(
                this.formData.new_password
            );
        },
        validateConfirmPassword() {
            this.errors.confirm_password =
                this.formData?.confirm_password === this.formData?.new_password
                    ? ""
                    : "Confirm Password should be equal to New Password.";
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
            this.validateCurrentPassword();
            this.validateNewPassword();
            this.validateConfirmPassword();
            if (check(this.errors)) {
                try {
                    const response = await fetch(`http://127.0.0.1:5000/api/common/account`, {
                        method: "PUT",
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${localStorage.getItem(
                                "userToken"
                            )}`
                        },
                        body: JSON.stringify(this.formData)
                    });
                    const data = await response.json();
                    if (!response.ok) {
                        throw new Error(
                            data.error || "An unexpected error occurred."
                        );
                    }
                    notify(
                        "Password has been updated successfully.",
                        "success"
                    );
                    router.push(`/${this.role}/account`);
                } catch (error) {
                    notify(error.message || error, "error");
                }
            }
        },
        goBack() {
            router.back();
        }
    },
};
</script>

<style></style>
