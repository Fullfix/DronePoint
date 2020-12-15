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