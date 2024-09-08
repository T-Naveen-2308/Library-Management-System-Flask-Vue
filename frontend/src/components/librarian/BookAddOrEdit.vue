<template>
    <form @submit.prevent="submitForm" class="content-section p-5 form w-50 mx-auto" enctype="multipart/form-data">
        <h1 class="fs-2 text-center">{{ role.charAt(0).toUpperCase() + role.slice(1) }} Book</h1>
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
            <label class="fs-4 form-label mt-2" for="author">Author:</label>
            <input :class="'form-control form-control-lg special-input mt-1' + (errors.author ? ' is-invalid' : '')"
                type="text" id="author" v-model="formData.author" @input="validateAuthor" maxLength="60" />
            <p class="text-danger fs-6 mt-1" v-if="errors.author">
                {{ errors.author }}
            </p>
        </div>
        <div class="form-group mt-3">
            <label for="section" class="form-label fs-4">Section:</label>
            <select class="form-select form-select-lg special-input" v-model="formData.sectionid">
                <option v-for="(section, index) in sections" :key="index" :value="section.sectionid">
                    {{ section.title }}
                </option>
            </select>
            <p class="text-danger fs-6 mt-1" v-if="errors.sectionid">
                {{ errors.sectionid }}
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
                    <input type="radio" :id="'delete-picture-' + val" :value="val" v-model="formData.delete_picture"
                        class="form-check-input" />
                    <label class="form-check-label fs-4 ms-2" :for="'delete-picture-' + val">{{
                        val.charAt(0).toUpperCase() + val.slice(1) }}</label>
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
        <div v-if="role === 'edit'" class="form-group">
            <label class="fs-4 form-label mt-3">Delete PDF:</label>
            <div class="radio-group">
                <div v-for="val in ['yes', 'no']" class="form-check">
                    <input type="radio" :id="'delete-pdf-' + val" :value="val" v-model="formData.delete_pdf_file"
                        class="form-check-input" />
                    <label class="form-check-label fs-4 ms-2" :for="'delete-pdf-' + val">{{ val.charAt(0).toUpperCase()
                        + val.slice(1) }}</label>
                </div>
            </div>
            <p class="text-danger fs-6 mt-1" v-if="errors.delete_pdf_file">
                {{ errors.delete_pdf_file }}
            </p>
        </div>
        <div class="form-group">
            <label class="fs-4 form-label mt-3" for="pdffile">PDF File:</label>
            <input class="form-control special-file-upload special-input form-control-lg form-control-file mt-1"
                type="file" id="pdffile" accept="application/pdf" @change="handlePDFFileChange" />
            <p class="text-danger fs-6 mt-1" v-if="errors.pdf_file">
                {{ errors.pdf_file }}
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
import { router } from "../../router.js";
import { notify } from "../utils/utils.js";
import {
    nameValidator,
    titleValidator,
    descriptionValidator,
    check,
    pictureValidator,
    pdfValidator
} from "../utils/validators.js";

export default {
    props: ["role", "bookid", "sectionid"],
    data() {
        return {
            formData: {
                title: "",
                author: "",
                sectionid: "",
                description: "",
                delete_picture: "",
                picture: null,
                delete_pdf_file: "",
                pdf_file: null
            },
            errors: {
                title: "",
                author: "",
                sectionid: "",
                description: "",
                email: "",
                delete_picture: "",
                picture: "",
                delete_pdf_file: "",
                pdf_file: ""
            },
            sections: []
        };
    },
    mounted() {
        this.fetchSections();
        if (this.role === "edit") {
            this.fetchBook();
        }
        this.formData.delete_picture = "no";
        this.formData.delete_pdf_file = "no";
    },
    methods: {
        async fetchSections() {
            try {
                const response = await fetch("http://127.0.0.1:5000/api/main/sections");
                const data = await response.json();
                if (!response.ok) {
                    throw new Error(
                        data.error ||
                        "An error occurred while fetching sections."
                    );
                }
                this.sections = data?.sections;
                if (this.role === "add") {
                    this.formData.sectionid = this.sectionid;
                }
            } catch (error) {
                notify(error.message || error, "error");
            }
        },
        async fetchBook() {
            try {
                const response = await fetch(`http://127.0.0.1:5000/api/main/book/${this.bookid}`);
                const data = await response.json();
                if (!response.ok) {
                    throw new Error(
                        data.error ||
                        "An error occurred while fetching section."
                    );
                }
                for (let key in this.formData) {
                    this.formData[key] = data?.book[key];
                }
                this.formData.picture = null;
                this.formData.delete_picture = "no";
                this.formData.pdf_file = null;
                this.formData.delete_pdf_file = "no";
                if (this.role === "add") {
                    this.formData.sectionid = this.sectionid;
                } else {
                    this.formData.sectionid = Number(data?.book.sectionid);
                }
            } catch (error) {
                notify(error.message || error, "error");
            }
        },
        validateTitle() {
            this.errors.title = titleValidator(this.formData.title);
        },
        validateAuthor() {
            this.errors.author = nameValidator(this.formData.author);
        },
        validateSectionID() {
            if (this.formData.sectionid === "") {
                this.errors.sectionid = "Please select a section.";
                return;
            }
            let flag = false;
            for (let section of this.sections) {
                if (Number(section?.sectionid) === this.formData.sectionid) {
                    flag = true;
                    break;
                }
            }
            if (flag) {
                this.errors.sectionid = "";
            } else {
                this.errors.sectionid = "Invalid book ID.";
            }
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
                this.errors.delete_picture = "Please select an option.";
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
        validateDeletePDFFile() {
            if (
                this.formData.delete_pdf_file !== "yes" &&
                this.formData.delete_pdf_file !== "no"
            ) {
                this.errors.delete_pdf_file = "Please select an option.";
            } else {
                this.errors.delete_pdf_file = "";
            }
        },
        validatePDFFile() {
            this.errors.pdf_file = pdfValidator(this.formData.pdf_file);
        },
        handlePDFFileChange(event) {
            const file = event.target.files[0];
            if (file) {
                this.formData.pdf_file = file;
                this.validatePDFFile();
            }
        },
        async submitForm() {
            this.validateTitle();
            this.validateAuthor();
            this.validateDescription();
            this.validatePicture();
            this.validatePDFFile();
            if (this.role === "edit") {
                this.validateDeletePicture();
                this.validateDeletePDFFile();
            }
            if (check(this.errors)) {
                try {
                    const formData = new FormData();
                    formData.append("title", this.formData.title);
                    formData.append("author", this.formData.author);
                    if (this.role === "edit") {
                        formData.append("sectionid", this.formData.sectionid);
                    }
                    formData.append("description", this.formData.description);
                    formData.append(
                        "delete_picture",
                        this.formData.delete_picture
                    );
                    if (this.formData.picture) {
                        formData.append("picture", this.formData.picture);
                    }
                    formData.append(
                        "delete_pdf_file",
                        this.formData.delete_pdf_file
                    );
                    if (this.formData.pdf_file) {
                        formData.append("pdf_file", this.formData.pdf_file);
                    }
                    const response = await fetch(
                        `http://127.0.0.1:5000/api/librarian/book/${this.role === "edit"
                            ? this.bookid
                            : this.formData.sectionid
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
                        `Section ${this.formData.title} has been ${this.role === "add" ? "created" : "updated"
                        } successfully.`,
                        "success"
                    );
                    router.push(`/librarian/books`);
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
