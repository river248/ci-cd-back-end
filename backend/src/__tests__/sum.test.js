const testFunction = (a, b) => {
    return a + b
}

test('adds 1 + 2 to equal 3', () => {
    expect(testFunction(1, 2)).toBe(3)
})

test('adds 1 + 6 to equal 7', () => {
    expect(testFunction(1, 6)).toBe(3)
})

test('adds 1 + 8 to equal 9', () => {
    expect(testFunction(1, 8)).toBe(3)
})
