<template>
    <div v-if="book" class="content-section p-4">
        <router-link :to="'/' + role + '/book/' + book?.bookid" class="text-decoration-none"
            :style="{ color: '#212529' }">
            <h1 class="text-center mt-2">{{ book?.title }}</h1>
        </router-link>
        <hr />
        <div class="mt-3" id="pdf-viewer1" :style="{ textAlign: 'center' }"></div>
    </div>
    <div v-else class="content-section p-4">
        <h5> Loading... </h5>
    </div>
</template>

<script>
import { router } from "../../router.js";
import { notify } from "../utils/utils.js";

export default {
    props: ["role", "bookid"],
    data() {
        return {
            book: null
        };
    },
    async mounted() {
        await this.fetchBook();
        if (this.book) {
            this.pdfViewer("/static/book/pdfs/" + this.book.pdf_file);
        }
    },
    methods: {
        async fetchBook() {
            try {
                const response = await fetch(
                    `http://127.0.0.1:5000/api/${this.role}/view-book/${this.bookid}`,
                    {
                        method: "GET",
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${localStorage.getItem(
                                "userToken"
                            )}`
                        }
                    }
                );
                const data = await response.json();
                if (!response.ok) {
                    throw new Error(
                        data.error || "Error occurred while fetching book."
                    );
                }
                this.book = data;
                console.log(this.book?.datetime);
            } catch (error) {
                notify(error.message || error, "error");
                router.back();
            }
        },
        pdfViewer(pdfPath) {
            const viewerContainer = document.querySelector("#pdf-viewer1");
            if (!viewerContainer) {
                console.log(
                    "PDF viewer container not found. Please ensure the 'pdf-viewer1' id exists in your HTML."
                );
                return;
            }
            const loadingTask = pdfjsLib.getDocument(pdfPath);
            loadingTask.promise.then((pdf) => {
                for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
                    pdf.getPage(pageNum)
                        .then((page) => {
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
                            const viewport = page.getViewport({ scale: 1.5 });
                            canvas.height = viewport.height;
                            canvas.width = viewport.width;

                            const renderContext = {
                                canvasContext: context,
                                viewport: viewport
                            };
                            page.render(renderContext);
                        })
                        .catch((error) => {
                            console.error("Error rendering PDF:", error);
                        });
                }
            });
        }
    },
};
</script>

<style></style>
