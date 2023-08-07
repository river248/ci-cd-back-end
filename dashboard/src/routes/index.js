import routes from '~/configs/routes'
import Dashboard from '~/pages/Dashboard'
import Pipeline from '~/pages/Pipeline'
import { DefaultLayout } from '~/layouts'
import Executions from '~/pages/Executions'

export const privateRoutes = [
    { path: routes.dashboard, component: Dashboard, layout: DefaultLayout },
    { path: routes.pipeline, component: Pipeline, layout: DefaultLayout },
    { path: routes.executions, component: Executions, layout: DefaultLayout },
]
