import { Box, Button, Grid, Input, Typography } from '@material-ui/core'
import React, { useContext, useEffect, useState } from 'react'
import DroneMap from '../shared/DroneMap';
import HeaderMenu from '../shared/HeaderMenu';
import OrderDetails from './OrderDetails';
import axios from 'axios';
import { UserContext } from '../../contexts/UserContext';
import LoadingSpinner from '../shared/LoadingSpinner';
import './MakeOrder.css';

const MakeOrder = () => {
    const [placeFrom, setPlaceFrom] = useState(null);
    const [placeTo, setPlaceTo] = useState(null);
    const [mapOpen, setMapOpen] = useState(false);
    const [order, setOrder] = useState(null);
    const [isOrdering, setIsOrdering] = useState(false);
    const { isAuthenticated } = useContext(UserContext);
    const [distance, setDistance] = useState(null);
    const [price, setPrice] = useState(null);
    const [tariff, setTariff] = useState(null);
    const [comment, setComment] = useState(null);

    useEffect(() => {
        const makeOrder = async () => {
            try {
                const res = await axios.post(`/api/order/create/${isAuthenticated ? 'auth' : 'guest'}`, {
                    placeFrom: placeFrom._id,
                    placeTo: placeTo._id,
                    distance,
                    price,
                    tariff,
                    name: comment,
                });
                setOrder(res.data.response);
            } catch(err) {
                console.log(err);
            }
            setIsOrdering(false);
            setPrice(null);
            setDistance(null);
        }
        if (isOrdering) makeOrder();
    }, [isOrdering, placeFrom, placeTo, distance, price]);

    if (isOrdering) return (
        <LoadingSpinner height="100vh"/>
    )

    return (
        <React.Fragment>
            <DroneMap open={mapOpen} onClose={() => setMapOpen(false)}
            onSelect={(point, type) => {
                if (type === 'from') {
                    setPlaceFrom(point);
                } else {
                    setPlaceTo(point);
                }
            }}/>
            <HeaderMenu text={"Оформить заказ"}/>
            <Box position="relative"
            className="main-box"
            width="100wv">
                <Grid container alignItems="center" direction="column"
                spacing={3}>
                    <Grid item>
                        <Box width="300px">
                            <Typography variant="h3">Маршрут</Typography>
                            <Button variant="text" fullWidth 
                            disabled={!!order}
                            onClick={e => setMapOpen('from')}
                            style={{
                                border: '1px solid black',
                                marginTop: 12,
                                textTransform: 'none',
                            }}>
                                {placeFrom?.name || 'Откуда'}
                            </Button>
                            <Button variant="text" fullWidth
                            disabled={!!order} 
                            onClick={e => setMapOpen('to')}
                            style={{
                                border: '1px solid black',
                                marginTop: 12,
                                textTransform: 'none',
                            }}>
                                {placeTo?.name || 'Куда'}
                            </Button>
                        </Box>
                    </Grid>
                    <OrderDetails placeFrom={placeFrom} placeTo={placeTo}
                    order={order} 
                    onSubmit={(d, pr, tf, cm) => {
                        setDistance(d);
                        setPrice(pr);
                        setIsOrdering(true);
                        setTariff(tf);
                        setComment(cm !== '' ? cm : null);
                    }}/>
                </Grid>
            </Box>
        </React.Fragment>
    )
}

export default MakeOrder
