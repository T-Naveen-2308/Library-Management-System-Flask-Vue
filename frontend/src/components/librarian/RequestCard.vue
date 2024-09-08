<template>
    <div class="card h-100 special-card mx-1">
        <router-link :to="'/librarian/book/' + request.bookid" class="text-decoration-none text-muted">
            <img class="card-img-top mx-auto"
                :src="' http://127.0.0.1:5000/static/book/pictures/' + request.book.picture" alt="Card image cap"
                :style="{ width: '100%', height: '24vh' }" />
        </router-link>
        <div class="card-body">
            <router-link :to="'/librarian/book/' + request.bookid" class="text-decoration-none text-muted">
                <h4 class="card-title">{{ request.book.title }}</h4>
            </router-link>
            <h5 class="mt-1">By - {{ request.user.username }}</h5>
            <h5 class="mt-2">For - {{ request.days }} days</h5>
        </div>
        <div class="row mb-3 ms-1 me-1">
            <div class="col-md-6">
                <button @click="updateRequest('rejected')" class="btn btn-danger">
                    <i class="bi bi-x-circle"></i>
                    Reject
                </button>
            </div>
            <div class="col-md-6 text-end">
                <button @click="updateRequest('accepted')" class="btn btn-success">
                    <i class="bi bi-book"></i>
                    Grant
                </button>
            </div>
        </div>
    </div>
</template>

<script>
import { router } from "../../router.js";
import { notify } from "../utils/utils.js";

export default {
    props: ["request"],
    methods: {
        async updateRequest(status) {
            try {
                const response = await fetch(
                    `http://127.0.0.1:5000/api/librarian/request/${this.request.requestid}`,
                    {
                        method: "PUT",
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${localStorage.getItem(
                                "userToken"
                            )}`
                        },
                        body: JSON.stringify({ status: status })
                    }
                );
                const data = response.json();
                if (!response.ok) {
                    throw new Error(
                        data.errors || "An unexpected error occurred."
                    );
                }
                notify(`The request has been ${status}.`, "success");
                router.push("/librarian/dummy").then(() => {
                    router.push("/librarian/requests");
                });
            } catch (error) {
                notify(error.message || error, "error");
            }
        }
    },
};
</script>

<style></style>
