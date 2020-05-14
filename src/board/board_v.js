import React from 'react';
import HomeIcon from '@material-ui/icons/Home';
import './board_v.css';
import api from '../services/api'
import { getId, getToken, logout } from '../authentication/auth';
import PeopleIcon from '@material-ui/icons/People';
import Logo from '../assets/img/Logo.png';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Boards from '../components/board';
import BoardData from "../board/board_data"
import DataToFeed from "../board/board_feed"

export default function Board() {

  const [breakEl, setBreakEl] = React.useState(false);
  const [boardName, setBoardName] = React.useState('');
  const [boardDesc, setBoardDesc] = React.useState('');
  const [boardCards, setBoardCards] = React.useState([]);
  const [boardUsers, setBoardUsers] = React.useState('');
  const [boardOwner, setBoardOwner] = React.useState('');
  const [boardOwnerEmail, setBoardOwnerEmail] = React.useState('');
  const [dialogConfirm, setDialog] = React.useState(false);
  const [dialogOwner, setDialogOwner] = React.useState(false);
  const [confirmLogout, setConfirmLogout] = React.useState(false);
  const [arrayBoards, setarrayBoards] = React.useState([]);
  const [lockState, setlockState] = React.useState(false);

  if (!breakEl) {
    getBoardById();
  }
  
  function getBoardId() {
    var info = window.location.href.split('/');
    return info[4];
  }

  async function getBoardById() {
    setBreakEl(true);
    var boardId = getBoardId();
    var token = getToken();
    await api.get('/boards/' + boardId, {
      headers: {
        Authorization: token  //the token is a variable which holds the token
      }
    }).then(res => {
      setBoardName(res.data.name);
      setBoardDesc(res.data.description);
      res.data.cards.forEach(element => {
        boardCards.push(element);
      })
      setBoardUsers(res.data.users);
      setBoardOwner(res.data.owner.name);
      setBoardOwnerEmail(res.data.owner.email);
    })
      .catch(err => {

      });
  }
  
  function goToHome() {
    setDialog(true);
  }

  function goToPeople() {
    setDialogOwner(true);
  }

  function handleGoToHome() {
    window.location = '/home';
  }

  function Logout() {
    setConfirmLogout(true);
  }

  function handleLogoutAct() {
    logout();
    window.location = '/login'
  }



  return (
    <div id="header">
      <div id="boardButtons">
        <HomeIcon id="homeIcon" onClick={goToHome} style={{ fontSize: 40 }} /> <PeopleIcon id="peopleIcon" onClick={goToPeople} style={{ fontSize: 40 }} /><img id="Logo" src={Logo} height="62" width="62" />
        <strong> - Quadros Organizacionais</strong>
        <ExitToAppIcon style={{ fontSize: 40 }} onClick={Logout} id="logoutBtn" />
      </div>

      <div id="boardInfo">
        <h3>Quadro: "{boardName}" </h3>
        <h3>Descrição: "{boardDesc}" </h3>
      </div>
      <Dialog open={dialogConfirm}>
        <DialogContent >
          <DialogContentText>
            <strong>Deseja voltar para home?</strong>
          </DialogContentText>
          <Button onClick={() => handleGoToHome()}>
            SIM
                        </Button>
          <Button onClick={() => setDialog(false)}>
            NÃO
                        </Button>
        </DialogContent>
      </Dialog>

      <Dialog open={confirmLogout}>
        <DialogContent >
          <DialogContentText>
            <strong>Deseja dar logout?</strong>
          </DialogContentText>
          <Button onClick={() => handleLogoutAct()}>
            SIM
                        </Button>
          <Button onClick={() => setConfirmLogout(false)}>
            NÃO
                        </Button>
        </DialogContent>
      </Dialog>

      <Dialog open={dialogOwner}>
        <DialogContent >
          <DialogContentText>
            <strong>PESSOAS</strong>
          </DialogContentText>
          <DialogContentText>
            <strong>Dono do quadro: </strong>{boardOwner}
          </DialogContentText>

          <DialogContentText>
            <strong>Email do dono: </strong>  {boardOwnerEmail}
          </DialogContentText>
          <Button onClick={() => setDialogOwner(false)}>
            SAIR
                    </Button>
        </DialogContent>
      </Dialog>

      {boardCards.length ? 
       <BoardData data={DataToFeed(boardCards)}/> : null}}
      

     
    </div>
    //
  )

}



