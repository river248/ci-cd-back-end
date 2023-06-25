import React from 'react'
import { BrowserRouter as Router } from 'react-router-dom'
import ReactDOM from 'react-dom/client'
import CssBaseline from '@mui/material/CssBaseline'
// import { Provider } from 'react-redux'
import { Experimental_CssVarsProvider as CssVarsProvider } from '@mui/material/styles'
import { Slide, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

import App from './App'
import GlobalStyles from './components/GlobalStyles'
import theme from './configs/mui'
// import AuthProvider from './context/AuthProvider'
// import store from './redux/store'

const root = ReactDOM.createRoot(document.getElementById('root'))
root.render(
    <React.StrictMode>
        <CssVarsProvider theme={theme}>
            <CssBaseline />
            <Router>
                {/* <AuthProvider> */}
                {/* <Provider store={store}> */}
                <GlobalStyles>
                    <App />
                </GlobalStyles>
                {/* </Provider> */}
                {/* </AuthProvider> */}
                <ToastContainer
                    position={'top-right'}
                    autoClose={5000}
                    hideProgressBar={false}
                    newestOnTop={false}
                    style={{ width: '100%', maxWidth: '20rem', marginTop: '3.125rem' }}
                    closeButton={true}
                    toastStyle={{ fontSize: 15, fontFamily: 'Segoe UI' }}
                    transition={Slide}
                    limit={3}
                    rtl={false}
                />
            </Router>
        </CssVarsProvider>
    </React.StrictMode>,
)
