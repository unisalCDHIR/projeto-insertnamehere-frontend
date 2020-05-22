import React, {useState, useContext } from 'react';

import produce from 'immer'

import { Container } from './styles';

import List from '../list/index';

import BoardContext from './context'

import HeaderContext from '../header/context'

import DatatoFeed from '../../board/board_feed';

import backgrounds from "../../enums/backgrounds.js"

export default function Board_Content({ board_background, data_cards, board_id}){

    const [openBackgrounds, setOpenBackgrounds] = React.useState(false);  //TERMINAR DIALOG BACKGROUNDS

    const [backgrounds_data, setBackgrounds] = React.useState(backgrounds);

    const [lists, setLists] = useState(data_cards);

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

    const { background } = useContext(HeaderContext);

    function move(fromList, toList, from, to){
      setLists(produce(lists, draft => {
            const dragged = draft[fromList].items[from];
            draft[fromList].items.splice(from, 1);
            draft[toList].items.splice(to, 0, dragged);
      }))
    }

    
    return (
      <BoardContext.Provider value={{ lists, move }}>
        <Container background={backgrounds_data[getBackgroundId(board_background)].content}>
          {lists.map((data, index) => <List board_id={board_id} key={data.name} index={index} data={data}/>)}
        </Container>
      </BoardContext.Provider>
    );
}