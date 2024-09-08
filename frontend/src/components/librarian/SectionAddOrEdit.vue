<template>
    <form @submit.prevent="submitForm" class="content-section p-5 form w-50 mx-auto" enctype="multipart/form-data">
        <h1 class="fs-2 text-center">{{ role.charAt(0).toUpperCase() + role.slice(1) }} Section</h1>
        <hr class="fs-2 bold-hr" />
        <div class="form-group">
            <label class="fs-4 form-label mt-2" for="title">Title:</label>
            <input :class="'form-control form-control-lg special-input mt-1' + (errors.title ? ' is-invalid' : '')"
                type="text" id="title" v-model="formData.title" @input="validateTitle" maxLength="60" />
            <p class="text-danger fs-6 mt-1" v-if="errors.title">
                {{ errors.title }}
            </p>
        </div>
        <div class="form-group">
            <label class="fs-4 form-label mt-3" for="description">Description:</label>
            <textarea
                :class="'form-control form-control-lg special-input mt-1' + (errors.description ? ' is-invalid' : '')"
                id="description" v-model="formData.description" @input="validateDescription" maxLength="120" />
            <p class="text-danger mt-1" v-if="errors.description">
                {{ errors.description }}
            </p>
        </div>
        <div v-if="role === 'edit'" class="form-group">
            <label class="fs-4 form-label mt-3">Delete Profile Picture:</label>
            <div class="radio-group">
                <div v-for="val in ['yes', 'no']" class="form-check">
                    <input type="radio" :id="'delete-' + val" :value="val" v-model="formData.delete_picture"
                        class="form-check-input" />
                    <label class="form-check-label fs-4 ms-2" :for="'delete-' + val">{{ val.charAt(0).toUpperCase() +
                        val.slice(1) }}</label>
                </div>
            </div>
            <p class="text-danger fs-6 mt-1" v-if="errors.delete_picture">
                {{ errors.delete_picture }}
            </p>
        </div>
        <div class="form-group">
            <label class="fs-4 form-label mt-3" for="picture">Picture:</label>
            <input class="form-control special-file-upload special-input form-control-lg form-control-file mt-1"
                type="file" id="picture" accept="image/png,image/jpeg,image/jpg" @change="handlePictureChange" />
            <p class="text-danger fs-6 mt-1" v-if="errors.picture">
                {{ errors.picture }}
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
                <button v-if="role === 'add'" class="btn btn-lg btn-success" id="submit" name="submit" type="submit">
                    <i class="bi bi-plus-square me-1"></i>
                    Add
                </button>
                <button v-else class="btn btn-lg btn-primary" id="submit" name="submit" type="submit">
                    <i class="bi bi-pencil-square me-1"></i>
                    Edit
                </button>
            </div>
        </div>
    </form>
</template>

<script>
import {
    titleValidator,
    descriptionValidator,
    check,
    pictureValidator
} from "../utils/validators.js";
import { router } from "../../router.js";
import { notify } from "../utils/utils.js";

export default {
    props: ["role", "sectionid"],
    data() {
        return {
            formData: {
                title: "",
                description: "",
                delete_picture: "",
                picture: null
            },
            errors: {
                title: "",
                description: "",
                email: "",
                delete_picture: "",
                picture: ""
            }
        };
    },
    mounted() {
        if (this.role === "edit") {
            this.fetchSection();
        }
        this.formData.delete_picture = "no";
    },
    methods: {
        async fetchSection() {
            try {
                const response = await fetch(
                    `http://127.0.0.1:5000/api/main/section/${this.sectionid}`
                );
                const data = await response.json();
                if (!response.ok) {
                    throw new Error(
                        data.error ||
                        "An error occurred while fetching section."
                    );
                }
                for (let key in this.formData) {
                    this.formData[key] = data?.section[key];
                }
                this.formData.picture = null;
                this.formData.delete_picture = "no";
            } catch (error) {
                notify(error.message || error, "error");
            }
        },
        validateTitle() {
            this.errors.title = titleValidator(this.formData.title);
        },
        validateDescription() {
            this.errors.description = descriptionValidator(
                this.formData.description
            );
        },
        validateDeletePicture() {
            if (
                this.formData.delete_picture !== "yes" &&
                this.formData.delete_picture !== "no"
            ) {
                this.errors.delete_picture = "Please select a valid option.";
            } else {
                this.errors.delete_picture = "";
            }
        },
        validatePicture() {
            this.errors.picture = pictureValidator(this.formData.picture);
        },
        handlePictureChange(event) {
            const file = event.target.files[0];
            if (file) {
                this.formData.picture = file;
                this.validatePicture();
            }
        },
        async submitForm() {
            this.validateTitle();
            this.validateDescription();
            this.validatePicture();
            if (this.role === "edit") {
                this.validateDeletePicture();
            }
            if (check(this.errors)) {
                try {
                    const formData = new FormData();
                    formData.append("title", this.formData.title);
                    formData.append("description", this.formData.description);
                    if (this.formData.picture) {
                        formData.append("picture", this.formData.picture);
                    }
                    if (this.role === "edit") {
                        formData.append(
                            "delete_picture",
                            this.formData.delete_picture
                        );
                    }
                    const response = await fetch(
                        `http://127.0.0.1:5000/api/librarian/section${this.role === "edit" ? '/' + this.sectionid : ''
                        }`,
                        {
                            method: this.role === "add" ? "POST" : "PUT",
                            headers: {
                                Authorization: `Bearer ${localStorage.getItem(
                                    "userToken"
                                )}`
                            },
                            body: formData
                        }
                    );
                    const data = await response.json();
                    if (!response.ok) {
                        throw new Error(
                            data.error || "An unexpected error occurred."
                        );
                    }
                    notify(
                        `Section ${this.formData.title} has been ${this.role}ed successfully.`,
                        "success"
                    );
                    router.push(`/librarian/sections`);
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
