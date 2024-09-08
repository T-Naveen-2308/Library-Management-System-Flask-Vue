<template>
    <router-link v-if="role === '' || (!issueid && !requestid)" :to="'/user/request/' + book?.bookid">
        <button :class="'btn ' + cls + ' btn-success mt-2'">
            <i class="bi bi-send me-1"></i>
            Request
        </button>
    </router-link>
    <button v-else-if="!issueid && requestid" @click="deleteRequest" :class="'btn ' + cls + ' btn-danger mt-2'">
        <i class="bi bi-x-circle mr-1"></i>
        Cancel Request
    </button>
    <div v-if="role === 'user' && issueid" class="row">
        <router-link v-if="feedbackid" :to="'/user/feedback/' + feedbackid + '/edit'">
            <button :class="'btn btn-dark ' + cls">
                <i class="bi bi-pencil-square me-1"></i>
                Edit Feedback
            </button>
        </router-link>
        <router-link v-else :to="'/user/feedback/' + book.bookid + '/add'">
            <button :class="'btn btn-primary ' + cls">
                <i class="bi bi-plus-square me-1"></i>
                Give Feedback
            </button>
        </router-link>
    </div>
    <div v-if="role === 'user' && issueid" class="row mt-2">
        <div :class="'col-md-' + (cls === 'btn-lg' ? '3' : '6 mx-auto')" @click="returnBook">
            <button :class="'btn ' + cls + ' btn-danger'">
                <i class="bi bi-arrow-bar-up me-1"></i>
                Return
            </button>
        </div>
        <div :class="'col-md-' + (cls === 'btn-lg' ? '3 mt-1 text-start' : '6 mx-auto')">
            <router-link :to="'/user/book/' + book.bookid + '/view'">
                <button :class="'btn ' + cls + ' btn-success px-3'">
                    <i class="bi bi-eye me-1"></i>
                    View
                </button>
            </router-link>
        </div>
    </div>
</template>

<script>
import { router } from "../../router.js";
import { notify } from "../utils/utils.js";

export default {
    props: ["role", "book", "cls", "issueid", "feedbackid", "requestid"],
    methods: {
        async returnBook() {
            try {
                const response = await fetch(
                    `http://127.0.0.1:5000/api/user/return/${this.issueid}`,
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
                const data = await response.json();
                if (!response.ok) {
                    throw new Error(
                        data.error ||
                        "An error occurred while returning the book."
                    );
                }
                notify(data?.message, "success");
                const path = this.$route.path;
                if (path.includes("/book/")) {
                    router.push("/user/dummy").then(() => {
                        router.push("/user/books");
                    });
                } else {
                    router.push("/user/dummy").then(() => {
                        router.push(path);
                    });
                }
            } catch (error) {
                notify(error.message || error, "error");
            }
        },
        async deleteRequest() {
            try {
                const response = await fetch(
                    `http://127.0.0.1:5000/api/user/request/${this.requestid}`,
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
                const data = response.json();
                if (!response.ok) {
                    throw new Error(
                        data.errors || "An unexpected error occurred."
                    );
                }
                notify("Request has been cancelled", "success");
                const path = this.$route.path;
                router.push("/user/dummy").then(() => {
                    router.push(path);
                });
            } catch (error) {
                notify(error.message || error, "error");
            }
        }
    },
};
</script>

<style></style>
