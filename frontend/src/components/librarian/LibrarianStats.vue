<template>
    <div class="container mt-4 mb-3">
        <h2 class="text-center">General Statistics</h2>
        <div class="row">
            <div v-for="(card, cardIndex) in cards" :key="cardIndex" class="col-md-2 mt-3 d-flex">
                <div class="card special-card" :style="{ minHeight: '10vh' }">
                    <div class="card-body">
                        <h3 class="card-title mt-1 fs-5">{{ card[0] }}:</h3>
                        <h4 class="card-title mt-1 fs-4">{{ card[1] }}</h4>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    props: ["cards"],
};
</script>

<style></style>
