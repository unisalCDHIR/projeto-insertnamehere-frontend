import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { getId, getToken } from '../authentication/auth';
import api from '../services/api.js';
import { Alert } from '@material-ui/lab';
import Snackbar from '@material-ui/core/Snackbar'
import FaceIcon from '@material-ui/icons/Face';
import "../account/account.css"
import { green } from '@material-ui/core/colors';
import avatars_data from "../enums/icons"

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
    const [userAvatar, setUserAvatar] = React.useState('');
    const [avatars, setAvatars] = React.useState(avatars_data);

    async function getUser() {
        setBreakEl(true);
        await api.get('/users/' + id, {
            headers: {
                Authorization: token  //the token is a variable which holds the token
            }
        }).then(res => {
            setUser(res.data);
            setUserAvatar(res.data.avatar);
        })
            .catch(err => {
                err.response.data ? setError(err.response.data.errors[0].defaultMessage) : setError('ERRO DESCONHECIDO');
                setOpen(true)
                setOpenError(true);
            
            });
    }

    function getIconId(user_avatar){
        let board_b = "";
        if(user_avatar.length === 3){
          board_b = user_avatar[1] + user_avatar[2];
          console.log(board_b);
        }
        else{
          board_b = user_avatar[1];
        }
        return board_b;
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
            {user && userAvatar ? <div id="container">
            {!userAvatar ?   <div id="userIcon_container">
                   <FaceIcon style={{ fontSize: 100 }} id="userIcon"> </FaceIcon> 
                    
                </div>: <div id="userIcon_container_true">

                        <img src={avatars[getIconId(userAvatar)].content}></img>

                    </div>}
                    
                <br/><strong id="welcomeInfo">Bem-vindo {user.name}</strong>

                <div id="user_info_container">
                    <strong id="yourInfo_title">Suas informações</strong>
                    <br/><br/>
                    <strong className="yourInfo">Nome da conta:</strong> <br/> <span className="yourInfo"> {user.name}</span>
                    <br/>
                    <strong className="yourInfo">Email da conta:</strong> <br/> <span className="yourInfo"> {user.email}</span>

                    
                </div>
                

            </div> : null}

            
        </>
    );
}
