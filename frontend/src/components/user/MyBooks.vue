<template>
    <div class="content-section container">
        <div class="container mt-3">
            <h2>Current</h2>
            <div v-if="mybooks.current?.length > 0" class="row">
                <div v-for="(issuedbook, issuedbookIndex) in mybooks.current" :key="issuedbookIndex"
                    class="col-md-3 mt-3">
                    <BookCard :book="issuedbook.book" :issuedbook="issuedbook"
                        :feedbackid="mybooks?.feedbackids[issuedbook.issueid]" role="user" />
                </div>
            </div>
            <h4 v-else class="mt-3">You haven't borrowed any book.</h4>
        </div>
        <div class="container mt-4">
            <h2>Requests</h2>
            <div v-if="mybooks.requests?.length > 0" class="row">
                <div v-for="(request, requestIndex) in mybooks.requests" :key="requestIndex" class="col-md-3 mt-3">
                    <RequestCard :request="request" />
                </div>
            </div>
            <h4 v-else class="mt-3">There are no requests.</h4>
        </div>
        <div class="container mt-4 mb-4">
            <h2>Completed</h2>
            <div v-if="mybooks.completed?.length > 0" class="row">
                <div v-for="(issuedbook, issuedbookIndex) in mybooks.completed" :key="issuedbookIndex"
                    class="col-md-3 mt-3">
                    <BookCard :book="issuedbook.book" :completed="issuedbook" :role="role" />
                </div>
            </div>
            <h4 v-else class="=mt-3">There are no completed books.</h4>
        </div>
    </div>
</template>

<script>
import { router } from "../../router.js";
import { notify } from "../utils/utils.js";
import { BookCard } from "../common/index.js";
import { RequestCard } from "./index.js";

export default {
    data() {
        return {
            mybooks: {}
        };
    },
    mounted() {
        this.fetchMyBooks();
    },
    methods: {
        async fetchMyBooks() {
            try {
                const response = await fetch("http://127.0.0.1:5000/api/user/mybooks", {
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
                        data.error ||
                        "An error occurred while fetching my books."
                    );
                }
                this.mybooks = data;
            } catch (error) {
                notify(error.message || error, "error");
            }
        }
    },
    components: { BookCard, RequestCard }
};
</script>

<style></style>
