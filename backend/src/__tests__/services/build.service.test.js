import { QueueModel } from '~/models/queue.model'
import { BuildService } from '~/services/buid.service'
import { RepositoryService } from '~/services/repository.service'
import { StageService } from '~/services/stage.service'
import { stageName, workflowStatus } from '~/utils/constants'

const REPOSITORY_NAME = 'ci-cd-github-actions'
const TAG_NAME = 'master@0.0.2'
const BRANCH_NAME = 'master'
const request = jest
    .fn()
    .mockImplementation(() =>
        Promise.resolve({ status: 302, headers: { location: 'mock-url' }, data: { sha: 'abc123' } }),
    )
const emit = jest.fn()
const to = jest.fn().mockImplementation(() => ({ emit }))
global._octokit = { request }
global._io = { to }

test('triggerBuildInQueue return null', async () => {
    QueueModel.findQueue = jest.fn().mockImplementation(() => Promise.resolve([]))
    QueueModel.removeFromQueue = jest.fn()
    const res = await BuildService.triggerBuildInQueue(REPOSITORY_NAME)

    expect(QueueModel.findQueue).toHaveBeenCalledWith(REPOSITORY_NAME)
    expect(QueueModel.removeFromQueue).not.toHaveBeenCalled()
    expect(global._octokit.request).not.toHaveBeenCalled()
    expect(res).toBeNull()
})

test('triggerBuildInQueue return tagName', async () => {
    QueueModel.findQueue = jest.fn().mockImplementation(() =>
        Promise.resolve([
            { repository: REPOSITORY_NAME, tagName: TAG_NAME, createdAt: 123456678123 },
            { repository: REPOSITORY_NAME, tagName: 'master@0.0.3', createdAt: 123456678123 },
        ]),
    )
    QueueModel.removeFromQueue = jest.fn()

    const res = await BuildService.triggerBuildInQueue(REPOSITORY_NAME)

    expect(QueueModel.findQueue).toHaveBeenCalledWith(REPOSITORY_NAME)
    expect(QueueModel.removeFromQueue).toHaveBeenCalledWith(REPOSITORY_NAME, TAG_NAME)
    expect(global._octokit.request).toHaveBeenCalledTimes(1)
    expect(res).toBe(TAG_NAME)
})

test('triggerBuildInQueue throw error', async () => {
    QueueModel.findQueue = jest
        .fn()
        .mockImplementation(() => Promise.reject(new Error('Server is temporator unvailable!')))

    try {
        await BuildService.triggerBuildInQueue(REPOSITORY_NAME)
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
            name: REPOSITORY_NAME,
            stages: ['build', 'test', 'production'],
            thumbnail: 'https://ci-cd-github-actions.jpg',
            members: [],
        }),
    )

    const res = await BuildService.getQueue(REPOSITORY_NAME)

    expect(QueueModel.findQueue).toHaveBeenCalledWith(REPOSITORY_NAME)
    expect(RepositoryService.findRepository).toHaveBeenCalledWith(REPOSITORY_NAME)
    expect(res).toStrictEqual([])
})

test('getQueue return an array', async () => {
    QueueModel.findQueue = jest
        .fn()
        .mockImplementation(() =>
            Promise.resolve([{ repository: REPOSITORY_NAME, tagName: 'master@0.0.2', createdAt: 123456678123 }]),
        )
    RepositoryService.findRepository = jest.fn().mockImplementation(() =>
        Promise.resolve({
            _id: '123456',
            name: REPOSITORY_NAME,
            stages: ['build', 'test', 'production'],
            thumbnail: 'https://ci-cd-github-actions.jpg',
            members: [],
        }),
    )
    const res = await BuildService.getQueue(REPOSITORY_NAME)

    expect(QueueModel.findQueue).toHaveBeenCalledWith(REPOSITORY_NAME)
    expect(RepositoryService.findRepository).toHaveBeenCalledWith(REPOSITORY_NAME)
    expect(res).toStrictEqual([{ repository: REPOSITORY_NAME, tagName: 'master@0.0.2', createdAt: 123456678123 }])
})

test('getQueue throw not found error', async () => {
    QueueModel.findQueue = jest
        .fn()
        .mockImplementation(() =>
            Promise.resolve([{ repository: REPOSITORY_NAME, tagName: 'master@0.0.2', createdAt: 123456678123 }]),
        )
    RepositoryService.findRepository = jest.fn().mockImplementation(() => Promise.resolve({}))

    try {
        const res = await BuildService.getQueue(REPOSITORY_NAME)

        expect(QueueModel.findQueue).toHaveBeenCalledWith(REPOSITORY_NAME)
        expect(RepositoryService.findRepository).toHaveBeenCalledWith(REPOSITORY_NAME)
        expect(res).toStrictEqual([{ repository: REPOSITORY_NAME, tagName: 'master@0.0.2', createdAt: 123456678123 }])
    } catch (error) {
        expect(error.message).toMatch('Not found repo: ci-cd-github-actions')
    }
})

test('manuallyTriggerBuild trigger successfully', async () => {
    RepositoryService.validateBranch = jest.fn().mockImplementation(() => Promise.resolve(BRANCH_NAME))
    StageService.findStages = jest.fn().mockImplementation(() => Promise.resolve([]))
    QueueModel.findQueue = jest.fn().mockImplementation(() => Promise.resolve([]))
    RepositoryService.createTag = jest.fn().mockImplementation(() => Promise.resolve('master@0.0.1'))

    const res = await BuildService.manuallyTriggerBuild(REPOSITORY_NAME, BRANCH_NAME, {
        user_id: 'user-id',
        name: 'test user',
        picture: 'https://test-user.jpg',
    })

    expect(res).toBe('Trigger build successfully!')
    expect(RepositoryService.validateBranch).toHaveBeenCalledWith(REPOSITORY_NAME, BRANCH_NAME)
    expect(StageService.findStages).toHaveBeenNthCalledWith(1, REPOSITORY_NAME, stageName.BUILD, {}, 1)
    expect(QueueModel.findQueue).toHaveBeenCalledWith(REPOSITORY_NAME)
    expect(RepositoryService.createTag).toHaveBeenCalledWith(REPOSITORY_NAME, BRANCH_NAME, '0.0.1')
    expect(StageService.findStages).toHaveBeenNthCalledWith(
        2,
        REPOSITORY_NAME,
        stageName.BUILD,
        { status: workflowStatus.QUEUED },
        0,
    )
    expect(StageService.findStages).toHaveBeenNthCalledWith(
        3,
        REPOSITORY_NAME,
        stageName.BUILD,
        { status: workflowStatus.IN_PROGRESS },
        0,
    )
    expect(StageService.findStages).toHaveBeenNthCalledWith(
        4,
        REPOSITORY_NAME,
        stageName.TEST,
        { status: workflowStatus.QUEUED },
        0,
    )
    expect(StageService.findStages).toHaveBeenNthCalledWith(
        5,
        REPOSITORY_NAME,
        stageName.TEST,
        { status: workflowStatus.IN_PROGRESS },
        0,
    )
    expect(global._io.to).toHaveBeenCalledWith(REPOSITORY_NAME)
})

test('manuallyTriggerBuild push to queue', async () => {
    RepositoryService.validateBranch = jest.fn().mockImplementation(() => Promise.resolve(BRANCH_NAME))
    StageService.findStages = jest
        .fn()
        .mockImplementation(() => Promise.resolve([{ name: 'build', version: '0.0.1' }]))
        .mockImplementation(() => Promise.resolve([{ name: 'build', version: '0.0.1' }]))
    QueueModel.findQueue = jest.fn().mockImplementation(() => Promise.resolve([]))
    RepositoryService.createTag = jest.fn().mockImplementation(() => Promise.resolve('master@0.0.2'))
    QueueModel.pushToQueue = jest.fn()

    const res = await BuildService.manuallyTriggerBuild(REPOSITORY_NAME, BRANCH_NAME, {
        user_id: 'user-id-2',
        name: 'test user 2',
        picture: 'https://test-user-2.jpg',
    })

    expect(res).toBe('Push to queue successfully!')
    expect(RepositoryService.validateBranch).toHaveBeenCalledWith(REPOSITORY_NAME, BRANCH_NAME)
    expect(StageService.findStages).toHaveBeenCalledTimes(5)
    expect(StageService.findStages).toHaveBeenNthCalledWith(1, REPOSITORY_NAME, stageName.BUILD, {}, 1)
    expect(QueueModel.findQueue).toHaveBeenCalledWith(REPOSITORY_NAME)
    expect(RepositoryService.createTag).toHaveBeenCalledWith(REPOSITORY_NAME, BRANCH_NAME, '0.0.2')
    expect(global._io.to).toHaveBeenCalledWith(REPOSITORY_NAME)
    expect(QueueModel.pushToQueue).toHaveBeenCalledWith({ repository: REPOSITORY_NAME, tagName: 'master@0.0.2' })
})

test('manuallyTriggerBuild full queue', async () => {
    RepositoryService.validateBranch = jest.fn().mockImplementation(() => Promise.resolve(BRANCH_NAME))
    StageService.findStages = jest.fn().mockImplementation(() => Promise.resolve([{ name: 'build', version: '0.0.1' }]))
    QueueModel.findQueue = jest
        .fn()
        .mockImplementation(() =>
            Promise.resolve([
                'master@0.0.1',
                'master@0.0.2',
                'master@0.0.3',
                'master@0.0.4',
                'master@0.0.5',
                'master@0.0.6',
                'master@0.0.7',
                'master@0.0.8',
                'master@0.0.9',
                'master@0.0.10',
            ]),
        )

    try {
        await BuildService.manuallyTriggerBuild(REPOSITORY_NAME, BRANCH_NAME, {
            user_id: 'user-id-3',
            name: 'test user 3',
            picture: 'https://test-user-3.jpg',
        })
    } catch (error) {
        expect(error.message).toBe('Queue is full. Please wait for some build is triggered!')
        expect(error.statusCode()).toBe(400)
    }
})

test('manuallyStopBuild successfully', async () => {
    const res = await BuildService.manuallyStopBuild(REPOSITORY_NAME, '123456', {
        user_id: 'user-id-4',
        name: 'test user',
        picture: 'https://test-user-4.jpg',
    })

    expect(res).toBe('Stop build successfully!')
    expect(global._io.to).toHaveBeenCalledWith(REPOSITORY_NAME)
})

test('manuallyStopBuild failed', async () => {
    const requestError = jest.fn().mockImplementation(() => Promise.reject(new Error('Can not stop build!')))
    global._octokit = { request: requestError }

    try {
        await BuildService.manuallyStopBuild(REPOSITORY_NAME, '123456', {
            user_id: 'user-id-4',
            name: 'test user',
            picture: 'https://test-user-4.jpg',
        })
    } catch (error) {
        expect(error.message).toBe('Can not stop build!')
    }
})
