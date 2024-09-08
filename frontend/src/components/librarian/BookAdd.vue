<template>
    <router-link :to="'/librarian/section/' + sectionid + '/add'"
        class="card-body text-decoration-none d-inline-flex align-items-center justify-content-center"
        :style="{ borderRadius: '6px' }">
        <i class="bi bi-plus-circle special-plus-icon"></i>
    </router-link>
</template>

<script>
export default {
    props: ["sectionid"],
};
</script>

<style></style>
