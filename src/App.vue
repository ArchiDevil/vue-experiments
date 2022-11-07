<script>
import ApiLog from './components/ApiLog.vue';
import Barchart from './components/Barchart.vue';
import ResourceView from './components/ResourceView.vue';
import TimelineView from './components/TimelineView.vue';

export default {
    components: { ApiLog, ResourceView, Barchart, TimelineView }
}
</script>

<template>
    <div>
        <Barchart />
        <TimelineView />
        <ApiLog />
        <ResourceView />
    </div>
</template>