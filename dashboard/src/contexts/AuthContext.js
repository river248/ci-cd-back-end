import React, { Fragment, createContext, useLayoutEffect, useState, useCallback, useMemo } from 'react'
import { GithubAuthProvider, deleteUser, onAuthStateChanged, signInWithPopup, signOut } from 'firebase/auth'
import { isNil } from 'lodash'

import Authentication from '~/pages/Authentication'
import firebaseAuth from '~/configs/firebase/auth'
import { logInWithGithub } from '~/apis/userAPI'

const AuthContext = createContext()

function AuthProvider({ children }) {
    const [loading, setLoading] = useState(false)
    const [user, setUser] = useState(null)

    const signInWithGithub = useCallback(() => {
        const handleSignIn = async () => {
            try {
                const provider = new GithubAuthProvider()
                provider.addScope('repo')
                provider.setCustomParameters({
                    allow_signup: 'false',
                })

                const res = await signInWithPopup(firebaseAuth, provider)
                const { user } = res

                const response = await logInWithGithub({
                    _id: user.uid,
                    email: user.email,
                    name: user.displayName,
                    avatar: user.photoURL,
                })

                if (isNil(response)) {
                    await removeUser(firebaseAuth.currentUser)
                }
            } catch (error) {
                const exception = { ...error }
                throw new Error(exception.code)
            }
        }

        handleSignIn()
    }, [])

    const signout = useCallback(() => {
        const handleSignout = async () => {
            try {
                await signOut(firebaseAuth)
            } catch (error) {
                const exception = { ...error }
                throw new Error(exception.code)
            }
        }

        handleSignout()
    }, [])

    const removeUser = useCallback((user) => {
        const handleRemoveUser = async (user) => {
            try {
                await deleteUser(user)
            } catch (error) {
                const exception = { ...error }
                throw new Error(exception.code)
            }
        }

        handleRemoveUser(user)
    }, [])

    useLayoutEffect(() => {
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

    const value = useMemo(
        () => ({
            user,
            signInWithGithub,
            signout,
        }),
        [JSON.stringify(user)],
    )

    return (
        <AuthContext.Provider value={value}>
            {!loading && <Fragment>{user ? children : <Authentication />}</Fragment>}
        </AuthContext.Provider>
    )
}

export { AuthProvider, AuthContext }
