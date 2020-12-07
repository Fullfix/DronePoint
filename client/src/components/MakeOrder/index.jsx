import { Box, Button, Grid, Input, Typography } from '@material-ui/core'
import React, { useEffect, useState } from 'react'
import DroneMap from '../shared/DroneMap';
import HeaderMenu from '../shared/HeaderMenu';
import OrderDetails from './OrderDetails';

const MakeOrder = () => {
    const [placeFrom, setPlaceFrom] = useState(null);
    const [placeTo, setPlaceTo] = useState(null);
    const [mapOpen, setMapOpen] = useState(false);
    const [order, setOrder] = useState(null);
    const [isOrdering, setIsOrdering] = useState(false);

    useEffect(() => {
        const makeOrder = async () => {
            
        }
    }, [isOrdering, placeFrom, placeTo]);

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
            <Box height="90vh" padding="30px" position="relative">
                <Grid container alignItems="center" direction="column"
                spacing={3}>
                    <Grid item>
                        <Box width="300px">
                            <Typography variant="h3">Маршрут</Typography>
                            <Button variant="text" fullWidth 
                            onClick={e => setMapOpen('from')}
                            style={{
                                border: '1px solid black',
                                marginTop: 12,
                                textTransform: 'none',
                            }}>
                                {placeFrom?.name || 'Откуда'}
                            </Button>
                            <Button variant="text" fullWidth 
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
                    <OrderDetails placeFrom={placeFrom} placeTo={placeTo} onSubmit={() => {}}/>
                </Grid>
            </Box>
        </React.Fragment>
    )
}

export default MakeOrder
