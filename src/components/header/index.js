import React, { useContext } from 'react';

import { Container } from './styles';

import ExitToAppIcon from '@material-ui/icons/ExitToApp';

import "../header/styles.css"

import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';

import IconButton from '@material-ui/core/IconButton';

import TextField from '@material-ui/core/TextField';

import BoardBackgroundContext from "../board/context.js"

import FilterHdrIcon from '@material-ui/icons/FilterHdr';

import PeopleAltIcon from '@material-ui/icons/PeopleAlt';

import backgrounds from '../../enums/backgrounds'

import Grid from '@material-ui/core/Grid';

import api from '../../services/api.js'

import { getToken } from '../../authentication/auth';

import AddCircleIcon from '@material-ui/icons/AddCircle';

import SearchIcon from '@material-ui/icons/Search';

import Chip from '@material-ui/core/Chip';

import icons_data from '../../enums/icons.js'

import Avatar from '@material-ui/core/Avatar';

import Snackbar from '@material-ui/core/Snackbar'

import { Alert } from '@material-ui/lab';


export default function Header({ board_id, board_background, board_name, board_description, board_users, board_owner, board_owner_email }) {  //TERMINAR DIALOG BACKGROUNDS

  const [openLogout, setOpenLogout] = React.useState(false);
  const [openPeople, setOpenPeople] = React.useState(false);
  const [openBackgrounds, setOpenBackgrounds] = React.useState(false);
  const [backgroundArr, setBackgroundArr] = React.useState(backgrounds);
  const [backgroundId, setBackgroundId] = React.useState(board_background);
  const [addPeople, setAddpeople] = React.useState(false);
  const [userName, setUsername] = React.useState('');
  const user_email = [];
  const [userRes, setUserRes] = React.useState({});
  const [lockState, setLockState] = React.useState(false);
  const [icons, setIcons] = React.useState(icons_data);
  const [usertoBoard, setUsertoBoard] = React.useState("");
  const [openUserAddedtoBoard, setopenUserAddedtoBoard] = React.useState(false);
  

  function handleCloseLogout() {
    setOpenLogout(false);
  }

  function handleClose(){
    setopenUserAddedtoBoard(false);
  }

  function redirectToHome(){
    window.location = "/home";
  }

  let token = getToken();

  function handleCloseAndLogout() {
    localStorage.removeItem("TOKEN_KEY");
    localStorage.removeItem("ID_KEY");
    setOpenLogout(false);
    window.location = '/login';
  }

  function getBackgroundId(board_background){
    let board_b = "";
    if(board_background.length === 3){
      board_b = board_background[1] + board_background[2];
      console.log(board_b);
    }
    else{
      board_b = board_background[1];
    }
    return board_b;
   }

   function getIconId(icon){
    let board_b = "";
    if(icon.length === 3){
      board_b = icon[1] + icon[2];
      console.log(board_b);
    }
    else{
      board_b = icon[1];
    }
    return board_b;
   }

   if(!lockState){
     getAllUsers();
   }

   console.log(userRes);

   async function getAllUsers(){
     setLockState(true); //ver amanha terminar amanha legal falta isso e mais algumas coisas aaaaa
     api.get("/users",{
       headers: {
         Authorization: token
       }
     }).then(res => {
      setUserRes(res.data); 
      
     }).catch(err => {
      console.log(err);
     })
     
   }

   function closePeople(){
     setOpenPeople(false);
     setAddpeople(false);
     setUsertoBoard("");
   }

   function searchingFor(userName){

    return function(user){
      return user.name.toLowerCase().includes(userName.toLowerCase()) && user.email.toLowerCase().includes(userName.toLowerCase()) || !userName;
    }
    
   }

   async function putUserInBoard(user_id){

       setOpenPeople(false);
       api.post("/boards/" + board_id + "/" + user_id,{},{
         headers: {
           Authorization: token
         }
       }).
       catch(res => {
        setopenUserAddedtoBoard(true)
        getAllUsers();
       }
        
        
        ).
       catch(err =>
        console.log(err)) 

   }


  async function putBackground(board_id, background_data, token){
    api.put("/boards/" + board_id + "/background", {
      background: background_data
    }
    , {
      headers:{
        Authorization: token
    }}).then(res => {
      document.getElementById("board").style.backgroundImage = "url(" + backgroundArr[getBackgroundId(background_data)].content + ")";
      document.getElementsByClassName("background-selected")[0].setAttribute("class", backgroundId);
      document.getElementsByClassName(background_data)[0].setAttribute("class", "background-selected");
    } 
      
      ).catch(err => 
        console.log(err)
        );
  }


  return (
      <Container>
        <h1 onClick={() => redirectToHome()}> CDHI - Quadros Organizacionais</h1>

        <div id="headers_icons">

            <IconButton><FilterHdrIcon id="backgroundsIcon" onClick={() => setOpenBackgrounds(true)} /></IconButton>

            <IconButton><PeopleAltIcon onClick={() => setOpenPeople(true)} id="peopleIcon" /></IconButton>

            <IconButton><ExitToAppIcon onClick={() => setOpenLogout(true)} id="logoutIcon" /></IconButton>

        </div>

        <Dialog open={openLogout} aria-labelledby="form-dialog-title">
          <DialogContent>
            <DialogContentText>
              Deseja mesmo fazer logout?
                </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseLogout} color="primary">
              Não
          </Button>
            <Button onClick={handleCloseAndLogout} color="primary">
              Sim
          </Button>
          </DialogActions>
        </Dialog>

        <Dialog open={openPeople} aria-labelledby="form-dialog-title">
          <DialogContent>
            <DialogContentText><strong id="boardTitle" >PESSOAS DO QUADRO</strong></DialogContentText>
            <DialogContentText>
                <strong>Nº de usuários: </strong>{board_users.length}
              </DialogContentText>
            {board_users.map(user => <>
              <DialogContentText>
                <strong>Nome do usuário: </strong> {user.name}</DialogContentText>
              <DialogContentText>
                <strong>Email do usuário: </strong> {user.email}
              </DialogContentText></>)}
          </DialogContent>
          <DialogContent>

          <Button onClick={() => setAddpeople(true)}>
                <strong>Adicionar pessoas ao quadro</strong>
              <AddCircleIcon color="primary" id="addIcon"></AddCircleIcon>
          </Button>
            
          </DialogContent>
          {addPeople && <DialogContent>
              <DialogContentText>
               <strong> Nome do usuário: </strong> <TextField id="txt_username" onChange={event => setUsername(event.target.value)}/> <IconButton> <SearchIcon/> </IconButton>
              </DialogContentText>
            {userRes.filter(searchingFor(userName)).map(user => 
            <DialogContentText>
                  <Chip onClick={() => putUserInBoard(user.id)} avatar={<Avatar src={icons[getIconId(user.avatar)].content} />} label={user.name + " / " + user.email}></Chip></DialogContentText>)}
            </DialogContent>}
          <DialogActions>
            <Button onClick={() => closePeople()} color="primary">
              FECHAR
          </Button>
          </DialogActions>
        </Dialog>

        <Dialog open={openBackgrounds} aria-labelledby="form-dialog-title">
          <DialogContent>
            <DialogContentText>
              <strong>PLANOS DE FUNDO</strong>
            </DialogContentText>

            <Grid align="center" container spacing={3}>
              {backgroundArr.map(background => <>
                <Grid item sm={6} id="imgDiv">
                  <img onClick={() => putBackground(board_id, background.id, token)} id="imgs" className={background.id === backgroundId ? "background-selected" : background.id} src={background.content}></img>
                </Grid>
              </>)}
            </Grid>

          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenBackgrounds(false)} color="primary">
              FECHAR
          </Button>
          </DialogActions>
        </Dialog>

        <Snackbar open={openUserAddedtoBoard} onClose={handleClose}>
        <Alert onClose={handleClose} severity="success">
            Usuário adicionado na board!
        </Alert>
      </Snackbar>

      </Container>

     
  );
}