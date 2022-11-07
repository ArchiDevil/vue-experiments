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
            default: 100000
        },
        colorsCount: {
            type: Number,
            default: 16
        },
        highlightingWidth: {
            type: Number,
            default: 3
        },
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
            lastMousePosition: undefined,
        }
    },
    mounted() {
        this.redraw()
    },
    watch: {
        showOriginal() {
            this.redraw()
        }
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
            const c = this.$refs.canvas
            const ctx = c.getContext('2d')

            ctx.fillStyle = 'white'
            ctx.clearRect(0, 0, c.width, c.height)

            const self = this
            const drawTasks = (tasks, startY) => {
                let strokeX = 0
                let strokeY = 0
                let strokeWidth = 0
                let strokeHeight = 0

                for (let i = 0; i < tasks.length; i++) {
                    const bucket = tasks[i]
                    const startX = (bucket.startTime - windowStart) * scale
                    const width = bucket.duration * scale

                    if (startX + width < 0 || startX > c.width) {
                        continue
                    }

                    if (self.lastMousePosition?.x > startX && self.lastMousePosition?.x < startX + width) {
                        strokeX = startX - self.highlightingWidth / 2
                        strokeY = startY - self.highlightingWidth / 2
                        strokeWidth = width + self.highlightingWidth
                        strokeHeight = taskHeight + self.highlightingWidth
                    }

                    ctx.fillStyle = self.colors[i % self.colors.length]
                    ctx.fillRect(startX, startY, width, height)
                }

                ctx.strokeStyle = 'rgb(0, 165, 0)'
                ctx.lineWidth = self.highlightingWidth
                ctx.strokeRect(strokeX, strokeY, strokeWidth, strokeHeight)
                ctx.stroke()
            }

            drawTasks(toRaw(this.bucketedTasks), 5)

            if (this.showOriginal) {
                drawTasks(toRaw(this.tasks), 5 * 2 + taskHeight)
            }
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
            if (this.moving) {
                this.windowStart += (this.lastOffset - ev.offsetX) * (1 / this.scale)
                this.lastOffset = ev.offsetX
            } else {
                this.lastMousePosition = {
                    x: ev.offsetX,
                    y: ev.offsetY
                }
            }
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
