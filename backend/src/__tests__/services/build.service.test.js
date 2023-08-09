import { QueueModel } from '~/models/queue.model'
import { BuildService } from '~/services/buid.service'
import { RepositoryService } from '~/services/repository.service'

const EXEPECTED_ARG = 'ci-cd-github-actions'

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
