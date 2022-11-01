<script>
import Chart from 'chart.js/auto';
import { shallowRef } from 'vue';
import { getRelativePosition } from 'chart.js/helpers';
import CallsModel from '../models/calls.js';
import { useCallsStore } from '../stores/calls.js';

export default {
    mounted() {
        let chart = document.getElementById('barchart')
        let labels = CallsModel().calls.map((call) => call.id)
        let values = CallsModel().calls.map((call) => call.duration)
        let data = {
            labels: labels,
            datasets: [{
                data: values,
                barPercentage: 1.0,
                categoryPercentage: 1.0,
            }],
        }
        let options = {
            scales: {
                y: { beginAtZero: true }
            },
            elements: {
                bar: {
                    backgroundColor: '#FFAA55',
                    borderWidth: 2,
                    borderColor: '#FFA000',
                }
            },
            plugins: {
                legend: {
                    display: false
                }
            },
            interaction: {
                mode: 'x',
                intersect: false
            },
            events: ['click'],
            onClick: (e) => {
                const canvasPosition = getRelativePosition(e, chart);
                const dataX = myChart.scales.x.getValueForPixel(canvasPosition.x);
                let store = useCallsStore()
                store.selectCall(dataX)
            },
            hover: {
                mode: 'x',
                intersect: false
            },
            responsive: false
        }
        let config = {
            type: 'bar',
            data: data,
            options: options
        }

        let myChart = new Chart(chart, config)
        this.chart = shallowRef(myChart)
    },
    data() {
        return {
            chart: null
        }
    },
    computed: {
        selectedCall() {
            const store = useCallsStore()
            return store.selectedCall
        }
    },
    watch: {
        selectedCall(val, oldVal) {
            this.chart.setActiveElements([{
                datasetIndex: 0,
                index: val
            }])
            this.chart.update();
        }
    }
}

</script>

<template>
    <div>
        <canvas id="barchart" width="800" height="200"></canvas>
    </div>
</template>
