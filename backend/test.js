const testFunction = async () => {
    let id = 0
    while (true) {
        await customSetTimeout(5000)
        if (id === 5) {
            break
        }
        id += 5
    }

    return id
}

const timeoutFunc = async () => {
    const res = await testFunction()

    console.log(res)
}

timeoutFunc()
