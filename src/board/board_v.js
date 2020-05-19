import React from 'react';
import HomeIcon from '@material-ui/icons/Home';
import api from '../services/api'
import { getId, getToken, logout } from '../authentication/auth';
import GlobalStyle from '../styles/global'
import Header from '../components/header/index'
import Board_Content from '../components/board/index'
import Card from '../components/board/index'
import DatatoFeed from '../board/board_feed'
import { DndProvider } from 'react-dnd'
import HTML5Backend from 'react-dnd-html5-backend'

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

  if(boardCards.length){
    console.log(boardCards);
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
    <>
      <DndProvider backend={HTML5Backend}>
        {boardCards.length > 0 && <Header />}
        {boardCards.length > 0 && <GlobalStyle />}
        {boardCards.length > 0 && <Board_Content data_cards={DatatoFeed(boardCards)}/>}
      </DndProvider>
    </>
  );

}



