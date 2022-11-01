<script>
import ApiLog from './components/ApiLog.vue';
import Barchart from './components/Barchart.vue';
import ResourceView from './components/ResourceView.vue';

export default {
    components: { ApiLog, ResourceView, Barchart }
}
</script>

<template>
    <div>
        <Barchart />
        <ApiLog />
        <ResourceView />
    </div>
</template>