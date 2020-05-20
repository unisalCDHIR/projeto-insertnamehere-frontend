import React, { useRef, useContext } from 'react';

import BoardContext from '../board/context'

import { Container } from './styles';

import { useDrag, useDrop } from 'react-dnd'

export default function Card({ cards, index, listIndex }){

    const ref = useRef();
    const { move } = useContext(BoardContext);

    const [{isDragging}, dragRef] = useDrag({
      item: { type: 'CARD', index, listIndex, id: cards.id},
      collect: monitor => ({
        isDragging: monitor.isDragging(),
      })
    });

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
        <Container ref={ref} isDragging={isDragging} id={cards.id}>
          <header>
            {cards.name}
          </header>
          <p>{cards.content}</p>
          {cards.id !== "temp" && <img src="https://api.adorable.io/avatars/285/abott@adorable.png" alt=""/>}
        </Container>

      </>
    );
}