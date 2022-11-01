export default function () {
    let callNames = [
        'glUseProgram',
        'glBindBuffer',
        'glBufferData',
        'glVertexAttribPointer',
        'glEnableVertexAttribArray',
        'glDrawArrays',
        'glCreateShader',
        'glShaderSource',
        'glCompileShader',
    ]

    let calls = []
    for (let i = 0; i < 100; i++) {
        // create call with ids as loop index and random name from callNames array
        calls.push({
            id: i,
            name: callNames[Math.floor(Math.random() * callNames.length)],
            duration: Math.floor(Math.random() * 100),
        })
    }

    return {
        calls: calls
    }
}
