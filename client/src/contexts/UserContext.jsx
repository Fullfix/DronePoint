import React, { createContext, useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

export const UserContext = createContext({
    user: null,
    isAuthenticated: false,
    isLoading: true,
    logout: () => {},
    login: async ({ username, password }) => {},
    register: async ({ username, password }) => {},
    reload: async () => {},
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

    const login = async ({ username, password }) => {
        try {
            const res = await axios.post('/api/auth/login', {
                email: username,
                password,
            });
            localStorage.setItem('token', res.data.response.token);
            setUser(res.data.response.user);
            return true;
        } catch (err) {
            console.log(err);
            return false;
        }
    }

    const reload = async () => {
        setLoading(true);
    }

    const register = async ({ username, password }) => {
        try {
            const resRegister = await axios.post('/api/auth/signup', {
                email: username,
                password
            });
            toast.success('Аккаунт зарегестрирован');
            return true;
        } catch (err) {
            console.log(err);
            toast.error(err.response.data.error.reason);
            return false;
        }
    }
    useEffect(() => {
        const fetchUser = async () => {
            try {
                const res = await axios.get('/api/auth/me');
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
            login: login,
            register: register,
            reload: reload,
        }}>
            {children}
        </UserContext.Provider>
    )
}

export default UserProvider;