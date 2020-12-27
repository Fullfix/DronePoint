import { Box } from '@material-ui/core'
import React from 'react'
import { Map, Placemark } from 'react-yandex-maps'

const DroneLocation = ({ pos }) => {
    return (
        <Map state={{ center: pos, zoom: 10 }}
        width="100%" height="30vh">
            <Placemark geometry={pos} options={{
                iconColor: 'red',
                iconLayout: 'default#image',
                iconImageHref: '/drone.png',
                iconImageSize: [40, 40],
                iconImageOffSet: [-20, -20],
            }}/>
        </Map>
    )
}

export default DroneLocation
