import React, { Fragment, createContext, useEffect, useState } from 'react'
import { GithubAuthProvider, onAuthStateChanged, signInWithPopup, signOut } from 'firebase/auth'

import Authentication from '~/pages/Authentication'
import firebaseAuth from '~/configs/firebase/auth'

const AuthContext = createContext()

function AuthProvider({ children }) {
    const [loading, setLoading] = useState(false)
    const [user, setUser] = useState(null)

    const signInWithGithub = async () => {
        try {
            const provider = new GithubAuthProvider()
            provider.addScope('repo')
            provider.setCustomParameters({
                allow_signup: 'false',
            })

            const res = await signInWithPopup(firebaseAuth, provider)
            const { user } = res
            console.log(user)
        } catch (error) {
            const exception = { ...error }
            throw new Error(exception.code)
        }
    }

    const signout = async () => {
        try {
            await signOut(firebaseAuth)
        } catch (error) {
            const exception = { ...error }
            throw new Error(exception.code)
        }
    }

    useEffect(() => {
        setLoading(true)
        const unregisterAuthObserver = onAuthStateChanged(firebaseAuth, async (currentUser) => {
            if (currentUser) {
                setUser({
                    userId: currentUser.uid,
                    name: currentUser.displayName,
                    email: currentUser.email,
                    avatar: currentUser.photoURL,
                })
            } else {
                setUser(null)
            }

            setLoading(false)
        })

        return () => unregisterAuthObserver()
    }, [])

    return (
        <AuthContext.Provider value={{ user, signInWithGithub, signout }}>
            {!loading && <Fragment>{user ? children : <Authentication />}</Fragment>}
        </AuthContext.Provider>
    )
}

export { AuthProvider, AuthContext }
