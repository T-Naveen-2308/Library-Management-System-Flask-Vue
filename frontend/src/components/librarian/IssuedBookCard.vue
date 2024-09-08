<template>
    <div class="card h-100 special-card mx-1">
        <router-link :to="'/librarian/book/' + issuedbook.bookid" class="text-decoration-none text-muted">
            <img class="card-img-top mx-auto"
                :src="' http://127.0.0.1:5000/static/book/pictures/' + issuedbook.book.picture" alt="Card image cap"
                :style="{ width: '100%', height: '24vh' }" />
        </router-link>
        <div class="card-body">
            <router-link :to="'/librarian/book/' + issuedbook.bookid" class="text-decoration-none text-muted">
                <h4 class="card-title">{{ issuedbook.book.title }}</h4>
            </router-link>
            <h5 class="mt-1">To - {{ issuedbook.user.username }}</h5>
            <h5 class="mt-1">Till - {{ formatDateMethod(issuedbook.to_date) }}</h5>
        </div>
        <div class="container mb-3 text-center">
            <button @click="revokeAccess" class="btn btn-danger">
                <i class="bi bi-lock mr-1"></i>
                Revoke
            </button>
        </div>
    </div>
</template>

<script>
import { router } from "../../router.js";
import { notify } from "../utils/utils.js";
import { formatDate } from "../utils/utils.js";

export default {
    props: ["issuedbook"],
    methods: {
        async revokeAccess() {
            try {
                const response = await fetch(
                    `http://127.0.0.1:5000/api/librarian/revoke/${this.issuedbook.issueid}`,
                    {
                        method: "GET",
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
                        data.errors ||
                        "An error occurred while fetching sections."
                    );
                }
                notify("Revoked access to the book.", "success");
                router.push("/librarian/dummy").then(() => {
                    router.push("/librarian/requests");
                });
            } catch (error) {
                notify(error.message || error, "error");
            }
        },
        formatDateMethod(date) {
            return formatDate(date);
        }
    },
};
</script>

<style></style>
