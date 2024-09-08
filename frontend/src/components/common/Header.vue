<template>
    <div class="site-header">
        <nav class="navbar navbar-expand-md navbar-dark bg-steel fixed-top">
            <div class="container">
                <router-link class="mt-1 me-2" :to="(role !== '' ? '/' : '') + role + '/sections'">
                    <img class="logo-img" :src="libraryLogo" />
                </router-link>
                <div class="container mb-1 ms-5">
                    <form @submit.prevent="submitForm" class="form-inline h-75 w-75 mx-auto search-form mt-1">
                        <div class="input-group">
                            <input name="search_term" class="form-control special-input form-control-lg border-right-0"
                                placeholder="Search..." :style="{ height: '100%', boxSizing: 'border-box' }"
                                v-model="formData.search_term" maxLength="60" />
                            <div class="input-group-append">
                                <button class="btn btn-lg btn-primary border-left-0 d-flex align-items-center"
                                    type="submit" :style="{
                                        height: '100%',
                                        padding: '0 1rem',
                                        boxSizing: 'border-box'
                                    }">
                                    <i class="bi bi-search"></i>
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
                <div class="navbar-nav">
                    <router-link class="nav-item nav-link h4 font-weight-normal mt-2 mx-1"
                        :class="{ active: $route.meta.activeFor === 'sections' }"
                        :to="(role !== '' ? '/' : '') + role + '/sections'">
                        Sections
                    </router-link>
                    <router-link class="nav-item nav-link h4 font-weight-normal mt-2 mx-1"
                        :class="{ active: $route.meta.activeFor === 'books' }"
                        :to="(role !== '' ? '/' : '') + role + '/books'">
                        Books
                    </router-link>
                    <HeaderUserOrLibrarian v-if="role" :role="role" />
                    <router-link v-else class="nav-item nav-link h4 font-weight-normal mt-2 ms-2"
                        :class="{ active: $route.meta.activeFor === 'login' }" to="/login">
                        Login
                    </router-link>
                </div>
            </div>
        </nav>
    </div>
</template>

<script>
import { router } from "../../router.js";
import { notify } from "../utils/utils.js";
import { HeaderUserOrLibrarian } from "./index.js";
import { searchTermValidator, check } from "../utils/validators.js";
import libraryLogo from '../../assets/library_logo.jpg';

export default {
    props: ["role"],
    data() {
        return {
            libraryLogo,
            formData: {
                search_term: ""
            },
            errors: {
                search_term: ""
            }
        };
    },
    methods: {
        validateSearchTerm() {
            this.errors.username = searchTermValidator(
                this.formData?.search_term
            );
        },
        async submitForm() {
            this.validateSearchTerm();
            const search_term = this.formData.search_term;
            this.formData.search_term = "";
            if (check(this.errors)) {
                router.push({
                    path: `${this.role === "" ? "" : "/"}${this.role}/search`,
                    query: { search_term }
                });
            }
        }
    },
    components: { HeaderUserOrLibrarian }
};
</script>

<style></style>
