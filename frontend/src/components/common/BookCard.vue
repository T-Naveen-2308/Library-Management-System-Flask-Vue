<template>
    <div class="card special-card" :style="{ minHeight: '55vh' }">
        <div v-if="book">
            <router-link :to="(role !== '' ? '/' : '') + role + '/book/' + book?.bookid" class="text-decoration-none"
                :style="{ color: '#212529' }">
                <img class="card-img-top" :src="' http://127.0.0.1:5000/static/book/pictures/' + book?.picture"
                    alt="No Image" />
                <div class="card-body">
                    <h4 class="card-title">{{ book?.title }}</h4>
                    <h5 class="card-title mt-1">{{ book?.author }}</h5>
                    <p class="card-text fs-6 text-muted mt-1">
                        {{ book?.description }}
                    </p>
                </div>
            </router-link>
            <div v-if="request" class="container">
                <h5 class="mt-2">
                    {{ 'Requested on ' + formatDateMethod(request.date_modified) }}
                </h5>
            </div>
            <div v-if="issuedbook" class="container">
                <h5 class="mt-2">
                    {{ 'Till ' + formatDateMethod(issuedbook.to_date) }}
                </h5>
            </div>
            <div v-if="completed" class="container">
                <h5 class="mt-2">
                    {{ 'From ' + formatDateMethod(completed.from_date) }}
                </h5>
                <h5 class="mt-2">
                    {{ 'To ' + formatDateMethod(completed.to_date) }}
                </h5>
            </div>
            <div v-if="role === 'librarian'" class="container text-center mb-3 rounded-bottom">
                <LibrarianBookButtons :book="book" :cls="''" />
            </div>
            <div v-else class="container text-center mb-3 rounded-bottom">
                <BookButtons :issueid="issuedbook?.issueid" :feedbackid="feedbackid" :requestid="request?.requestid"
                    :book="book" :role="role" :cls="''" />
            </div>
        </div>
        <BookAdd :sectionid="sectionid" v-else />
    </div>
</template>

<script>
import { BookButtons } from "./index.js";
import { BookAdd, LibrarianBookButtons } from "../librarian/index.js";
import { formatDate } from "../utils/utils.js";
import { router } from "../../router.js";
import { notify } from "../utils/utils.js";

export default {
    props: ["role", "book", "sectionid", "feedbackid", "issuedbook", "request", "completed"],
    methods: {
        formatDateMethod(date) {
            return formatDate(date);
        }
    },
    components: {
        BookButtons,
        LibrarianBookButtons,
        BookAdd
    }
};
</script>

<style></style>
