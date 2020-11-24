import React, { createContext, useEffect, useState } from 'react';
import { Redirect } from 'react-router-dom';
import axios from 'axios';

export const UserContext = createContext({
    user: null,
    isAuthenticated: false,
    isLoading: true,
    logout: () => {},
})

export default UserProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const token = localStorage.getItem('token');
    axios.defaults.headers.common['Authorization'] = token;

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

    if (loading) {
        return (
            <div>Loading...</div>
        )
    }
    if (!user) {
        return (
            <Redirect to="/login"/>
        )
    }

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
