<template>
    <div class="content-section p-4">
        <h1 class="text-center mt-2">Export</h1>
        <hr />
        <div class="row mt-3">
            <h2 class="col-md-1 text-end">1)</h2>
            <div class="col-md-3 text-start">
                <button @click="exportCSV('sections')" class="btn btn-lg btn-secondary">
                    <i class="bi bi-download me-1"></i> Export Sections
                </button>
            </div>
        </div>
        <div class="row mt-3">
            <h2 class="col-md-1 text-end">2)</h2>
            <div class="col-md-3 text-start">
                <button @click="exportCSV('books')" class="btn btn-lg btn-secondary">
                    <i class="bi bi-download me-1"></i> Export Books
                </button>
            </div>
        </div>
        <div class="row mt-3">
            <h2 class="col-md-1 text-end">3)</h2>
            <div class="col-md-4 text-start">
                <button @click="exportCSV('requests')" class="btn btn-lg btn-secondary">
                    <i class="bi bi-download me-1"></i> Export Pending Requests
                </button>
            </div>
        </div>
        <div class="row mt-3">
            <h2 class="col-md-1 text-end">4)</h2>
            <div class="col-md-4 text-start">
                <button @click="exportCSV('issuedbooks')" class="btn btn-lg btn-secondary">
                    <i class="bi bi-download me-1"></i> Export Currently Issuedbooks
                </button>
            </div>
        </div>
    </div>
</template>

<script>
import { router } from "../../router.js";
import { notify } from "../utils/utils.js";

export default {
    data() {
        return {
            taskid: null,
            taskStatusInterval: null
        };
    },
    methods: {
        async exportCSV(name) {
            try {
                const response = await fetch(`http://127.0.0.1:5000/api/librarian/export/${name}`, {
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
                        `An error occurred while exporting ${name}.`
                    );
                }
                this.taskid = data.taskid;
                notify(
                    "The export request has been sent. Please wait while we process.",
                    "success"
                );
                this.checkTaskStatus();
            } catch (error) {
                notify(error.message || error, "error");
            }
        },
        checkTaskStatus() {
            this.taskStatusInterval = setInterval(() => {
                fetch(`http://127.0.0.1:5000/api/librarian/export-result/${this.taskid}`, {
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
                            const file = data?.file;
                            notify(
                                "Exporting completed successfully. Downloading the file.",
                                "success"
                            );
                            window.location.href = `http://127.0.0.1:5000/static/user/stats/${file}`;
                            setTimeout(() => {
                                router.back();
                            }, 500);
                        } else {
                            clearInterval(this.taskStatusInterval);
                            notify(
                                "Some unexpected error occurred.",
                                "error"
                            );
                            setTimeout(() => {
                                router.back();
                            }, 500);
                        }
                    })
                    .catch((error) => {
                        console.error("Error checking task status:", error);
                        clearInterval(this.taskStatusInterval);
                        notify(
                            "An error occurred while checking the export status.",
                            "error"
                        );
                        setTimeout(() => {
                            router.back();
                        }, 500);
                    });
            }, 500);
        }
    },
};
</script>

<style></style>
