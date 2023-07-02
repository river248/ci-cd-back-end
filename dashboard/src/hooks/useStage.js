import { useContext } from 'react'

import { StageContext } from '~/contexts/StageContext'

function useStage() {
    return useContext(StageContext)
}

export default useStage
