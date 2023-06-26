import { useLocation } from 'react-router-dom'

function useQueryHook() {
    return new URLSearchParams(useLocation().search)
}

export default useQueryHook
