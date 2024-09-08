<template>
    <div v-if="sections && (role !== 'user' || userBooks)" class="content-section pt-4 px-4">
        <div v-if="role === 'librarian'" class="text-end container mt-2">
            <router-link to="/librarian/export">
                <button class="btn btn-secondary"><i class="bi bi-download me-1"></i> Export as CSV</button>
            </router-link>
        </div>
        <div v-for="(section, index) in sections" :key="index" class="mb-5">
            <div v-if="section">
                <router-link :to="(role !== '' ? '/' : '') + role + '/section/' + section?.sectionid"
                    class="text-decoration-none mt-4" :style="{ color: '#212529' }">
                    <h2 :style="{ fontSize: '2.3rem' }">{{ section?.title }}</h2>
                </router-link>
                <div v-if="section.books?.length > 0">
                    <div class="row">
                        <div v-for="(book, bookIndex) in section?.books" :key="bookIndex"
                            class="col-md-3 mt-3 mt-2 d-flex">
                            <BookCard :request="userBooks?.[book?.bookid]?.request"
                                :issuedbook="userBooks?.[book?.bookid]?.issuedbook"
                                :feedbackid="userBooks?.[book?.bookid]?.feedback?.feedbackid" :role="role" :book="book"
                                :sectionid="section.sectionid" />
                        </div>
                    </div>
                </div>
                <div v-else>
                    <h3 class="mt-2">There are no books in this section</h3>
                </div>
            </div>
            <div v-else>
                <router-link to="/librarian/section/add" class="text-decoration-none mt-4"
                    :style="{ color: '#212529' }">
                    <h2 :style="{ fontSize: '2.3rem' }">Add Section</h2>
                </router-link>
                <div class="row">
                    <div class="col-md-4">
                        <div class="card h-100 special-card" :style="{ minHeight: '50vh' }">
                            <SectionAdd />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <div v-else class="content-section p-4">
        <h5> Loading... </h5>
    </div>
</template>

<script>
import { SectionAdd } from "../librarian/index.js";
import { BookCard } from "./index.js";
import { router } from "../../router.js";
import { notify } from "../utils/utils.js";

export default {
    props: ["role"],
    data() {
        return {
            sections: null,
            userBooks: null
        };
    },
    mounted() {
        this.fetchBooks();
        if (this.role === "user") {
            this.fetchUserBooks();
        }
    },
    methods: {
        async fetchBooks() {
            try {
                const response = await fetch("http://127.0.0.1:5000/api/main/books");
                if (!response.ok) {
                    throw new Error("Network response was not ok.");
                }
                const data = await response.json();
                this.sections = data?.sections;
                console.log(data?.datetime);
                if (this.role === "librarian") {
                    for (let i = 0; i < this.sections.length; i++) {
                        this.sections[i]?.books?.push(null);
                    }
                    this.sections.push(null);
                }
            } catch (error) {
                console.error("Error fetching sections:", error);
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
    components: { BookCard, SectionAdd }
};
</script>

<style></style>
