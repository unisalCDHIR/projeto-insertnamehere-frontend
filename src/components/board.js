import React from 'react';
import api from '../services/api.js'
import { getId, getToken, logout } from '../authentication/auth'

export default function Boards() {

    const [boards, setBoards] = React.useState('');
    const [breakEl, setBreakEl] = React.useState(false);
    const token = getToken();
    let arr = [];


    async function getBoards() { //paulinho@gmail.com,senha=456456
        setBreakEl(true);
        await api.get('/boards', {
            headers: {
                Authorization: token  //the token is a variable which holds the token
            }
        }).then(res => {
            setBoards(res.data);
            res.data.content.forEach(element => {
                arr.push(element);
            });
        })
            .catch(err => {
                setBoards(err.data);

            });
    }

    if (!breakEl) {
        getBoards();
    }
    
    return(
        <select>

        </select>
       

    )
}