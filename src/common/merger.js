function generateTasks(count) {
    let tasks = []
    let lastEnd = 0

    const genGenericTask = (maxDuration, maxGap) => {
        const duration = Math.floor(Math.random() * maxDuration)
        const startTime = lastEnd + Math.floor(Math.random() * maxGap)
        return { startTime, duration }
    }

    const genSmallTask = () => { return genGenericTask(100, 50) }
    const genMediumTask = () => { return genGenericTask(1000, 200) }
    const genLargeTask = () => { return genGenericTask(10000, 10000) }

    for (let i = 0; i < count; i++) {
        let task = undefined
        if (Math.random() < 0.9) {
            task = genSmallTask()
        } else if (Math.random() >= 0.9 && Math.random() < 0.98) {
            task = genMediumTask()
        } else {
            task = genLargeTask()
        }
        lastEnd = task.startTime + task.duration
        tasks.push(task)
    }
    return tasks
}

function merge(tasks, maxBucketSize) {
    if (tasks.length < 2) {
        return tasks
    }

    let buckets = []
    let bucketStartTime = tasks[0].startTime
    let bucketDuration = tasks[0].duration

    let tasksBucket = [tasks[0]]
    for (let i = 1; i < tasks.length; i++) {
        const task = tasks[i]
        // put tasks into the bucket until on of the following conditions is met:
        // 1. bucket is larger than maxBucketSize
        // 2. task is further than the bucket end
        // 3. task is overlapping with the end of the bucket
        // 4. task is larger than the maxBucketSize

        // TODO: this thing devours the next task that should not be in the bucket
        if (bucketDuration > maxBucketSize ||
            task.startTime > bucketStartTime + maxBucketSize) {
            buckets.push({
                startTime: bucketStartTime,
                duration: bucketDuration,
                tasks: tasksBucket
            })
            tasksBucket = [task]
            bucketStartTime = task.startTime
            bucketDuration = task.duration
        } else {
            tasksBucket.push(task)
            bucketDuration = task.startTime + task.duration - bucketStartTime
        }
    }

    // don't forget to add the last bucket
    if (tasksBucket.length > 0) {
        buckets.push({
            startTime: bucketStartTime,
            duration: bucketDuration,
            tasks: tasksBucket
        })
    }
    return buckets
}

export default {
    generateTasks: generateTasks,
    merge: merge
}
