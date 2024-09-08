<template>
    <div class="card h-100 special-card mx-1">
        <router-link :to="'/user/book/' + request.bookid" class="text-decoration-none text-muted">
            <img class="card-img-top mx-auto"
                :src="' http://127.0.0.1:5000/static/book/pictures/' + request.book.picture" alt="Card image cap"
                :style="{ width: '100%', height: '25vh' }" />

        </router-link>
        <div class="card-body">
            <router-link :to="'/user/book/' + request.bookid" class="text-decoration-none text-muted">
                <h4 class="card-title">{{ request.book.title }}</h4>
            </router-link>
            <h5 class="mt-2">For - {{ request.days }} days</h5>
            <h5 class="mt-2">
                Status -&nbsp;
                <span
                    :class="'text-' + (request.status === 'pending' ? 'warning' : request.status === 'rejected' ? 'danger' : 'success')">
                    {{ request.status[0].toUpperCase() + request.status.slice(1) }}
                </span>
            </h5>
            <h5 class="mt-2 mb-2">{{ (request.status === 'pending' ? 'Requested' : request.status[0].toUpperCase() +
                request.status.slice(1)) + ' on ' + formatDateMethod(request.date_modified) }}</h5>
        </div>
        <div v-if="request.status == 'pending'" class="container text-center mb-3 rounded-bottom">
            <button @click="deleteRequest" :class="'btn btn-danger mt-1'">
                <i class="bi bi-x-circle mr-1"></i>
                Cancel
            </button>
        </div>
    </div>
</template>

<script>
import { router } from "../../router.js";
import { notify } from "../utils/utils.js";
import { formatDate } from "../utils/utils.js";

export default {
    props: ["request"],
    methods: {
        formatDateMethod(date) {
            return formatDate(date);
        },
        async deleteRequest() {
            try {
                const response = await fetch(
                    `http://127.0.0.1:5000/api/user/request/${this.request.requestid}`,
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
