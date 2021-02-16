import React, { forwardRef, useEffect, useState } from 'react';
import { Map, Placemark } from 'react-yandex-maps';
import { AppBar, Box, Dialog, IconButton, List, ListItem, 
    ListItemIcon, Slide, Toolbar, Typography, ListItemText, Grid, Button, makeStyles } from '@material-ui/core';
import { Close as CloseIcon, LocationOn } from '@material-ui/icons';
import axios from 'axios';
import LoadingSpinner from './LoadingSpinner';
import { calcCrow } from '../../utils/display';

const useStyles = makeStyles(theme => ({
    mainGrid: {
        height: 'calc(100vh - 64px)',
        overflowY: 'hidden',
        [theme.breakpoints.down('xs')]: {
            height: 'calc(100vh - 56px)',
        }
    },
    mapGrid: {
        height: '60vh',
        display: 'block',
    },
    list: {
        overflowY: 'scroll',
        height: 'calc(40vh - 64px - 36px)',
        [theme.breakpoints.down('xs')]: {
            height: 'calc(40vh - 56px - 36px)',
        },
        padding: 0,
    }
}))

const Transition = forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

const DroneMap = ({ open, onClose, onSelect, dronePoints, loading, placeFrom }) => {
    const classes = useStyles();
    const [selectedPoint, setSelectedPoint] = useState(null);
    const [coords, setCoords] = useState([54.3, 48.36]);

    const dronepoints = open === 'to' ? dronePoints.filter(dronepoint => {
        if (dronepoint._id === placeFrom._id) return false;
        return calcCrow(placeFrom.pos, dronepoint.pos) < 6;
    }) : dronePoints;

    return (
        <Dialog fullScreen open={!!open} onClose={onClose}
        TransitionComponent={Transition} style={{
            overflowY: 'hidden',
        }}>
            <AppBar position="sticky">
                <Toolbar>
                    <IconButton edge="start" color="inherit" onClick={onClose}
                    aria-label="close">
                        <CloseIcon />
                    </IconButton>
                    <Typography variant="h2">
                        Выберите Дронпоинт ({ open === 'from' ? 'откуда' : 'куда'})
                    </Typography>
                </Toolbar>
            </AppBar>
            {loading && <LoadingSpinner height={'800px'}/>}
            {!loading && <Grid container className={classes.mainGrid}>
                <Grid item xs={12} className={classes.mapGrid}>
                    <Map state={{ center: coords, zoom: 12 }}
                    className="yandex-map"
                    width="100%" height="60vh">
                        {open === 'to' && 
                        <Placemark geometry={placeFrom.pos}
                        options={{ iconColor: 'green' }} />}
                        {dronepoints.map(point => 
                        <Placemark key={point.name} geometry={point.pos}
                        onClick={() => {
                            setSelectedPoint(p => p === point.name ? null : point.name);
                            setCoords(point.pos);
                        }}
                        options={{ iconColor: point.name === selectedPoint ? 'red' : 'blue' }}/>)}
                    </Map>
                </Grid>
                <Grid item xs={12}>
                    <List component="nav" className={classes.list}>
                        {dronepoints.map(point => 
                        <ListItem button selected={point.name === selectedPoint}
                        key={point.name}
                        onClick={() => {
                            setSelectedPoint(p => p === point.name ? null : point.name);
                            setCoords(point.pos);
                        }}>
                            <ListItemIcon>
                                <LocationOn color={point.name === selectedPoint ? 
                                'secondary' : 'inherit'}/>
                            </ListItemIcon>
                            <ListItemText primary={point.name} 
                            secondary={point.address}/>
                        </ListItem>)}
                    </List>
                </Grid>
            </Grid>}
            <Button fullWidth variant="contained" color="primary"
            disabled={!selectedPoint}
            onClick={() => {
                const point = dronepoints.find(p => p.name === selectedPoint);
                onSelect(point, open);
                onClose();
                setSelectedPoint(null);
            }}>Выбрать</Button>
        </Dialog>
    )
}

export default DroneMap
