import React, { createContext, useEffect, useState } from 'react';
import axios from 'axios';

export const UserContext = createContext({
    user: null,
    isAuthenticated: false,
    isLoading: true,
    logout: () => {},
})

const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const token = localStorage.getItem('token');
    axios.defaults.headers.common['Authorization'] = 'Bearer ' + token;

    const logout = () => {
        localStorage.removeItem('Authorization');
        setUser(null);
    }

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const res = await axios.get('/auth/me');
                setUser(res.data.response.user);
            } catch (err) {
                console.log(err);
            }
            setLoading(false);
        }
        if (loading) fetchUser();
    }, [loading]);

    return (
        <UserContext.Provider value={{
            user: user,
            isAuthenticated: !!user,
            isLoading: loading,
            logout: logout,
        }}>
            {children}
        </UserContext.Provider>
    )
}

export default UserProvider;