<template>
    <div class="section bg-footer">
        <div class="container">
            <div class="row">
                <div class="col-lg-3 mx-auto">
                    <div class="">
                        <h6 class="footer-heading text-uppercase text-white">
                            Information
                        </h6>
                        <ul class="list-unstyled footer-link mt-2">
                            <li>
                                <router-link :to="(role !== '' ? '/' : '') + role + '/sections'">Sections</router-link>
                            </li>
                            <li>
                                <router-link :to="(role !== '' ? '/' : '') + role + '/books'">Books</router-link>
                            </li>
                        </ul>
                    </div>
                </div>
                <div class="col-lg-3">
                    <div class="">
                        <h6 class="footer-heading text-uppercase text-white">
                            Resources
                        </h6>
                        <ul class="list-unstyled footer-link mt-2">
                            <li>
                                <a href="https://flask.palletsprojects.com/en/3.0.x/" target="_blank">Flask</a>
                            </li>
                            <li>
                                <a href="https://vuejs.org/guide/introduction.html" target="_blank">VueJs</a>
                            </li>
                        </ul>
                    </div>
                </div>
                <div class="col-lg-2 mx-1">
                    <div class="">
                        <h6 class="footer-heading text-uppercase text-white">
                            Help
                        </h6>
                        <ul class="list-unstyled footer-link mt-2">
                            <li>
                                <router-link to="/register">Register</router-link>
                            </li>
                            <li>
                                <router-link to="/login">Login</router-link>
                            </li>
                        </ul>
                    </div>
                </div>
                <div class="col-lg-3 mx-4">
                    <div class="">
                        <h6 class="footer-heading text-uppercase text-white mb-3">
                            Contact Us
                        </h6>
                        <ul class="list-unstyled footer-link">
                            <li>
                                <p class="contact-info">+91 6301516021</p>
                            </li>
                            <li>
                                <p class="contact-info">22f3002759@ds.study.iitm.ac.in</p>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
        <div class="text-center mt-2">
            <p class="footer-alt mb-0 f-14">
                Tummala Naveen, All Rights Reserved 2024
            </p>
        </div>
    </div>
</template>

<script>
export default {
    props: ["role"],
};
</script>

<style></style>
