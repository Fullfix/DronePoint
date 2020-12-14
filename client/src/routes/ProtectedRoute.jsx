import React, { useContext } from 'react'
import { Redirect, Route } from 'react-router-dom'
import LoadingSpinner from '../components/shared/LoadingSpinner';
import { UserContext } from '../contexts/UserContext'

const ProtectedRoute = ({ component: Component, ...rest }) => {
    const { isAuthenticated, isLoading } = useContext(UserContext);
    return (
        <Route 
        {...rest}
        render={props => {
            if (isLoading) {
                return <LoadingSpinner />
            }
            if (isAuthenticated) {
                return <Component {...props} />
            } else {
                return <Redirect to="login" />
            }
        }}/>
    )
}

export default ProtectedRoute
