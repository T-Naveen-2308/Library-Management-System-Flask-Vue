<template>
    <div class="content-section container px-4 pb-4">
        <div class="text-end container mt-2">
            <router-link to="/librarian/export">
                <button class="btn btn-secondary"><i class="bi bi-download me-1"></i> Export as CSV</button>
            </router-link>
        </div>
        <div class="container mt-2">
            <h2 class="col-md-2">Requests</h2>
            <div v-if="requests.requests?.length > 0" class="row">
                <div v-for="(request, requestIndex) in requests.requests" :key="requestIndex" class="col-md-3 mt-3">
                    <RequestCard :request="request" />
                </div>
            </div>
            <h4 v-else class="mt-2">There are no pending requests.</h4>
        </div>
        <div class="container mt-4">
            <h2 class="col-md-4">Currently Issued Books</h2>
            <div v-if="requests.issuedbooks?.length > 0" class="row">
                <div v-for="(issuedbook, issuedbookIndex) in requests.issuedbooks" :key="issuedbookIndex"
                    class="col-md-3 mt-3">
                    <IssuedBookCard :issuedbook="issuedbook" />
                </div>
            </div>
            <h4 v-else class="mt-2">There are no issued books.</h4>
        </div>
    </div>
</template>

<script>
import { router } from "../../router.js";
import { notify } from "../utils/utils.js";
import { IssuedBookCard, RequestCard } from "./index.js";

export default {
    data() {
        return {
            requests: {}
        };
    },
    mounted() {
        this.fetchRequests();
    },
    methods: {
        async fetchRequests() {
            try {
                const response = await fetch("http://127.0.0.1:5000/api/librarian/requests", {
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
                        "An error occurred while fetching sections."
                    );
                }
                this.requests = data;
            } catch (error) {
                notify(error.message || error, "error");
            }
        }
    },
    components: { RequestCard, IssuedBookCard }
};
</script>

<style></style>
