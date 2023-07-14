import { useEffect, useState } from 'react'

import { getImageUrl } from '~/utils/firebaseHelper'

function useFirebaseImage(relativePath) {
    const [imageURL, setImageURL] = useState()

    useEffect(() => {
        let isSubscribed = true
        getImageUrl(relativePath).then((res) => {
            if (isSubscribed) {
                setImageURL(res)
            }
        })

        return () => {
            isSubscribed = false
        }
    }, [relativePath])

    return imageURL
}

export default useFirebaseImage
