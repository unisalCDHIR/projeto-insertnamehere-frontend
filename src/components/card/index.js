import React, { useRef, useContext } from 'react';

import BoardContext from '../board/context'

import { Container } from './styles';

import { useDrag, useDrop } from 'react-dnd'

import Dialog from '@material-ui/core/Dialog';

import DialogActions from '@material-ui/core/DialogActions';

import DialogContent from '@material-ui/core/DialogContent';

import DialogContentText from '@material-ui/core/DialogContentText';

import CancelIcon from '@material-ui/icons/Cancel';

import Button from '@material-ui/core/Button';

import SaveIcon from '@material-ui/icons/Save';

import DeleteForeverIcon from '@material-ui/icons/DeleteForever';

import api from "../../services/api"

import { getToken, getId } from '../../authentication/auth';

import EditIcon from '@material-ui/icons/Edit';

import TextField from '@material-ui/core/TextField';

import icons_data from "../../enums/icons.js"

import Tooltip from '@material-ui/core/Tooltip';

import IconButton from '@material-ui/core/IconButton';

import SearchIcon from '@material-ui/icons/Search';

import Chip from '@material-ui/core/Chip';

import Avatar from '@material-ui/core/Avatar';

import AddCircleIcon from '@material-ui/icons/AddCircle';

import Snackbar from '@material-ui/core/Snackbar'

import { Alert } from '@material-ui/lab';

export default function Card({ cards, index, listIndex, board_id }) {

  const ref = useRef();

  const user_id = getId();

  let token = getToken();

  const { move } = useContext(BoardContext);

  const [openCardModal, setOpenCardModal] = React.useState(false);

  const [edittedCardName, setEdittedCardName] = React.useState('');

  const [edittedCardDescription, setEdittedCardDescription] = React.useState('');

  const [editCardDialog, seteditCardDialog] = React.useState(false);

  const [icons, setIcons] = React.useState(icons_data);

  const [addPeople, setAddpeople] = React.useState(false);

  const [userName, setUsername] = React.useState('');

  const user_email = [];

  const [userRes, setUserRes] = React.useState({});

  const [lockState, setLockState] = React.useState(false);

  const [usertoCard, setUsertoCard] = React.useState("");

  const [openCardDeleted, setopenCardDeleted] = React.useState(false);
  
  const [openCardEditted, setopenCardEditted] = React.useState(false);

  const [openUserAddedToCard, setopenUserAddedtoCard] = React.useState(false);

  const [openUserDeletedFromCard, setopenUserDeletedFromCard] = React.useState(false);

  const [openError, setOpenError] = React.useState(false);

  const [error, setError] = React.useState('');

  function searchingFor(userName) {

    return function (user) {
      return user.name.toLowerCase().includes(userName.toLowerCase()) && user.email.toLowerCase().includes(userName.toLowerCase()) || !userName;
    }

  }

  if (!lockState) {
    getAllUsers();
  }

  function getBoardId() {
    var info = window.location.href.split('/');
    return info[4];
  }

  function handleClose(){
    setopenCardDeleted(false);
    setopenCardEditted(false);
    setopenUserAddedtoCard(false);
    setopenUserDeletedFromCard(false);
    setOpenError(false);
  }

  async function getAllUsers() {
    setLockState(true); //ver amanha terminar amanha legal falta isso e mais algumas coisas aaaaa
    api.get("/boards"+ "/"+ getBoardId(), {
      headers: {
        Authorization: token
      }
    }).then(res => {
      setUserRes(res.data.users);

    }).catch(err => {
      console.log(err);
    })

  }

  function getIconId(user_avatar) {
    let board_b = "";
    if (user_avatar.length === 3) {
      board_b = user_avatar[1] + user_avatar[2];
    }
    else {
      board_b = user_avatar[1];
    }
    return board_b;
  }

  const [{ isDragging }, dragRef] = useDrag({
    item: { type: 'CARD', index, listIndex, id: cards.id },
    collect: monitor => ({
      isDragging: monitor.isDragging(),
    })
  });

  function removeElement(id) {
    var elem = document.getElementById(id);
    return elem.parentNode.removeChild(elem);
  }

  async function putUserInCard(user_id, card_users,  card_id, card_column, description, name) {
    var users = [];

    card_users.forEach(user => {
      users.push(user.id);
    });

    users.push(user_id);

    api.put("/cards/" + card_id, {
      boardId: board_id,
      column: card_column,
      description: description,
      name: name,
      usersIds: users
    }, {
      headers: {
        Authorization: token
      }
    }).then(res => {
      setOpenCardModal(false);

      window.location.reload();

      window.onload(setopenUserAddedtoCard(true));

      
     

    }).catch(err => {
      console.log(err);
    });

  }

  function removeItemFromArray(arr, value) { 
    var index = arr.indexOf(value);
    if (index > -1) {
        arr.splice(index, 1);
    }
    return arr;
}

  async function deleteUserfromCard(usersToMaintain, userToDelete, card_column, description, name, card_id){

    var users = [];

    usersToMaintain.forEach(user => {
      users.push(user.id);
    });

    removeItemFromArray(users, userToDelete);

    api.put("/cards/" + card_id,{
      boardId: board_id,
      column: card_column,
      description: description,
      name: name,
      usersIds: users
    }, {
      headers: {
        Authorization: token
      }
    }).then(res => {window.location.reload(); setopenUserDeletedFromCard(true)}).catch(err => {setOpenError(true); setError(err.response.data.errors[0].defaultMessage)})
  }


  function editCard(card_id, column, users) {

    var users_data = [];

    users.forEach(user => {
      users_data.push(user.id);
    });

    document.getElementById("card_name" + card_id).innerText = edittedCardName;
    document.getElementById("card_desc" + card_id).innerText = edittedCardDescription;

    setOpenCardModal(false);
    seteditCardDialog(false);

    api.put("/cards/" + card_id, {
      boardId: board_id,
      column: column,
      description: edittedCardDescription,
      name: edittedCardName,
      usersIds: users_data
    }, {
      headers: {
        Authorization: token
      }
    }).then(res => setopenCardEditted(true)).catch(err => {setOpenError(true); setError(err.response.data.errors[0].defaultMessage)})
  }

  function deleteCard(card_id) { //delete no /cards
    setOpenCardModal(false);
    api.delete("/cards/" + card_id, {
      headers: {
        Authorization: token
      }
    }).then(res =>{
      removeElement(card_id)
      setopenCardDeleted(true)
    }
     
    ).catch(err => {setOpenError(true); setError(err.response.data.errors[0].defaultMessage)})
  }

  const [, dropRef] = useDrop({
    accept: 'CARD',
    hover(item, monitor) {
      if (item.id !== "temp") {
        const draggedListIndex = item.listIndex;
        const targetListIndex = listIndex;

        const draggedIndex = item.index;
        const targetIndex = index;
        if (draggedIndex === targetIndex && draggedListIndex === targetListIndex) {
          return;
        }

        const targetSize = ref.current.getBoundingClientRect();
        const targetCenter = (targetSize.bottom - targetSize.top) / 2;

        const draggedOffset = monitor.getClientOffset();
        const draggedTop = draggedOffset.y - targetSize.top;

        if (draggedIndex < targetIndex && draggedTop < targetCenter) {
          return;
        }

        if (draggedIndex > targetIndex && draggedTop > targetCenter) {
          return;
        }

        move(draggedListIndex, targetListIndex, draggedIndex, targetIndex, cards.id);

        item.index = targetIndex;
        item.listIndex = targetListIndex;

      }

    }
  });

  dragRef(dropRef(ref));

  return (

    <>
      <Container onClick={() => setOpenCardModal(true)} ref={ref} isDragging={isDragging} id={cards.id}>
        <header>
          <span><strong id={"card_name" + cards.id}>{cards.name}</strong></span>
        </header>
        <p id={"card_desc" + cards.id} >{cards.content}</p>
        <br />
        {cards.users[0] ? cards.users[0].avatar && cards.users.map(user =>
          <>
            <Tooltip title={user.name}>
              <img className="icon_" style={{ margin: 4 }} src={icons[getIconId(user.avatar)].content} alt="" />
            </Tooltip>
          </>
        ) : null}



      </Container>

      <Dialog open={openCardModal} aria-labelledby="form-dialog-title">
        <DialogContent>
          <DialogContentText>
            <strong>INFORMAÇÃO DO CARD</strong>
          </DialogContentText>
          <DialogContentText>
            <strong>Nome do card: </strong>
            {cards.name}
          </DialogContentText>
          <DialogContentText>
            <strong>Descrição: </strong>
            {cards.content}
          </DialogContentText>
        </DialogContent>

        <DialogContent>

          <Button onClick={() => setAddpeople(true)}>
            <strong>Adicionar pessoas ao card</strong>
            <AddCircleIcon color="primary" id="addIcon"></AddCircleIcon>
          </Button>

        </DialogContent>

        {addPeople && <DialogContent>
          <DialogContentText>
            <strong> Nome do usuário: </strong> <TextField id="txt_username" onChange={event => setUsername(event.target.value)} /> <IconButton> <SearchIcon /> </IconButton>
          </DialogContentText>
          {userRes.length > 0 && userRes.filter(searchingFor(userName)).map(user =>
            <DialogContentText>
              <Chip onClick={() => putUserInCard(user.id, cards.users, cards.id, cards.column, cards.content, cards.name)} avatar={<Avatar src={icons[getIconId(user.avatar)].content} />} label={user.name + " / " + user.email}></Chip>
               <IconButton onClick={() => deleteUserfromCard(cards.users, user.id,  cards.column, cards.content, cards.name, cards.id )}><DeleteForeverIcon color="secondary"></DeleteForeverIcon></IconButton></DialogContentText>)}
        </DialogContent>}




        <DialogActions id="buttonCardInfo">

          <Button onClick={() => setOpenCardModal(false)}>FECHAR <CancelIcon></CancelIcon></Button>

          <Button onClick={() => seteditCardDialog(true)}>EDITAR <EditIcon></EditIcon></Button>

          <Button onClick={() => deleteCard(cards.id)}>DELETAR O CARD <DeleteForeverIcon /></Button>
        </DialogActions>
      </Dialog>

      <Dialog open={editCardDialog} aria-labelledby="form-dialog-title">
        <DialogContent>
          <DialogContentText>
            <strong>INFORMAÇÃO DO CARD</strong>
          </DialogContentText>
          <DialogContentText>
            <strong>Nome do card: </strong>
            <TextField onChange={event => setEdittedCardName(event.target.value)} defaultValue={cards.name}> </TextField>
          </DialogContentText>
          <DialogContentText>
            <strong>Descrição: </strong>
            <TextField onChange={event => setEdittedCardDescription(event.target.value)} defaultValue={cards.content}></TextField>
          </DialogContentText>
        </DialogContent>

        <DialogActions>
          <Button onClick={() => editCard(cards.id, cards.column, cards.users)}>SALVAR <SaveIcon /></Button>
          <Button onClick={() => seteditCardDialog(false)}>FECHAR <CancelIcon /></Button>
        </DialogActions>
      </Dialog>

      <Snackbar open={openCardDeleted} onClose={handleClose}>
        <Alert onClose={handleClose} severity="error">
           O card selecionado foi deletado!
        </Alert>
      </Snackbar>

      <Snackbar open={openCardEditted} onClose={handleClose}>
        <Alert onClose={handleClose} severity="success">
           Card editado com sucesso!
        </Alert>
      </Snackbar>

      <Snackbar open={openUserAddedToCard} onClose={handleClose}>
        <Alert onClose={handleClose} severity="success">
           Usuário adicionado ao card!
        </Alert>
      </Snackbar>

      <Snackbar open={openUserDeletedFromCard} onClose={handleClose}>
        <Alert onClose={handleClose} severity="error">
           Usuário deletado do card!
        </Alert>
      </Snackbar>

      <Snackbar open={openError} autoHideDuration={6000} onClose={handleClose}>
        <Alert onClose={handleClose} severity="error">
          {error}
        </Alert>
      </Snackbar>

    </>
  );
}