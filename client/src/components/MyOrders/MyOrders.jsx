import React, { useEffect, useState } from 'react'
import { fetchMyOrders } from '../../utils/api';
import LoadingSpinner from '../shared/LoadingSpinner';

const MyOrders = () => {
    const [orders, setOrders] = useState(null);
    const [loading, setLoading] = useState(true);
    console.log(orders);

    useEffect(() => {
        const fetchOrders = async () => {
            const orders = await fetchMyOrders();
            setOrders(orders);
            setLoading(false);
        }
        if (loading) fetchOrders();
    }, [loading]);

    if (loading) return (
        <LoadingSpinner />
    )
    return (
        <div>
            NNNN    
        </div>
    )
}

export default MyOrders
