<template>
    <div class="row">
        <router-link :to="'/librarian/section/' + section.sectionid + '/add'">
            <button :class="'btn btn-success ' + cls + (section.title === 'Miscellaneous' ? ' mt-2' : '')">
                <i class="bi bi-plus-square me-1"></i>
                Add Book
            </button>
        </router-link>
    </div>
    <div v-if="section.title !== 'Miscellaneous'">
        <div class="row mt-2">
            <div :class="'col-md-' + (cls === 'btn-lg' ? '3' : '5 mx-auto')" @click="deleteSection">
                <button :class="'btn ' + cls + ' btn-danger'">
                    <i class="bi bi-trash"></i>
                    Delete
                </button>
            </div>
            <div :class="'col-md-' + (cls === 'btn-lg' ? '3 mt-1 text-start' : '5 mx-auto')">
                <router-link :to="'/librarian/section/' + section.sectionid + '/edit'">
                    <button :class="'btn ' + cls + ' btn-primary px-3'">
                        <i class="bi bi-pencil-square me-1"></i>
                        Edit
                    </button>
                </router-link>
            </div>
        </div>
    </div>
</template>

<script>
import { router } from "../../router.js";
import { notify } from "../utils/utils.js";

export default {
    props: ["section", "cls"],
    methods: {
        async deleteSection() {
            try {
                const response = await fetch(
                    `http://127.0.0.1:5000/api/librarian/section/${this.section?.sectionid}`,
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
                        data.error ||
                        "An error occurred while deleting section."
                    );
                }
                notify(
                    `Section ${this.section.title} deleted successfully.`,
                    "success"
                );
                router.push("/librarian/dummy").then(() => {
                    router.push("/librarian/sections");
                });
            } catch (error) {
                notify(error.message || error, "error");
            }
        }
    },
};
</script>

<style></style>
