import { clientHost, serverHost } from '~/utils/constants'

export const corsConfig = {
    credentials: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    origin: [...clientHost, serverHost],
}
