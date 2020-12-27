import axios from 'axios';

export const PROXY_URL = 'http://localhost:2000';
export const CLIENT_URL = 'http://localhost:3000';

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

export const droneAction = async () => {
    try {
        const res = await axios.post('/api/order/action');
        return res.data.response;
    } catch (err) {
        console.log(err);
    }
}