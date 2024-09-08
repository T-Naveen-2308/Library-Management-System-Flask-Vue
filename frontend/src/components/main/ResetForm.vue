<template>
    <form @submit.prevent="submitForm" class="content-section p-5 form w-50 mx-auto">
        <h1 class="fs-2 text-center">Reset Request</h1>
        <hr class="fs-2 bold-hr" />
        <div class="form-group">
            <label class="fs-4 form-label mt-2" for="email">Email:</label>
            <input :class="'form-control form-control-lg special-input mt-1' + (errors.email ? ' is-invalid' : '')"
                type="email" id="email" v-model="formData.email" @input="validateEmail" />
            <p class="text-danger fs-6 mt-1" v-if="errors.email">
                {{ errors.email }}
            </p>
        </div>
        <div class="row mt-4">
            <div class="col-md-6">
                <button @click="goBack" class="btn btn-lg btn-danger">
                    <i class="bi bi-x-circle me-1"></i>
                    Cancel
                </button>
            </div>
            <div class="col-md-6 text-end">
                <button class="btn btn-lg btn-success" id="submit" name="submit" type="submit">
                    <i class="bi bi-send me-1"></i>
                    Request
                </button>
            </div>
        </div>
    </form>
</template>

<script>
import { router } from "../../router.js";
import { notify } from "../utils/utils.js";
import {
    emailValidator,
    check
} from "../utils/validators.js";

export default {
    data() {
        return {
            formData: {
                email: ""
            },
            errors: {
                email: ""
            }
        };
    },
    methods: {
        validateEmail() {
            this.errors.email = emailValidator(this.formData.email);
        },
        async submitForm() {
            this.validateEmail();
            if (check(this.errors)) {
                try {
                    const response = await fetch(`http://127.0.0.1:5000/api/main/reset`, {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify(this.formData)
                    });
                    const data = await response.json();
                    console.log(data);
                    if (!response.ok) {
                        throw new Error(
                            data.error || "An unexpected error occurred."
                        );
                    }
                    notify(data?.message, "success");
                    localStorage.setItem("token", data?.token);
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
