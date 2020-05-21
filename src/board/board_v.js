import React from 'react';
import api from '../services/api'
import { getId, getToken, logout } from '../authentication/auth';
import GlobalStyle from '../styles/global'
import Header from '../components/header/index'
import Board_Content from '../components/board/index'
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
  const [boardId, setBoardId] = React.useState('');
  const [boardBackground, setBackground] = React.useState('');

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
      setBackground(res.data.background);
      setBoardId(res.data.id);
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

  return (
    <>
      <DndProvider backend={HTML5Backend}>
        {boardCards.length > 0 && <Header  board_name={boardName} board_description={boardDesc} board_users={boardUsers} board_owner={boardOwner} board_owner_email={boardOwnerEmail}/>}
        {boardCards.length > 0 && <GlobalStyle />}
        {boardCards.length > 0 && <Board_Content board_background={boardBackground} board_id={boardId} data_cards={DatatoFeed(boardCards)}/>}
      </DndProvider>
    </>
  );

}



