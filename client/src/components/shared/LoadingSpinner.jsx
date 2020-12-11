import { Box, Grid } from '@material-ui/core';
import React from 'react';
import ClipLoader from 'react-spinners/ClipLoader';

const LoadingSpinner = () => {
    return (
        <Box width="100%" height="700px">
            <Grid container alignItems="center" justify="center" style={{
                height: '100%'
            }}>
                <Grid item>
                    <ClipLoader size={150} color="blue" loading={true}/>
                </Grid>
            </Grid>
        </Box>
    )
}

export default LoadingSpinner
