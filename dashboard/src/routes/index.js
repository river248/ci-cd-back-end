import routes from '~/configs/routes'
import Dashboard from '~/pages/Dashboard'

export const privateRoutes = [{ path: routes.dashboard, component: Dashboard, layout: null }]
