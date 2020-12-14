import { List, ListItem, ListItemText, makeStyles } from '@material-ui/core';
import React, { useEffect, useState } from 'react'
import { fetchMyOrders } from '../../utils/api';
import HeaderMenu from '../shared/HeaderMenu';
import LoadingSpinner from '../shared/LoadingSpinner';

const useStyles = makeStyles(theme => ({
    list: {},
    price: {
        textAlign: 'right',
        color: 'green',
    }
}))

const MyOrders = () => {
    const classes = useStyles();
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
        <React.Fragment>
            <HeaderMenu text={'Мои заказы'}/>
            <List component="nav" className={classes.list}>
                {orders.map(order => (
                    <ListItem button component="a" 
                    href={`/order/${order._id}`}>
                        <ListItemText primary={`${order.placeFrom.name} ==> ${order.placeTo.name}`} />
                        <ListItemText primary={`${order.price} руб`} className={classes.price}/>
                    </ListItem>
                ))}
            </List>
        </React.Fragment>
    )
}

export default MyOrders
