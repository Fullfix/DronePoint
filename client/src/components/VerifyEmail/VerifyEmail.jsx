import { Typography } from '@material-ui/core';
import React, { useContext, useEffect, useState } from 'react'
import { Redirect, useParams } from 'react-router-dom';
import { UserContext } from '../../contexts/UserContext';
import { verifyEmail } from '../../utils/api';
import LoadingSpinner from '../shared/LoadingSpinner';

const VerifyEmail = () => {
    const [loading, setLoading] = useState(true);
    const [success, setSuccess] = useState(false);
    const { reload } = useContext(UserContext);
    const { id, code } = useParams();

    useEffect(() => {
        const verify = async () => {
            const { success, res } = await verifyEmail({ id, code });
            if (success) {
                setSuccess(true);
                localStorage.setItem('token', res);
                reload();
            }
            setLoading(false);
        }
        if (loading) verify();
    }, [loading]);

    if (loading) return (
        <LoadingSpinner height="100vh" />   
    )
    if (success) return (
        <Redirect to="/profile" />
    )
    return (
        <Typography variant="h2" color="error">
            Неверный ключ верификации
        </Typography>
    )
}

export default VerifyEmail
