import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { getId, getToken } from '../authentication/auth';
import api from '../services/api.js';
import { Alert } from '@material-ui/lab';
import Snackbar from '@material-ui/core/Snackbar'
import FaceIcon from '@material-ui/icons/Face';
import "../account/account.css"
import { green } from '@material-ui/core/colors';
import GlobalStyle from "../styles/global"

const useStyles = makeStyles((theme) => ({
    root: {
    },
}));

export default function Profile() {
    const classes = useStyles();
    const token = getToken();
    const id = getId();
    const [user, setUser] = React.useState('ERRO');
    const [error, setError] = React.useState('');
    const [openError, setOpenError] = React.useState(false);
    const [open, setOpen] = React.useState(false);
    const [breakEl, setBreakEl] = React.useState(false);

    async function getUser() {
        setBreakEl(true);
        await api.get('/users/' + id, {
            headers: {
                Authorization: token  //the token is a variable which holds the token
            }
        }).then(res => {
            setUser(res.data);
        })
            .catch(err => {
                err.response.data ? setError(err.response.data.errors[0].defaultMessage) : setError('ERRO DESCONHECIDO');
                setOpen(true)
                setOpenError(true);
            });
    }

    // TODO
    // setInterval(() => {

    // }, 2222);

    if (!breakEl)
        getUser();

    const handleClose = () => {
        setOpen(false);
        window.location = "/home"
    };

    const handleCloseError = () => {
        setOpenError(false);
    };

    //TODO
    return (
        <>
            <div id="container">
                <FaceIcon style={{ fontSize: 100 }} id="userIcon"> </FaceIcon>
                <br></br><strong>Welcome {user.name}</strong>

                <div id="userInfo">
                    
                </div>
            </div>

            
        </>
    );
}
