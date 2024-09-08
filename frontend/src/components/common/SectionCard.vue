<template>
    <div class="card h-100 special-card" :style="{ minHeight: '50vh' }">
        <div v-if="section">
            <router-link class="text-decoration-none" :style="{ color: '#212529' }"
                :to="(role !== '' ? '/' : '') + role + '/section/' + section?.sectionid">
                <img class="card-img-top mx-auto" :src="' http://127.0.0.1:5000/static/section/' + section?.picture"
                    alt="Card image cap" style="width: 100%; height: 30vh" />
                <div class="card-body">
                    <h4 class="card-title">{{ section?.title }}</h4>
                    <p class="card-text text-wrap fs-6 text-muted">
                        {{ section?.description }}
                    </p>
                </div>
            </router-link>
            <div v-if="role === 'librarian'" class="container text-center mb-3 rounded-bottom">
                <SectionButtons :section="section" :cls="''" />
            </div>
        </div>
        <SectionAdd v-else />
    </div>
</template>

<script>
import { SectionAdd, SectionButtons } from "../librarian/index.js";

export default {
    props: ["section", "role"],
    components: { SectionButtons, SectionAdd }
};
</script>

<style></style>
