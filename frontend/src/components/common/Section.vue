<template>
    <div v-if="section && (role !== 'user' || userBooks)" class="content-section pt-4 pb-5 px-4">
        <div class="row">
            <div class="col-md-3 mt-3">
                <img alt="No Image" class="img-fluid special-card mb-3"
                    :src="' http://127.0.0.1:5000/static/section/' + section?.picture" :style="{ height: '35vh' }" />
            </div>
            <div class="col-md-8">
                <h1>{{ section?.title }}</h1>
                <p class="fs-4 text-muted">{{ section?.description }}</p>
                <SectionButtons v-if="role === 'librarian'" :section="section" :cls="'btn-lg'" />
            </div>
        </div>
        <hr />
        <h1>Books</h1>
        <div v-if="section?.books?.length > 0">
            <div class="row">
                <div v-for="(book, index) in section?.books" :key="index" class="col-md-3 mt-3 d-flex">
                    <BookCard :request="userBooks?.[book.bookid]?.request"
                        :issuedbook="userBooks?.[book.bookid]?.issuedbook"
                        :feedbackid="userBooks?.[book.bookid]?.feedback?.feedbackid" :book="book" :role="role"
                        :sectionid="sectionid" />
                </div>
            </div>
        </div>
        <div v-else="">
            <h4>No books available</h4>
        </div>
    </div>
    <div v-else class="content-section p-4">
        <h5> Loading... </h5>
    </div>
</template>

<script>
import { router } from "../../router.js";
import { notify } from "../utils/utils.js";
import { BookCard } from "./index.js";
import { SectionButtons } from "../librarian/index.js";

export default {
    props: ["sectionid", "role"],
    data() {
        return {
            section: null,
            userBooks: null
        };
    },
    mounted() {
        this.fetchSection();
        if (this.role === "user") {
            this.fetchUserBooks();
        }
    },
    methods: {
        async fetchSection() {
            try {
                const response = await fetch(
                    `http://127.0.0.1:5000/api/main/section/${this.sectionid}`
                );
                if (!response.ok) {
                    throw new Error("Network response was not ok.");
                }
                const data = await response.json();
                this.section = data?.section;
                console.log(data?.datetime);
                if (this.role === "librarian") {
                    this.section?.books?.push(null);
                }
            } catch (error) {
                notify(
                    error.message || "Error fetching sections:" + error,
                    "error"
                );
            }
        },
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
                this.userBooks = data;
            } catch (error) {
                notify(error.message || error, "error");
            }
        }
    },
    components: { SectionButtons, BookCard }
};
</script>

<style></style>
