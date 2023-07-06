import React, { useState, useCallback, useEffect, useMemo } from 'react'
import { isEmpty, isNil } from 'lodash'

import AddNewRepository from '~/components/AddNewRepository'

function AddNewRepositoryContainer() {
    const [selectedMembers, setSetSelectedMembers] = useState([])
    const [repoName, setRepoName] = useState('')
    const [loading, setLoading] = useState(false)
    const [previewImage, setPreviewImage] = useState(null)
    const [selectedMembersError, setSetSelectedMembersError] = useState(false)
    const [repoNameError, setRepoNameError] = useState(false)
    const [fileError, setFileError] = useState(false)

    const members = useMemo(
        () => [
            { _id: '1', name: 'river1' },
            { _id: '2', name: 'river2' },
            { _id: '3', name: 'river3' },
        ],
        [],
    )

    useEffect(() => {
        return () => {
            previewImage && URL.revokeObjectURL(previewImage.preview)
        }
    }, [previewImage])

    const handleSelectedMembers = useCallback((_event, value) => {
        const memberIds = value.map((member) => member._id)
        setSetSelectedMembers(memberIds)

        if (isEmpty(memberIds)) {
            setSetSelectedMembersError(true)
        } else {
            setSetSelectedMembersError(false)
        }
    }, [])

    const handleChangedName = useCallback((event) => {
        const value = event.target.value
        setRepoName(value)

        if (value.length < 4 || value.length > 50) {
            setRepoNameError(true)
        } else {
            setRepoNameError(false)
        }
    }, [])

    const handleChosenFile = useCallback((event) => {
        const file = event.target.files[0]
        if (file.size / 1024 / 1024 > 1) {
            setFileError(true)
            setPreviewImage(null)
        } else {
            setFileError(false)
            file.preview = URL.createObjectURL(file)
            setPreviewImage(file)
        }
    }, [])

    const handleSubmit = useCallback(() => {
        if (
            !isEmpty(repoName) &&
            !isEmpty(selectedMembers) &&
            !isNil(previewImage) &&
            !repoNameError &&
            !selectedMembersError
        ) {
            setLoading(true)
            console.log(repoName, selectedMembers, previewImage)
            setLoading(false)
        }
    }, [repoName, selectedMembers, previewImage, repoNameError, selectedMembersError])

    return (
        <AddNewRepository
            members={members}
            loading={loading}
            overSizeError={fileError}
            textError={repoNameError}
            multiTextError={selectedMembersError}
            previewImage={previewImage?.preview}
            onSelectMember={handleSelectedMembers}
            onChangeName={handleChangedName}
            onChooseFile={handleChosenFile}
            onSubmit={handleSubmit}
        />
    )
}

export default React.memo(AddNewRepositoryContainer)
