<template>
    <div v-if="data && (role !== 'user' || userBooks)" class="content-section container px-4 pb-5">
        <h2 class="ms-2" :style="{ fontSize: '2.3rem' }">Showing Results for "{{ searchTerm }}"</h2>
        <div class="row">
            <div v-if="data.sections?.length > 0 || data.books?.length > 0 || data.authors?.length > 0">
                <div v-if="data.sections?.length > 0" class="container mt-3">
                    <h2>Section Matches</h2>
                    <div class="row">
                        <div v-for="(section, sectionIndex) in data.sections" :key="sectionIndex"
                            class="col-md-4 d-flex">
                            <SectionCard :section="section" :role="role" />
                        </div>
                    </div>
                </div>
                <div v-if="data.books?.length > 0" class="container mt-4">
                    <h2>Book Matches</h2>
                    <div class="row">
                        <div v-for="(book, bookIndex) in data.books" :key="bookIndex" class="col-md-3 mt-3 d-flex">
                            <BookCard :request="userBooks?.[book.bookid]?.request"
                                :issuedbook="userBooks?.[book.bookid]?.issuedbook"
                                :feedbackid="userBooks?.[book.bookid]?.feedback?.feedbackid" :book="book"
                                :role="role" />
                        </div>
                    </div>
                </div>
                <div v-if="data.authors?.length > 0" class="container mt-4">
                    <h2>Author Matches</h2>
                    <div class="row">
                        <div v-for="(author, authorIndex) in data.authors" :key="authorIndex"
                            class="col-md-3 mt-3 d-flex">
                            <BookCard :request="userBooks?.[author.bookid]?.request"
                                :issuedbook="userBooks?.[author.bookid]?.issuedbook"
                                :feedbackid="userBooks?.[author.bookid]?.feedback?.feedbackid" :book="author"
                                :role="role" />
                        </div>
                    </div>
                </div>
            </div>
            <div v-else class="container mt-4">
                <h2 class="mx-auto mt-3">No Results Found.</h2>
            </div>
        </div>
    </div>
    <div v-else class="content-section p-4">
        <h5> Loading... </h5>
    </div>
</template>

<script>
import { router } from "../../router.js";
import { notify } from "../utils/utils.js";
import { BookCard, SectionCard } from "./index.js";

export default {
    props: ["role"],
    data() {
        return {
            searchTerm: "",
            data: null,
            userBooks: null
        };
    },
    mounted() {
        this.searchTerm = this.$route.query.search_term;
        this.fetchSearch();
        if (this.role === "user") {
            this.fetchUserBooks();
        }
    },
    methods: {
        async fetchSearch() {
            try {
                const response = await fetch("http://127.0.0.1:5000/api/main/search", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({ search_term: this.searchTerm })
                });
                const data = await response.json();
                if (!response.ok) {
                    throw new Error(
                        data.error ||
                        "An error occurred while fetching sections."
                    );
                }
                this.data = data;
                console.log(this.data?.datetime);
            } catch (error) {
                notify(error.message || error, "error");
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
    watch: {
        "$route.query.search_term"(newTerm) {
            this.searchTerm = newTerm;
        }
    },
    components: { SectionCard, BookCard }
};
</script>

<style></style>
