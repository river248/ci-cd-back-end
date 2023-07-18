import { io } from 'socket.io-client'

import API_ROOT from '~/utils/serverURL'

export const socket = io(API_ROOT, { autoConnect: false })

export const socketEvent = {
    USING_PIPELINE: 'using-pipeline',
    UPDATE_PIPELINE_DATA: 'update-pipeline-data',
    TRIGGER_PIPELINE: 'trigger-pipeline',
    DEPLOY_TO_PRODUCTION: 'deploy-to-production',
}

export const httpStatusCode = {
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    INTERNAL_SERVER: 500,
}

export const processName = {
    QUEUED: 'queued',
    IN_PROGRESS: 'in_progress',
    SUCCESS: 'success',
    FAILURE: 'failure',
}

export const errorCode = {
    'auth/invalid-email': 'Invalid email!',
    'auth/user-not-found': 'Email does not exist!',
    'auth/wrong-password': 'Password does not match!',
    'auth/too-many-requests': 'Wait a second! Please sign in again!',
    'auth/email-not-verify': 'Email is not verified!',
    'auth/email-already-in-use': 'Email is already taken!',
    'auth/popup-closed-by-user': 'Popup is closed!',
}
