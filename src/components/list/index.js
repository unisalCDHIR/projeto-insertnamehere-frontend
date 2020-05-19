import React ,{ useRef, useContext } from 'react';

import { Container } from './styles';

import { MdAdd } from 'react-icons/md'

import Card from "../card/index";

import BoardContext from '../board/context'

import { useDrag, useDrop } from 'react-dnd'

export default function List( { data, index: listIndex } ){

  const { lists } = useContext(BoardContext);

  const ref = useRef();

  let listitem = [];
  
  function isListItemsNull(){
    for(var i = 0; i < lists.length; i++){
      if(lists[i].items.length === 0){
        listitem = lists[i];
      }
    }
  }

    isListItemsNull();

    return (
      <Container >
        <header>
          <h2>{data.name}</h2>
          {data.name === "BACKLOG" && (
          <button type="button">
              <MdAdd size={24} color="#FFF"/>
          </button>)}
        </header>

        <ul>
          {data.items.map((card,index) => 
          <Card 
            key={card.id}
            listIndex={listIndex} 
            index={index} 
            cards={card} 
            data={data}
            />)} 
        </ul>
      </Container>
    );
}