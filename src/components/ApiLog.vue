<script>
import ApiLogElement from './ApiLogElement.vue';
import CallsModel from '../models/calls.js';

export default {
    data() {
        return {
            elements: CallsModel().calls
        }
    },
    components: { ApiLogElement }
}
</script>

<template>
    <div style="width: 500px;">
        <h2>Api Log</h2>
        <div style="width: 400px; max-height: 250px; overflow: scroll; overflow-x: hidden;">
            <ApiLogElement v-for="element in elements" :model="element" />
        </div>
    </div>
</template>
