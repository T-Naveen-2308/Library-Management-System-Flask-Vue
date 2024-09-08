<template>
    <div v-if="sections" class="content-section">
        <div v-if="role === 'librarian'" class="text-end container mt-2">
            <router-link to="/librarian/export">
                <button class="btn btn-secondary"><i class="bi bi-download me-1"></i> Export as CSV</button>
            </router-link>
        </div>
        <div class="container mb-4">
            <div class="row">
                <div v-for="(section, sectionIndex) in sections" :key="sectionIndex" class="col-md-4 mt-4">
                    <SectionCard :section="section" :role="role" />
                </div>
            </div>
        </div>
    </div>
    <div v-else class="content-section p-4">
        <h5> Loading... </h5>
    </div>
</template>

<script>
import { router } from "../../router.js";
import { notify } from "../utils/utils.js";
import { SectionCard } from "./index.js";

export default {
    props: ["role"],
    data() {
        return {
            sections: null,
            taskid: null,
            taskStatusInterval: null
        };
    },
    mounted() {
        this.fetchSections();
    },
    methods: {
        async fetchSections() {
            try {
                const response = await fetch("http://127.0.0.1:5000/api/main/sections");
                const data = await response.json();
                if (!response.ok) {
                    throw new Error(
                        data.error ||
                        "An error occurred while fetching sections."
                    );
                }
                this.sections = data?.sections;
                console.log(data?.datetime);
                if (this.role === "librarian") {
                    this.sections.push(null);
                }
            } catch (error) {
                notify(error.message || error, "error");
            }
        }
    },
    components: { SectionCard }
};
</script>

<style></style>
