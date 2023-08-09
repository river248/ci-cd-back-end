import { QueueModel } from '~/models/queue.model'
import { BuildService } from '~/services/buid.service'
import { RepositoryService } from '~/services/repository.service'

const EXEPECTED_ARG = 'ci-cd-github-actions'
const TAG_NAME = 'master@0.0.2'
const request = jest.fn().mockImplementation(
    () =>
        new Promise((resolve, _reject) => {
            resolve({ status: 302, headers: { location: 'mock-url' } })
        }),
)
global._octokit = { request }

test('triggerBuildInQueue return null', async () => {
    QueueModel.findQueue = jest.fn().mockImplementation(() => Promise.resolve([]))
    QueueModel.removeFromQueue = jest.fn()
    const res = await BuildService.triggerBuildInQueue(EXEPECTED_ARG)

    expect(QueueModel.findQueue).toHaveBeenCalledWith(EXEPECTED_ARG)
    expect(QueueModel.removeFromQueue).not.toHaveBeenCalled()
    expect(global._octokit.request).not.toHaveBeenCalled()
    expect(res).toBeNull()
})

test('triggerBuildInQueue return tagName', async () => {
    QueueModel.findQueue = jest.fn().mockImplementation(() =>
        Promise.resolve([
            { repository: EXEPECTED_ARG, tagName: TAG_NAME, createdAt: 123456678123 },
            { repository: EXEPECTED_ARG, tagName: 'master@0.0.3', createdAt: 123456678123 },
        ]),
    )
    QueueModel.removeFromQueue = jest.fn()

    const res = await BuildService.triggerBuildInQueue(EXEPECTED_ARG)

    expect(QueueModel.findQueue).toHaveBeenCalledWith(EXEPECTED_ARG)
    expect(QueueModel.removeFromQueue).toHaveBeenCalledWith(EXEPECTED_ARG, TAG_NAME)
    expect(global._octokit.request).toHaveBeenCalledTimes(1)
    expect(res).toBe(TAG_NAME)
})

test('triggerBuildInQueue throw error', async () => {
    QueueModel.findQueue = jest
        .fn()
        .mockImplementation(() => Promise.reject(new Error('Server is temporator unvailable!')))

    try {
        await BuildService.triggerBuildInQueue(EXEPECTED_ARG)
    } catch (error) {
        expect(error.message).toBe('Server is temporator unvailable!')
        expect(error.status).toBe(500)
    }
})

test('getQueue return an empty array', async () => {
    QueueModel.findQueue = jest.fn().mockImplementation(() => Promise.resolve([]))
    RepositoryService.findRepository = jest.fn().mockImplementation(() =>
        Promise.resolve({
            _id: '123456',
            name: EXEPECTED_ARG,
            stages: ['build', 'test', 'production'],
            thumbnail: 'https://ci-cd-github-actions.jpg',
            members: [],
        }),
    )

    const res = await BuildService.getQueue(EXEPECTED_ARG)

    expect(QueueModel.findQueue).toHaveBeenCalledWith(EXEPECTED_ARG)
    expect(RepositoryService.findRepository).toHaveBeenCalledWith(EXEPECTED_ARG)
    expect(res).toStrictEqual([])
})

test('getQueue return an array', async () => {
    QueueModel.findQueue = jest
        .fn()
        .mockImplementation(() =>
            Promise.resolve([{ repository: EXEPECTED_ARG, tagName: 'master@0.0.2', createdAt: 123456678123 }]),
        )
    RepositoryService.findRepository = jest.fn().mockImplementation(() =>
        Promise.resolve({
            _id: '123456',
            name: EXEPECTED_ARG,
            stages: ['build', 'test', 'production'],
            thumbnail: 'https://ci-cd-github-actions.jpg',
            members: [],
        }),
    )
    const res = await BuildService.getQueue(EXEPECTED_ARG)

    expect(QueueModel.findQueue).toHaveBeenCalledWith(EXEPECTED_ARG)
    expect(RepositoryService.findRepository).toHaveBeenCalledWith(EXEPECTED_ARG)
    expect(res).toStrictEqual([{ repository: EXEPECTED_ARG, tagName: 'master@0.0.2', createdAt: 123456678123 }])
})

test('getQueue throw not found error', async () => {
    QueueModel.findQueue = jest
        .fn()
        .mockImplementation(() =>
            Promise.resolve([{ repository: EXEPECTED_ARG, tagName: 'master@0.0.2', createdAt: 123456678123 }]),
        )
    RepositoryService.findRepository = jest.fn().mockImplementation(() => Promise.resolve({}))

    try {
        const res = await BuildService.getQueue(EXEPECTED_ARG)

        expect(QueueModel.findQueue).toHaveBeenCalledWith(EXEPECTED_ARG)
        expect(RepositoryService.findRepository).toHaveBeenCalledWith(EXEPECTED_ARG)
        expect(res).toStrictEqual([{ repository: EXEPECTED_ARG, tagName: 'master@0.0.2', createdAt: 123456678123 }])
    } catch (error) {
        expect(error.message).toMatch('Not found repo: ci-cd-github-actions')
    }
})
