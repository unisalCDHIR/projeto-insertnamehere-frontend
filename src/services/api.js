import axios from 'axios';

const api = axios.create({
    baseURL: 'https://cdhi.herokuapp.com'
});

export default class CrudService extends Component {
    findAll(path) {
        return axios.get(this.api.baseURL + path);
    }
}


export default api;
