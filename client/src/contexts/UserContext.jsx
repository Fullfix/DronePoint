import React, { createContext } from 'react'

const UserContext = createContext({
    user: null,
    isAuthenticated: false,
    token: null,
})

const UserProvider = () => {
    return (
        <div>
            
        </div>
    )
}

export default UserProvider;
