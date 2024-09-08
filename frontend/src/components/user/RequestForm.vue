<template>
    <form @submit.prevent="submitForm" class="content-section p-5 form w-50 mx-auto">
        <h1 class="fs-2 text-center">Request Book</h1>
        <hr class="fs-2 bold-hr" />
        <div class="form-group mt-3">
            <label for="book" class="form-label fs-4">Book:</label>
            <select class="form-select form-select-lg special-input" v-model="formData.bookid">
                <option v-for="(book, index) in books" :key="index" :value="book.bookid">
                    {{ book.title }}
                </option>
            </select>
            <p class="text-danger fs-6 mt-1" v-if="errors.bookid">
                {{ errors.bookid }}
            </p>
        </div>
        <div class="form-group">
            <label class="fs-4 form-label mt-2" for="title">Days:</label>
            <input :class="'form-control form-control-lg special-input mt-1' + (errors.days ? ' is-invalid' : '')"
                type="number" id="title" v-model="formData.days" @input="validateDays" :min="1" :max="7" />
            <p class="text-danger fs-6 mt-1" v-if="errors.days">
                {{ errors.days }}
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
import { check } from "../utils/validators.js";

export default {
    props: ["bookid"],
    data() {
        return {
            formData: {
                bookid: "",
                days: ""
            },
            errors: {
                bookid: "",
                days: ""
            },
            books: []
        };
    },
    mounted() {
        this.fetchBooks();
        this.formData.days = 3;
        this.formData.bookid = this.bookid;
    },
    methods: {
        async fetchBooks() {
            try {
                const response = await fetch("http://127.0.0.1:5000/api/user/books-list", {
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
                this.books = data;
                let flag = true;
                for (let book of this.books) {
                    if (book.bookid === this.bookid) {
                        flag = false;
                        break;
                    }
                }
                if (flag) {
                    notify(
                        "The book has already been issued or requested.",
                        "error"
                    );
                    router.push("/user/mybooks");
                }
                this.formData.days = 3;
                this.formData.bookid = this.bookid;
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
        validateDays() {
            this.errors.days =
                this.formData.days >= 1 && this.formData.days <= 7
                    ? ""
                    : "Invalid number of days.";
        },
        async submitForm() {
            this.validateBookID();
            this.validateDays();
            if (check(this.errors)) {
                try {
                    const formData = new FormData();
                    formData.append("days", this.formData.days);
                    const response = await fetch(
                        `http://127.0.0.1:5000/api/user/request/${this.formData.bookid}`,
                        {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json",
                                Authorization: `Bearer ${localStorage.getItem(
                                    "userToken"
                                )}`
                            },
                            body: JSON.stringify({ days: this.formData.days })
                        }
                    );
                    const data = await response.json();
                    if (!response.ok) {
                        throw new Error(
                            data.error || "An unexpected error occurred."
                        );
                    }
                    notify(
                        "Book has been requested successfully.",
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
