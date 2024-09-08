<template>
    <router-link :to="'/librarian/book/' + book.bookid + '/view'" class="text-center">
        <button :class="'btn ' + cls + ' btn-success px-3'">
            <i class="bi bi-eye me-1"></i>
            View
        </button>
    </router-link>
    <div class="row mt-2">
        <div :class="'col-md-' + (cls === 'btn-lg' ? '3' : '6 mx-auto')">
            <button :class="'btn ' + cls + ' btn-danger px-3'" @click="deleteBook">
                <i class="bi bi-trash"></i>
                Delete
            </button>
        </div>
        <div :class="'col-md-' + (cls === 'btn-lg' ? '3 text-start' : '6 mx-auto')">
            <router-link :to="'/librarian/book/' + book.bookid + '/edit'">
                <button :class="'btn ' + cls + ' btn-primary px-3'">
                    <i class="bi bi-pencil-square me-1"></i>
                    Edit
                </button>
            </router-link>
        </div>
    </div>
</template>

<script>
import { router } from "../../router.js";
import { notify } from "../utils/utils.js";

export default {
    props: ["book", "cls"],
    methods: {
        async deleteBook() {
            try {
                const response = await fetch(
                    `http://127.0.0.1:5000/api/librarian/book/${this.book?.bookid}`,
                    {
                        method: "DELETE",
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${localStorage.getItem(
                                "userToken"
                            )}`
                        }
                    }
                );
                if (!response.ok) {
                    throw new Error(
                        data.error ||
                        "An error occurred while deleting section."
                    );
                }
                notify(
                    `Section ${this.book.title} deleted successfully.`,
                    "success"
                );
                const path = this.$route.path;
                if (path.includes("/book/")) {
                    router.push("/librarian/dummy").then(() => {
                        router.push("/librarian/books");
                    });
                } else {
                    router.push("/librarian/dummy").then(() => {
                        router.push(path);
                    });
                }
            } catch (error) {
                notify(error.message || error, "error");
            }
        }
    },
};
</script>

<style></style>
