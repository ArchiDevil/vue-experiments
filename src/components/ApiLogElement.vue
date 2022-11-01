<script>
import { useCallsStore } from '../stores/calls.js';

export default {
    props: ['model'],
    computed: {
        isSelected() {
            const store = useCallsStore()
            return store.selectedCall == this.model.id
        }
    },
    methods: {
        select() {
            const store = useCallsStore();
            store.selectCall(this.model.id);
        }
    },
    watch: {
        isSelected(val, oldVal) {
            if (val === true)
                this.$el.scrollIntoViewIfNeeded();
        }
    }
}
</script>

<template>
    <div>
        <p @click="select" :class="{selected: isSelected}">
            {{ model.id }} {{ model.name }}
        </p>
    </div>
</template>

<style scoped>
p {
    cursor: pointer;
    color: cornflowerblue;

    border: 2px solid coral;
    border-left: none;
    border-top: none;
    border-right: none;

    padding: 10px;

    margin: 0 0;
}

p.selected {
    background-color: lightgreen;
}

p:hover {
    color: blue;
}
</style>