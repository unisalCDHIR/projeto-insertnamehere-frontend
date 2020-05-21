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

export default function Card({ cards, index, listIndex }){

    const ref = useRef();
    const { move } = useContext(BoardContext);
    const [openCardModal, setOpenCardModal] = React.useState(false);

    const [{isDragging}, dragRef] = useDrag({
      item: { type: 'CARD', index, listIndex, id: cards.id},
      collect: monitor => ({
        isDragging: monitor.isDragging(),
      })
    });

    function saveCard(){

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
            {cards.name}
          </header>
          <p>{cards.content}</p>
          {cards.id !== "temp" && <img src="https://api.adorable.io/avatars/285/abott@adorable.png" alt=""/>}
        </Container>

        <Dialog open={openCardModal} aria-labelledby="form-dialog-title">
            <DialogContent>
              <DialogContentText>
                <strong>INFORMAÇÃO DO CARD</strong>
              </DialogContentText>
              <DialogContentText>
                <strong>Nome do card :</strong> 
                {cards.name}
              </DialogContentText>
              <DialogContentText>
                <strong>Descrição :</strong>
                {cards.content}
              </DialogContentText>
            </DialogContent>

            <DialogActions>
              <Button onClick={() => setOpenCardModal(false)}>FECHAR <CancelIcon></CancelIcon></Button>

              <Button onClick={() => saveCard()}>SALVAR <SaveIcon></SaveIcon></Button>
            </DialogActions>
        </Dialog>

      </>
    );
}