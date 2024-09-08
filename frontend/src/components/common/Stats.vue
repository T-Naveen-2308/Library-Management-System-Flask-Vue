<template>
    <div v-if="paths" class="content-section p-4">
        <LibrarianStats v-if="role === 'librarian'" :cards="paths?.cards" />
        <div class="row container mt-4">
            <div class="col-md-6 mx-auto text-center">
                <h3 class="text-center">Books Issued</h3>
                <img :src="' http://127.0.0.1:5000/static/user/stats/' + paths?.section_bar_path"
                    class="img-fluid ms-3 mt-3" :style="{ height: '55vh', borderRadius: '7px' }" />
            </div>
            <div class="col-md-6 mx-auto text-center">
                <h3 class="text-center">Section Distribution</h3>
                <img :src="' http://127.0.0.1:5000/static/user/stats/' + paths?.section_pie_path" class="img-fluid mt-3"
                    :style="{ height: '55vh', width: '32vw', borderRadius: '7px' }" />
            </div>
        </div>
        <div class="row container mt-4">
            <div class="col-md-6 mx-auto text-center">
                <h3 class="text-center">Requests</h3>
                <img :src="' http://127.0.0.1:5000/static/user/stats/' + paths?.status_bar_path"
                    class="img-fluid ms-3 mt-3" :style="{ height: '55vh', borderRadius: '7px' }" />
            </div>
            <div class="col-md-6 mx-auto text-center">
                <h3 class="text-center">Status Distribution</h3>
                <img :src="' http://127.0.0.1:5000/static/user/stats/' + paths?.status_pie_path" class="img-fluid mt-3"
                    :style="{ height: '55vh', width: '32vw', borderRadius: '7px' }" />
            </div>
        </div>
    </div>
    <div v-else class="content-section p-4">
        <h5>Loading...</h5>
    </div>
</template>

<script>
import { router } from "../../router.js";
import { notify } from "../utils/utils.js";
import { LibrarianStats } from "../librarian/index.js";

export default {
    props: ["role"],
    data() {
        return {
            paths: null
        };
    },
    mounted() {
        this.fetchPaths();
    },
    methods: {
        async fetchPaths() {
            try {
                const response = await fetch("http://127.0.0.1:5000/api/common/stats", {
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
                        "An error occurred while fetching statistics."
                    );
                }
                this.taskid = data?.taskid;
                this.checkTaskStatus();
                notify(
                    "Please wait while we load the statistics.",
                    "info"
                );
            } catch (error) {
                notify(error.message || error, "error");
            }
        },
        checkTaskStatus() {
            this.taskStatusInterval = setInterval(() => {
                fetch(`http://127.0.0.1:5000/api/common/stats/${this.taskid}`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${localStorage.getItem(
                            "userToken"
                        )}`
                    }
                })
                    .then((response) => {
                        return response.json();
                    })
                    .then((data) => {
                        if (data?.status === "Task is not ready.") {
                        } else if (data?.status === "Task is ready.") {
                            clearInterval(this.taskStatusInterval);
                            notify(
                                "Statistics have been loaded.",
                                "success"
                            );
                            this.paths = data;
                            console.log(this.paths.cards);
                        } else {
                            clearInterval(this.taskStatusInterval);
                            notify(
                                "Some unexpected error occurred.",
                                "error"
                            );
                        }
                    })
                    .catch((error) => {
                        console.error("Error checking task status:", error);
                        clearInterval(this.taskStatusInterval);
                        notify(
                            "An error occurred while checking the export status.",
                            "error"
                        );
                    });
            }, 500);
        }
    },
    components: { LibrarianStats }
};
</script>

<style></style>
