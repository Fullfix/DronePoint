import { Divider, List, ListItem, ListItemIcon, ListItemSecondaryAction, ListItemText, makeStyles } from '@material-ui/core';
import React, { useEffect, useState } from 'react'
import { fetchMyOrders } from '../../utils/api';
import { formattedDate } from '../../utils/display';
import HeaderMenu from '../shared/HeaderMenu';
import LoadingSpinner from '../shared/LoadingSpinner';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import InfoIcon from '@material-ui/icons/Info';

const useStyles = makeStyles(theme => ({
    list: {},
    right: {
        textAlign: 'right',
    },
    icon: {
        minWidth: '30px',
    },
    name: {
        fontWeight: '500',
    }
}))

const MyOrders = () => {
    const classes = useStyles();
    const [orders, setOrders] = useState(null);
    const [loading, setLoading] = useState(true);
    console.log(orders);

    const getInfo = (order) => {
        return `Дата: ${formattedDate(order.createdAt)}`;
    }

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
                {orders.map((order, i) => (
                    <React.Fragment>
                        <ListItem button component="a" 
                        href={`/order/${order._id}`}>
                            <ListItemIcon className={classes.icon}>
                                <ChevronRightIcon />
                            </ListItemIcon>
                            <ListItemText primary={`${order.name || '-Без названия-'}`}
                            primaryTypographyProps={{ className: classes.name }}/>
                            <ListItemText primary={`Цена: ${order.price} ₽`}
                            className={classes.right}
                            secondary={getInfo(order)}/>
                            <ListItemSecondaryAction>
                                <InfoIcon />
                            </ListItemSecondaryAction>
                        </ListItem>
                        {i !== orders.length - 1 && (
                            <Divider />
                        )}
                    </React.Fragment>
                ))}
            </List>
        </React.Fragment>
    )
}

export default MyOrders
