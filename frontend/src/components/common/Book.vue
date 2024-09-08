<template>
    <div v-if="book && (role !== 'user' || userBooks) && (role !== 'librarian' || libbook)"
        class="content-section pt-4 pb-5 px-4">
        <div class="row">
            <div class="col-md-3 mt-3">
                <img :src="' http://127.0.0.1:5000/static/book/pictures/' + book?.picture" alt="No Image"
                    class="img-fluid special-card mb-3" :style="{ height: '40vh' }" />
            </div>
            <div class="col-md-8">
                <h2>{{ book?.title }}</h2>
                <h3>{{ book?.author }}</h3>
                <router-link :to="(role !== '' ? '/' : '') + role + '/section/' + book?.sectionid"
                    class="text-decoration-none" :style="{ color: '#212529' }">
                    <h4>{{ book?.section?.title }}</h4>
                </router-link>
                <p class="fs-4 text-muted">{{ book?.description }}</p>
                <LibrarianBookButtons v-if="role === 'librarian'" :book="book" :cls="'btn-lg'" />
                <BookButtons v-else :requestid="userBooks?.[book?.bookid]?.request?.requestid"
                    :issueid="userBooks?.[book?.bookid]?.issuedbook?.issueid"
                    :feedbackid="userBooks?.[book?.bookid]?.feedback?.feedbackid" :book="book" :role="role"
                    :cls="'btn-lg'" />
            </div>
        </div>
        <hr />
        <h2 class="text-center mt-2">Preview</h2>
        <div class="mt-3" id="pdf-viewer2" :style="{ textAlign: 'center' }"></div>
        <div v-if="role === 'librarian'">
            <hr />
            <h2 class="mr-5">Requests</h2>
            <div v-if="libbook?.requests?.length > 0" class="row">
                <div v-for="(request, requestIndex) in libbook?.requests" :key="requestIndex" class="col-md-3 mt-3">
                    <RequestCard :request="request" />
                </div>
            </div>
            <h4 v-else class="mr-5">There are no pending requests.</h4>
            <hr />
            <h2 class="mr-5">Currently Issued Books</h2>
            <div v-if="libbook?.issuedbooks?.length > 0" class="row">
                <div v-for="(issuedbook, issuedbookIndex) in libbook?.issuedbooks" :key="issuedbookIndex"
                    class="col-md-3 mt-3">
                    <IssuedBookCard :issuedbook="issuedbook" />
                </div>
            </div>
            <h4 v-else class="mr-5">There are no issued books.</h4>
        </div>
        <hr />
        <h2 class="mt-2">Feedbacks</h2>
        <div v-if="book?.feedbacks && book?.feedbacks.length > 0" class="mt-3">
            <div class="list-group">
                <div v-for="(feedback, index) in book?.feedbacks" :key="index"
                    class="list-group-item d-flex flex-column flex-md-row mb-4 p-4 border rounded custom-feedback-bg">
                    <div class="d-flex w-100 justify-content-between align-items-start">
                        <div class="mb-3 mb-md-0">
                            <h5 class="mb-1">{{ feedback.user?.name }}</h5>
                            <p class="mb-0 fs-5">Rating: {{ feedback.rating }}/5</p>
                            <p class="mt-1 fs-5 mb-0 custom-feedback-content">{{ feedback.content }}</p>
                        </div>
                        <div>
                            <small class="text-muted">{{ formatDateMethod(feedback.date_modified) }}</small>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div v-else>
            <h4>No feedbacks available.</h4>
        </div>
    </div>
    <div v-else class="content-section p-4">
        <h5> Loading... </h5>
    </div>
</template>

<script>
import { BookButtons } from "./index.js";
import {
    LibrarianBookButtons,
    IssuedBookCard,
    RequestCard
} from "../librarian/index.js";
import { formatDate } from "../utils/utils.js";
import { router } from "../../router.js";
import { notify } from "../utils/utils.js";


export default {
    props: ["bookid", "role"],
    data() {
        return {
            book: null,
            libbook: null,
            userBooks: null
        };
    },
    async mounted() {
        if (this.role === "librarian") {
            await this.fetchLibBook();
        }
        if (this.role === "user") {
            await this.fetchUserBooks();
        }
        await this.fetchBook();
        if (
            this.book &&
            (this.role !== "user" || this.userBooks) &&
            (this.role !== "librarian" || this.libbook)
        ) {
            this.pdfViewer("/static/book/pdfs/" + this.book?.pdf_file);
        }
    },
    methods: {
        async fetchBook() {
            try {
                const response = await fetch(`http://127.0.0.1:5000/api/main/book/${this.bookid}`);
                const data = await response.json();
                if (!response.ok) {
                    throw new Error(
                        data.error ||
                        "Some error occurred while fetching book?."
                    );
                }
                this.book = data?.book;
                console.log(data?.datetime);
            } catch (error) {
                notify(
                    error.message || "Error fetching book:" + error,
                    "error"
                );
            }
        },
        async fetchLibBook() {
            try {
                const response = await fetch(
                    `http://127.0.0.1:5000/api/librarian/book/${this.bookid}`,
                    {
                        method: "GET",
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: localStorage.getItem("userToken")
                        }
                    }
                );
                if (!response.ok) {
                    throw new Error("Network response was not ok.");
                }
                const data = await response.json();
                this.libbook = data;
            } catch (error) {
                notify(
                    error.message || "Error fetching librarian book:" + error,
                    "error"
                );
            }
        },
        async fetchUserBooks() {
            try {
                const response = await fetch("http://127.0.0.1:5000/api/user/books", {
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
                        data.error || "An error occurred while fetching books."
                    );
                }
                this.userBooks = data;
            } catch (error) {
                notify(error.message || error, "error");
            }
        },
        pdfViewer(pdfPath) {
            const viewerContainer = document.querySelector("#pdf-viewer2");
            if (!viewerContainer) {
                console.log(
                    "PDF viewer container not found. Please ensure the 'pdf-viewer2' id exists in your HTML."
                );
                return;
            }
            const loadingTask = pdfjsLib.getDocument(pdfPath);
            loadingTask.promise
                .then((pdf) => {
                    for (let pageNum = 1; pageNum <= 1; pageNum++) {
                        pdf.getPage(pageNum).then((page) => {
                            const container = document.createElement("div");
                            container.className = "pdf-page";
                            container.style.display = "inline-block";
                            container.style.margin = "0 auto";
                            container.style.marginBottom = "10px";
                            container.style.border = "1px solid #ccc";
                            viewerContainer.appendChild(container);

                            const canvas = document.createElement("canvas");
                            container.appendChild(canvas);

                            const context = canvas.getContext("2d");
                            const viewport = page.getViewport({ scale: 1 });
                            const scale = 600 / viewport.height;
                            const scaledViewport = page.getViewport({ scale });

                            canvas.height = scaledViewport.height;
                            canvas.width = scaledViewport.width;

                            const renderContext = {
                                canvasContext: context,
                                viewport: scaledViewport
                            };
                            page.render(renderContext);
                        });
                    }
                })
                .catch((error) => {
                    console.error("Error rendering PDF:", error);
                });
        },
        formatDateMethod(date) {
            return formatDate(date);
        }
    },
    components: {
        BookButtons,
        LibrarianBookButtons,
        IssuedBookCard,
        RequestCard
    }
};
</script>

<style></style>
