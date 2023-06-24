const testFunction = (a, b) => {
    return a * b
}

test('multiple 1 * 2 to equal 3', () => {
    expect(testFunction(1, 2)).toBe(3)
})

test('multiple 1 * 6 to equal 6', () => {
    expect(testFunction(1, 6)).toBe(6)
})

test('multiple 1 * 8 to equal 8', () => {
    expect(testFunction(1, 8)).toBe(8)
})
