import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import { toast } from 'react-toastify'
import { v4 as uuidv4 } from 'uuid'

import firebaseStorage from '~/configs/firebase/storage'

export const uploadImage = async (file, prefix) => {
    const fileExt = file.name.split('.').pop()
    const newImageName = `${uuidv4()}.${fileExt}`
    const newPath = `/${prefix}/${newImageName}`

    const storeRef = ref(firebaseStorage, newPath)

    try {
        await uploadBytes(storeRef, file)
        return newPath
    } catch (error) {
        toast.error(`Failed: ${error.message}`)
    }
}

export const getImageUrl = async (relativePath) => {
    try {
        return await getDownloadURL(ref(firebaseStorage, relativePath))
    } catch (error) {
        console.log('Not found image!')
        return relativePath
    }
}
