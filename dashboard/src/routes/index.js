import routes from '~/configs/routes'
import Dashboard from '~/pages/Dashboard'
import { DefaultLayout } from '~/layouts'

export const privateRoutes = [{ path: routes.dashboard, component: Dashboard, layout: DefaultLayout }]
