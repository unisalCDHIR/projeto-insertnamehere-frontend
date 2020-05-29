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
import EditIcon from '@material-ui/icons/Edit';
import { Dialog, DialogContentText } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';

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
    const [openAvatarsDialog, setAvatarsDialog] = React.useState(false);
    const [openEditUserInfo, setEditUserInfo] = React.useState(false);
    const [edittedUsername, setUsername] = React.useState('');
    const [edittedEmail, setedittedEmail] = React.useState('');

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

    function getIconId(user_avatar) {
        let board_b = "";
        if (user_avatar.length === 3) {
            board_b = user_avatar[1] + user_avatar[2];
            console.log(board_b);
        }
        else {
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

    console.log(user.name);
    console.log(user.email);

    async function putIcon(id, email, name, avatar){
        
        api.put("/users/" + id, {
            avatar: avatar,
            email: email,
            name: name
          }
          , {
            headers:{
              Authorization: token
          }}).then(res => {
            document.getElementById("iconImg").setAttribute("src", avatars[getIconId(avatar)].content);
            setAvatarsDialog(false);
          } 
            
            ).catch(err => 
              console.log(err)
            );

    }
    console.log(edittedEmail);
    
    async function saveEdittedUserInfo(){

        

        api.put("/users/" + id, {
            avatar: userAvatar,
            name: edittedUsername,
          }
          , {
            headers:{
              Authorization: token
          }}).then(res => {
            setEditUserInfo(false);
            
            window.location.reload();
            
          } 
            
            ).catch(err => 
              console.log(err)
            );
    }

    //TODO
    return (
        <>
            {user && userAvatar ? <div id="container_account">
                {!userAvatar ? <div id="userIcon_container">
                    <FaceIcon onClick={() => setAvatarsDialog(true)} style={{ fontSize: 100 }} id="userIcon"> </FaceIcon>

                </div> : <div id="userIcon_container_true">

                        <img onClick={() => setAvatarsDialog(true)} id="iconImg" src={avatars[getIconId(userAvatar)].content}></img>
                        <span><EditIcon onClick={() => setAvatarsDialog(true)} id="editIcon_btn" color="primary" style={{ fontSize: 60 }} /></span>
                    </div>}

                <br /><strong id="welcomeInfo">Bem-vindo {user.name}</strong>

                <div id="user_info_container">
                    <strong id="yourInfo_title">Suas informações</strong>
                    <br /><br />
                    <strong className="yourInfo">Nome da conta:</strong> <br /> <span className="yourInfo"> {user.name}</span>
                    <br />
                    <strong className="yourInfo">Email da conta:</strong> <br /> <span className="yourInfo"> {user.email}</span>

                    <EditIcon onClick={() => setEditUserInfo(true)} id="editIcon_userInfo" color="primary" style={{ fontSize: 60 }} />
                </div>

                <Dialog open={openAvatarsDialog} aria-labelledby="form-dialog-title">
                    <DialogContent>
                        <DialogContentText>
                            <strong>AVATARES</strong>
                        </DialogContentText>

                        <Grid align="center" container spacing={3}>
                            {avatars.map(avatar => <>
                                <Grid item sm={6} id="avatarDiv">
                                    <img onClick={() => putIcon(user.id, user.email, user.name, avatar.id)} id="avatars" className={avatars.id === userAvatar ? "icon-selected" : avatar.id} src={avatar.content}></img>
                                </Grid>
                            </>)}
                        </Grid>

                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setAvatarsDialog(false)} color="primary">
                            FECHAR
                    </Button>
                    </DialogActions>
                </Dialog>

                <Dialog open={openEditUserInfo} aria-labelledby="form-dialog-title">
                    <DialogContent>
                        <DialogContentText>
                            <strong>SUA INFORMAÇÃO</strong>
                        </DialogContentText>

                        <DialogContentText>
                            Nome da conta: <TextField onChange={event => setUsername(event.target.value)}></TextField>
                        </DialogContentText>

                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setEditUserInfo(false)} color="primary">
                            FECHAR
                    </Button>
                    <Button onClick={() => saveEdittedUserInfo(false)} color="primary">
                            SALVAR
                    </Button>
                    </DialogActions>
                </Dialog>

            </div> : null}

        </>


    );
}
