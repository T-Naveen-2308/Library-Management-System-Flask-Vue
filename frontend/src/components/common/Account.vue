<template>
    <div v-if="user" class="content-section mx-auto text-center p-4">
        <img class="rounded-circle account-img card mx-auto"
            :src="' http://127.0.0.1:5000/static/user/profile_pictures/' + user.profile_picture" alt="No Image"
            :style="{ width: '27%' }" />
        <div class="container">
            <h1 class="account-heading">{{ user.name }}</h1>
            <div class="d-flex justify-content-center">
                <i class="bi bi-person-circle me-2" :style="{ fontSize: '1.8rem' }"></i>
                <h3 class="mt-1">{{ user.username }}</h3>
            </div>
            <div class="d-flex justify-content-center">
                <i class="bi bi-envelope me-2" :style="{ fontSize: '1.8rem' }"></i>
                <h3 class="mt-1">{{ user.email }}</h3>
            </div>
            <div class="row">
                <div v-if="role === 'librarian'" class="col-md-3 mt-3"></div>
                <div :class="'col-md-' + (role === 'user' ? '4' : '3')">
                    <router-link :to="'/' + role + '/account/edit'">
                        <button class="btn btn-lg btn-primary">
                            <i class="bi bi-pencil-square me-1"></i>
                            Edit Profile
                        </button>
                    </router-link>
                </div>
                <div :class="'col-md-' + (role === 'user' ? '4' : '3')">
                    <router-link :to="'/' + role + '/account/change'">
                        <button class="btn btn-lg btn-success">
                            <i class="bi bi-arrow-clockwise me-1"></i>
                            Change Password
                        </button>
                    </router-link>
                </div>
                <div v-if="role === 'user'" class="col-md-4">
                    <router-link to="/user/account/delete">
                        <button class="btn btn-lg btn-danger">
                            <i class="bi bi-xl bi-person-x me-1"></i>
                            Delete Profile
                        </button>
                    </router-link>
                </div>
                <div v-else class="col-md-3 mt-3"></div>
            </div>
            <router-link :to="role === 'librarian' ? '/lib-login' : '/login'">
                <button class="btn btn-lg btn-dark mt-3 mb-2">
                    <i class="bi bi-box-arrow-right me-1"></i>
                    Logout
                </button>
            </router-link>
        </div>
    </div>
    <div v-else class="content-section p-4">
        <h5> Loading... </h5>
    </div>
</template>

<script>
import { router } from "../../router.js";
import { notify } from "../utils/utils.js";

export default {
    props: ["role"],
    data() {
        return {
            user: null
        };
    },
    mounted() {
        this.fetchUser();
    },
    methods: {
        async fetchUser() {
            try {
                const response = await fetch("http://127.0.0.1:5000/api/common/account", {
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
                this.user = data;
            } catch (error) {
                notify(error.message || error, "error");
            }
        }
    },
};
</script>

<style></style>
