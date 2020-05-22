import Container from '@material-ui/core/Container';
import CssBaseline from '@material-ui/core/CssBaseline';
import { makeStyles } from '@material-ui/core/styles';
import { Alert } from '@material-ui/lab';
import React from 'react';
import { GiHouse } from 'react-icons/gi';
import { Link } from 'react-router-dom';
import Logo from '../assets/img/Logo.png';
import CircularIndeterminate from '../components/loading.js';
import api from '../services/api.js';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';

const useStyles = makeStyles((theme) => ({
    paper: {
        marginTop: theme.spacing(8),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    submit: {
        margin: theme.spacing(3, 0, 2),
    },
}));

function Copyright() {
    return (
        <Typography variant="body2" color="textSecondary" align="center">
            {'Copyright © '}
            CDHI
        {' '}
            {new Date().getFullYear()}
            {'.'}
        </Typography>
    );
}

function getUserId() {
    var info = window.location.href.split('/');
    return info[5];
}

function getUserKey() {
    var info = window.location.href.split('/');
    return info[6];
}

export default function AccoutConfirmation() {
    const classes = useStyles();
    const [responseMessage, setResponseMessage] = React.useState(null);
    const [error, setError] = React.useState(undefined);
    const [breakEl, setBreakEl] = React.useState(false);

    async function confirmUser() {
        setBreakEl(true);
        const id = getUserId();
        const key = getUserKey();

        await api.get(`/users/confirm/${id}/${key}`)
            .then(res => {
                setError(false);
                setResponseMessage('Sua conta foi criada com sucesso!');
            })
            .catch(err => {
                setError(true);
                setResponseMessage(err.response.data.errors[0].defaultMessage);
            });
    }

    if (!breakEl) {
        confirmUser();
    }

    return (
        <Container component="main" maxWidth="xs">
            <CssBaseline />
            <div className={classes.paper}>
                <img alt="Logo" src={Logo} style={{ width: 150, height: 150, display: 'block', margin: 'auto', position: 'relative' }} />
                <br /><br /><br />
                {error === undefined ?
                    <CircularIndeterminate /> :
                    (!error ?
                        <Alert severity="success">{responseMessage}</Alert> :
                        <Alert severity="error">{responseMessage}</Alert>)
                }
                <br /><br /><br />
                <center><Link to="/login" id="notfound"><GiHouse /> Fazer login</Link></center>
                <Box mt={6}>
                    <Copyright />
                </Box>
            </div>
        </Container>
    )
};