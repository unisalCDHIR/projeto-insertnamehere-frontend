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

import { getToken } from '../../authentication/auth';

import EditIcon from '@material-ui/icons/Edit';

import TextField from '@material-ui/core/TextField';



export default function Card({ cards, index, listIndex, board_id }){

    const ref = useRef();

    const { move } = useContext(BoardContext);

    const [openCardModal, setOpenCardModal] = React.useState(false);

    const [edittedCardName, setEdittedCardName] = React.useState('');

    const [edittedCardDescription, setEdittedCardDescription] = React.useState('');

    const [editCardDialog, seteditCardDialog] = React.useState(false);

    const [{isDragging}, dragRef] = useDrag({
      item: { type: 'CARD', index, listIndex, id: cards.id},
      collect: monitor => ({
        isDragging: monitor.isDragging(),
      })
    });

    let token = getToken();

    function removeElement(id) {
      var elem = document.getElementById(id);
      return elem.parentNode.removeChild(elem);
  }

    function editCard(card_id, column){

      document.getElementById("card_name" + card_id).innerText = edittedCardName;
      document.getElementById("card_desc" + card_id).innerText = edittedCardDescription;

      setOpenCardModal(false);
      seteditCardDialog(false);

      api.put("/cards/" + card_id,{
        boardId: board_id,
        column: column,
        description: edittedCardDescription,
        name: edittedCardName,
        usersIds:[
          
        ]
      },{
        headers:{
          Authorization: token
        }
      }).then(res => console.log(res)).catch( err => console.log(err))
    }

    function deleteCard(card_id){ //delete no /cards
      setOpenCardModal(false);
      api.delete("/cards/" + card_id,{
        headers:{
          Authorization: token
        }
      }).then(res => 
        removeElement(card_id)
        ).catch(err => console.log(err))
    }

    const [, dropRef] = useDrop({
      accept:'CARD',
      hover(item, monitor){
        if(item.id !== "temp"){
        const draggedListIndex = item.listIndex;
        const targetListIndex = listIndex;

        const draggedIndex = item.index;
        const targetIndex = index;
        if(draggedIndex === targetIndex && draggedListIndex === targetListIndex){
          return;
        }
        
        const targetSize = ref.current.getBoundingClientRect();
        const targetCenter = (targetSize.bottom - targetSize.top) / 2;

        const draggedOffset = monitor.getClientOffset();
        const draggedTop = draggedOffset.y - targetSize.top;

        if(draggedIndex < targetIndex && draggedTop < targetCenter){
          return;
        }

        if(draggedIndex > targetIndex && draggedTop > targetCenter){
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
            <span id={"card_name" + cards.id}>{cards.name}</span>
          </header>
          <p id={"card_desc" + cards.id} >{cards.content}</p>
          {cards.id !== "temp" && <img src="https://api.adorable.io/avatars/285/abott@adorable.png" alt=""/>}
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

            <DialogActions>
              <Button onClick={() => setOpenCardModal(false)}>FECHAR <CancelIcon></CancelIcon></Button>

              <Button onClick={() => seteditCardDialog(true)}>EDITAR <EditIcon></EditIcon></Button>

              <Button onClick={() => deleteCard(cards.id)}>DELETAR O CARD <DeleteForeverIcon/></Button>
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
              <Button onClick={() => editCard(cards.id, cards.column)}>SALVAR <SaveIcon/></Button>
              <Button onClick={() => seteditCardDialog(false)}>FECHAR <CancelIcon/></Button>
            </DialogActions>
        </Dialog>

      </>
    );
}