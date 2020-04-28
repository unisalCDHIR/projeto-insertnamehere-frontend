import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { getId, getToken } from '../authentication/auth';
import api from '../services/api.js';
import { Alert } from '@material-ui/lab';
import Snackbar from '@material-ui/core/Snackbar'

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
                // setGambiarra(false);
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
        <div className={classes.root}>
            Nome: {user.name} <br />
        Email: {user.email}
            <Snackbar open={openError} autoHideDuration={6000} onClose={handleCloseError}>
                <Alert onClose={handleClose} severity="error">
                    {error}
                </Alert>
            </Snackbar>
        </div>
    );
}
