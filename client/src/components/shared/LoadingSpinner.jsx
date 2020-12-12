import { Box, Grid } from '@material-ui/core';
import React from 'react';
import ClipLoader from 'react-spinners/ClipLoader';

const LoadingSpinner = ({ height }) => {
    return (
        <Box width="100%" height={height || "700px"}>
            <Grid container alignItems="center" justify="center" style={{
                height: '100%'
            }}>
                <Grid item>
                    <ClipLoader size={150} color="#FF9900" loading={true}/>
                </Grid>
            </Grid>
        </Box>
    )
}

export default LoadingSpinner
