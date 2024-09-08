<template>
    <form @submit.prevent="" class="content-section p-5 form w-50 mx-auto">
        <h1 class="fs-2 text-center">Delete Account</h1>
        <hr class="fs-2 bold-hr" />
        <p class="fs-4 mt-2">
            All the data associated with the Account will be deleted permanently.
            Are you sure that you want to delete your Account?
        </p>
        <div class="form-group mt-1">
            <label class="fs-4 form-label mt-2" for="password">Password:</label>
            <input :class="'form-control form-control-lg special-input mt-1' + (errors.password ? ' is-invalid' : '')"
                :type="field" id="password" v-model="formData.password" @input="validatePassword" maxLength="60" />
            <p class="text-danger fs-6 mt-1" v-if="errors.password">
                {{ errors.password }}
            </p>
        </div>
        <div class="mt-1">
            <input class="me-1 text-lg" type="checkbox" id="showPassword" @change="toggleField" />
            <label for="showPassword">Show Password</label>
        </div>
        <div class="container mt-3"></div>
        <a href="#" @click.prevent="forgotPassword">
            Forgot Password?
        </a>
        <div class="row mt-4">
            <div class="col-md-6">
                <button @click="goBack" class="btn btn-lg btn-success">
                    <i class="bi bi-x-circle me-1"></i>
                    Cancel
                </button>
            </div>
            <div class="col-md-6 text-end">
                <button class="btn btn-lg btn-danger" id="submit" name="submit" type="submit" data-bs-toggle="modal"
                    data-bs-target="#confirmDeleteModal">
                    <i class="bi bi-xl bi-person-x me-1"></i>
                    Delete
                </button>
            </div>
        </div>
        <div class="modal fade" id="confirmDeleteModal" tabindex="-1" aria-labelledby="confirmDeleteModalLabel"
            aria-hidden="true">
            <div class="modal-dialog">
                <div class="modal-content content-section">
                    <div class="modal-header">
                        <h5 class="modal-title" id="confirmDeleteModalLabel">
                            Confirm Deletion
                        </h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        Are you sure you want to delete your account? This action
                        cannot be undone.
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-success" data-bs-dismiss="modal">
                            <i class="bi bi-x-circle me-1"></i>
                            Cancel
                        </button>
                        <button type="button" class="btn btn-danger" @click="deleteAccount">
                            <i class="bi bi-xl bi-person-x me-1"></i>
                            Delete
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </form>
</template>

<script>
import { router } from "../../router.js";
import { notify } from "../utils/utils.js";
import { passwordValidator, check } from "../utils/validators.js";

export default {
    data() {
        return {
            formData: {
                password: ""
            },
            errors: {
                password: ""
            },
            field: "password"
        };
    },
    methods: {
        toggleField() {
            this.field = this.field === "password" ? "text" : "password";
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
        async deleteAccount() {
            this.validatePassword();
            if (check(this.errors)) {
                try {
                    const response = await fetch(`http://127.0.0.1:5000/api/user/account`, {
                        method: "POST",
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
                        "Account has been deleted successfully.",
                        "success"
                    );
                    router.push("/login");
                } catch (error) {
                    notify(error.message || error, "error");
                }
                var modalEl = document.getElementById("confirmDeleteModal");
                var modal = bootstrap.Modal.getInstance(modalEl);
                modal.hide();
            }
        },
        goBack() {
            router.back();
        }
    },
};
</script>

<style></style>
