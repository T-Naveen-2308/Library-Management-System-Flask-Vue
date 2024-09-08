<template>
    <form @submit.prevent="submitForm" class="content-section p-5 form w-50 mx-auto">
        <h1 class="fs-2 text-center">{{ role.charAt(0).toUpperCase() + role.slice(1) }} Feedback</h1>
        <hr class="fs-2 bold-hr" />
        <div class="form-group mt-3">
            <label for="book" class="form-label fs-4">Book:</label>
            <select :class="'form-select form-select-lg special-input ' + (role === 'edit' ? ' disabled-style' : '')"
                v-model="formData.bookid" :disabled="role === 'edit'">
                <option v-for="(book, index) in books" :key="index" :value="book.bookid">
                    {{ book.title }}
                </option>
            </select>
            <p class="text-danger fs-6 mt-1" v-if="errors.bookid">
                {{ errors.bookid }}
            </p>
        </div>
        <div class="form-group">
            <label class="fs-4 form-label mt-3">Rating:</label>
            <div class="radio-group">
                <div v-for="val in [1, 2, 3, 4, 5]" class="form-check">
                    <input type="radio" :id="'option-' + val" :value="val" v-model="formData.rating"
                        class="form-check-input" />
                    <label class="form-check-label fs-4 ms-2" :for="'option-' + val">{{ val }}</label>
                </div>
            </div>
            <p class="text-danger fs-6 mt-1" v-if="errors.rating">
                {{ errors.rating }}
            </p>
        </div>
        <div class="form-group">
            <label class="fs-4 form-label mt-3" for="content">Content:</label>
            <textarea :class="'form-control form-control-lg special-input mt-1' + (errors.content ? ' is-invalid' : '')"
                id="content" v-model="formData.content" @input="validateContent" maxLength="120" />
            <p class="text-danger mt-1" v-if="errors.content">
                {{ errors.content }}
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
import { descriptionValidator, check } from "../utils/validators.js";

export default {
    props: ["role", "feedbackid", "bookid"],
    data() {
        return {
            formData: {
                bookid: "",
                rating: "",
                content: ""
            },
            errors: {
                bookid: "",
                rating: "",
                content: ""
            },
            books: {}
        };
    },
    mounted() {
        this.fetchUserBooks();
    },
    methods: {
        async fetchUserBooks() {
            try {
                const response = await fetch("http://127.0.0.1:5000/api/user/books", {
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
                        data.error || "An error occurred while fetching books."
                    );
                }
                let check_bookid = null;
                if (this.role === "edit") {
                    for (let bookid in data) {
                        if (
                            data[bookid]?.feedback?.feedbackid ===
                            this.feedbackid
                        ) {
                            this.formData.rating =
                                data[bookid]?.feedback?.rating;
                            this.formData.content =
                                data[bookid]?.feedback?.content;
                            this.formData.bookid =
                                data[bookid]?.feedback?.bookid;
                            check_bookid = bookid;
                            break;
                        }
                    }
                    if (!check_bookid) {
                        notify("Feedback not found.", "error");
                        router.back();
                        return;
                    }
                } else {
                    check_bookid = this.bookid;
                }
                if (!data[check_bookid]?.issuedbook) {
                    notify("Book not found in issued books.", "error");
                    router.back();
                }
                if (this.role === "add" && data[check_bookid].feedback) {
                    notify(
                        "You can only give one feedback. Please edit your existing feedback.",
                        "warning"
                    );
                    router.back();
                }
                if (this.role === "add") {
                    this.books = [];
                    for (let bookid in data) {
                        if (data[bookid]?.issuedbook) {
                            this.books.push(data[bookid]?.book);
                        }
                    }
                } else {
                    this.books = [];
                    for (let bookid in data) {
                        if (
                            data[bookid]?.issuedbook &&
                            data[bookid]?.feedback
                        ) {
                            this.books.push(data[bookid]?.book);
                        }
                    }
                }
                if (this.role === "add") {
                    this.formData.bookid = this.bookid;
                    this.formData.rating = 5;
                }
            } catch (error) {
                notify(error.message || error, "error");
            }
        },
        validateBookID() {
            if (this.formData.bookid === "") {
                this.errors.bookid = "Please select a book.";
                return;
            }
            let flag = false;
            for (let book of this.books) {
                console.log(book);
                if (Number(book?.bookid) === this.formData.bookid) {
                    flag = true;
                    break;
                }
            }
            if (flag) {
                this.errors.bookid = "";
            } else {
                this.errors.bookid = "Invalid Book ID.";
            }
        },
        validateRating() {
            this.errors.rating =
                this.formData.rating >= 1 && this.formData.rating <= 5
                    ? ""
                    : "Invalid number of days.";
        },
        validateContent() {
            this.errors.content = descriptionValidator(this.formData.content);
            if (this.errors.content) {
                this.errors.content = this.errors.content.replace(
                    "Description",
                    "Content"
                );
            }
        },
        async submitForm() {
            this.validateBookID();
            this.validateRating();
            this.validateContent();
            if (check(this.errors)) {
                try {
                    const response = await fetch(
                        `http://127.0.0.1:5000/api/user/feedback/${this.role === "edit"
                            ? this.feedbackid
                            : this.formData.bookid
                        }`,
                        {
                            method: this.role === "add" ? "POST" : "PUT",
                            headers: {
                                "Content-Type": "application/json",
                                Authorization: `Bearer ${localStorage.getItem(
                                    "userToken"
                                )}`
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
                        `Feedback for the book has been ${this.role === "add" ? "created" : "updated"
                        } successfully.`,
                        "success"
                    );
                    router.push(`/user/mybooks`);
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
