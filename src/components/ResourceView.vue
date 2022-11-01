<script>
import { useCallsStore } from '../stores/calls';

export default {
    computed: {
        selectedCall() {
            return useCallsStore().selectedCall;
        }
    },
    data() {
        return {}
    }
}
</script>

<template>
    <div style="width: 500px;">
        <h2>Resource View</h2>
        <p>Selected call index: {{ selectedCall }}</p>
    </div>
</template>
