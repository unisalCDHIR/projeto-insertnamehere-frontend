import axios from 'axios';

const api = axios.create({
    baseURL: 'https://cdhi.herokuapp.com'
});


export default api;
