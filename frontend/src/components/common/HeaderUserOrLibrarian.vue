<template>
    <router-link v-if="role == 'librarian'" class="nav-item nav-link h4 mt-2 mx-1"
        :class="{ active: $route.meta.activeFor === 'requests' }" to="/librarian/requests">
        Requests
    </router-link>
    <router-link v-else class="nav-item nav-link h4 mt-2 mx-1" :class="{ active: $route.meta.activeFor === 'mybooks' }"
        to="/user/mybooks">
        MyBooks
    </router-link>
    <router-link class="nav-item nav-link h4 mt-2 mx-1" :class="{ active: $route.meta.activeFor === 'stats' }"
        :to="'/' + role + '/stats'">
        Stats
    </router-link>
    <router-link class="nav-item rounded-pill nav-link" :class="{ active: $route.meta.activeFor === 'account' }"
        :to="'/' + role + '/account'">
        <img :src="user?.profile_picture ? ('http://127.0.0.1:5000/static/user/profile_pictures/' + user.profile_picture) : ('http://127.0.0.1:5000/static/user/profile_pictures/default_profile_picture.png')"
            class="rounded-circle nav-img" />
    </router-link>
</template>

<script>
import { router } from "../../router.js";
import { notify } from "../utils/utils.js";

export default {
    props: ["role"],
    data() {
        return {
            user: {}
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
