<script>
import Merger from '../common/merger.js'
import Colors from '../common/colors.js'
import { shallowRef, toRaw } from 'vue'

export default {
    props: {
        taskHeight: {
            type: Number,
            default: 32
        },
        tasksCount: {
            type: Number,
            default: 1000000
        },
        colorsCount: {
            type: Number,
            default: 16
        }
    },
    data() {
        return {
            tasks: shallowRef(Merger.generateTasks(this.tasksCount)),
            colors: Colors.generateColors(this.colorsCount),
            // maxClusterSize: 100,
            windowStart: 0,
            windowSize: 1000,
            moving: false,
            lastOffset: 0,
            showOriginal: false,
        }
    },
    mounted() {
        this.redraw()
    },
    computed: {
        maxClusterSize() {
            return this.windowSize / 500
        },
        bucketedTasks() {
            return Merger.merge(this.tasks, this.maxClusterSize)
        },
        scale() {
            return this.$refs.canvas.width / this.windowSize
        }
    },
    methods: {
        redraw() {
            const height = toRaw(this.taskHeight)
            const windowStart = toRaw(this.windowStart)
            const scale = toRaw(this.scale)
            const taskHeight = toRaw(this.taskHeight)

            console.log('redraw')
            const c = this.$refs.canvas
            const ctx = c.getContext('2d')
            ctx.fillStyle = 'white'
            ctx.clearRect(0, 0, c.width, c.height)
            ctx.stroke()

            const self = this
            const drawTasks = (tasks, startY) => {
                for (let i = 0; i < tasks.length; i++) {
                    const bucket = tasks[i]
                    const startX = (bucket.startTime - windowStart) * scale
                    const width = bucket.duration * scale

                    if (startX + width < 0 || startX > c.width) {
                        continue
                    }

                    ctx.fillStyle = self.colors[i % self.colors.length]
                    ctx.fillRect(startX, startY, width, height)
                }
            }

            drawTasks(toRaw(this.bucketedTasks), 5)

            if (this.showOriginal) {
                drawTasks(toRaw(this.tasks), 5 * 2 + taskHeight)
            }
            ctx.stroke()
        },
        regenerate() {
            this.tasks = Merger.generateTasks(this.tasksCount)
            this.redraw()
        },
        mousedown(ev) {
            if (ev.button !== 0) {
                return
            }
            this.moving = true
            this.lastOffset = ev.offsetX
        },
        mousemove(ev) {
            if (!this.moving) {
                return
            }
            this.windowStart += (this.lastOffset - ev.offsetX) * (1 / this.scale)
            this.lastOffset = ev.offsetX
            this.redraw()
        },
        mouseup(ev) {
            if (ev.button !== 0) {
                return
            }
            this.moving = false
            this.lastOffset = 0
        },
        mousewheel(ev) {
            if (ev.deltaY > 0) {
                this.windowSize *= 1.2
            } else {
                this.windowSize *= 0.8
            }
            this.redraw()
        }
    }
}
</script>

<template>
    <canvas ref="canvas" width="800" height="100" class="timeline" @mousedown="mousedown" @mouseup="mouseup"
        @mousemove="mousemove" @wheel="mousewheel" />
    <button @click="regenerate">Regenerate</button>
    <button @click="redraw">Redraw</button>
    <!-- <input type="range" v-model="maxClusterSize" min="100" max="1000" /> -->
    <label for="maxClusterSize">Max cluster size: {{ maxClusterSize }}</label>
    <p>Tasks count: {{ tasks.length }}</p>
    <p>Bucketed tasks count: {{ bucketedTasks.length }}</p>
    <input type="checkbox" v-model="showOriginal"/>
    <label for="showOriginal">Show original tasks</label>
</template>

<style scoped>
.timeline {
    border: 1px solid black;
    display: block;
}

button,
input {
    margin-top: 1em;
    margin-right: 1em;
}
</style>
