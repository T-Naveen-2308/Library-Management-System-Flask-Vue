<template>
    <div>
        <header>
            <Header :role="role" />
        </header>
        <p> &nbsp; </p>
        <div :style="{ minHeight: '60vh', marginTop: '14vh' }">
            <div class="container">
                <router-view :key="$route.fullPath"></router-view>
            </div>
        </div>
        <footer :style="{ marginTop: '11vh' }">
            <Footer :role="role" />
        </footer>
    </div>
</template>

<script>
import { router } from "../../router.js";
import { notify } from "../utils/utils.js";
import { Header, Footer } from "./index.js";

export default {
    props: ["role"],
    components: {
        Header,
        Footer
    }
};
</script>

<style></style>
