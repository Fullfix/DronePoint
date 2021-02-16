import axios from 'axios';
import { toast } from 'react-toastify';

export const PROXY_URL = 'http://localhost:2000';
export const CLIENT_URL = 'http://localhost:3000';

const errorHandler = async (func) => {
    try {
        return {
            res: (await func()).data.response,
            success: true,
        };
    } catch (err) {
        try {
            Object.keys(err.response.data.err.errors).slice(0, 8).map(key => {
                toast.error(err.response.data.err.errors[key].properties.message, { autoClose: 4000 });
            });
        } catch (e) {
            if (err.response) {
                toast.error(err.response.data.error);
            }
            console.log(err);
        }
        return { success: false };
    }
}

export const emailRe = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

export const fetchMyOrders = async () => {
    try {
        const res = await axios.get('/api/order/me');
        return res.data.response;
    } catch (err) {
        console.log(err);
    }
}

export const fetchOrder = async (id) => {
    try {
        const res = await axios.get(`/api/order/by-id/${id}`);
        return res.data.response;
    } catch (err) {
        console.log(err);
    }
}

export const fetchTimeLeft = async (id) => {
    try {
        const res = await axios.get(`/api/order/gettimeleft/${id}`);
        return res.data.response;
    } catch (err) {
        console.log(err);
    }
}

export const droneAction = async (id, orderId) => {
    try {
        const res = await axios.post('/api/order/action', { id, orderId });
        return res.data.response;
    } catch (err) {
        console.log(err);
    }
}

export const insertCargo = async (id) => {
    return errorHandler(async () => {
        const res = await axios.post(`/api/order/insertcargo/${id}`);
        return res;
    })
}

export const giveCargo = async (id) => {
    return errorHandler(async () => {
        const res = await axios.post(`/api/order/givecargo/${id}`);
        return res;
    })
}

export const returnCargo = async (id) => {
    return errorHandler(async () => {
        const res = await axios.post(`/api/order/returncargo/${id}`);
        return res;
    })
}

export const getAllDronepoints = async () => {
    return errorHandler(async () => {
        const res = await axios.get(`/api/dronepoint/all`);
        return res;
    })
}

export const verifyEmail = async ({ id, code }) => {
    return errorHandler(async () => {
        const res = await axios.post(`/api/auth/verify-email/${id}/${code}`);
        return res;
    })
}