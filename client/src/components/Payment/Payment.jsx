import React from 'react'
import { ApplePayButton } from "react-apple-pay-button";

const Payment = () => {
    return (
        <React.Fragment>
            <ApplePayButton onClick={e => console.log(e)}>
                {"Pay with"}
            </ApplePayButton>
        </React.Fragment>
    )
}

export default Payment
