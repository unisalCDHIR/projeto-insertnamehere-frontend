import React, { useContext } from 'react';

import { Container } from './styles';

import ExitToAppIcon from '@material-ui/icons/ExitToApp';

import "../header/styles.css"

import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';

import BoardBackgroundContext from "../board/context.js"

import FilterHdrIcon from '@material-ui/icons/FilterHdr';

import PeopleAltIcon from '@material-ui/icons/PeopleAlt';

import backgrounds from '../../enums/backgrounds'

import Grid from '@material-ui/core/Grid';

import api from '../../services/api.js'

import { getToken } from '../../authentication/auth';


export default function Header({ board_id, board_background, board_name, board_description, board_users, board_owner, board_owner_email }) {  //TERMINAR DIALOG BACKGROUNDS

  const [openLogout, setOpenLogout] = React.useState(false);
  const [openPeople, setOpenPeople] = React.useState(false);
  const [openBackgrounds, setOpenBackgrounds] = React.useState(false);
  const [backgroundArr, setBackgroundArr] = React.useState(backgrounds);
  const [backgroundId, setBackgroundId] = React.useState(board_background);

  function handleCloseLogout() {
    setOpenLogout(false);
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
        <h1> CDHI - Quadros Organizacionais</h1>

        <FilterHdrIcon onClick={() => setOpenBackgrounds(true)} id="backgroundsIcon" />

        <PeopleAltIcon onClick={() => setOpenPeople(true)} id="peopleIcon" />

        <ExitToAppIcon onClick={() => setOpenLogout(true)} id="logoutIcon" />

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
            {board_users.map(user => <>
              <DialogContentText>
                <strong>Nº de usuários: </strong>{board_users.length}
              </DialogContentText>
              <DialogContentText>
                <strong>Nome do usuário: </strong> {user.name}</DialogContentText>
              <DialogContentText>
                <strong>Email do usuário: </strong> {user.email}
              </DialogContentText></>)}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenPeople(false)} color="primary">
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


      </Container>
  );
}