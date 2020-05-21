import React, {useState} from 'react';

import produce from 'immer'

import { Container } from './styles';

import List from '../list/index';

import BoardContext from './context'

import DatatoFeed from '../../board/board_feed';

import backgrounds from "../../backgrounds/backgrounds.js"

export default function Board_Content({board_background, data_cards, board_id}){

    const [openBackgrounds, setOpenBackgrounds] = React.useState(false);  //TERMINAR DIALOG BACKGROUNDS

    const [backgrounds_data, setBackgrounds] = React.useState(backgrounds);

    let background_id = board_background;

    const [lists, setLists] = useState(data_cards);

    function move(fromList, toList, from, to){
      setLists(produce(lists, draft => {
            const dragged = draft[fromList].items[from];
            draft[fromList].items.splice(from, 1);
            draft[toList].items.splice(to, 0, dragged);
      }))
    }

    
    return (
      <BoardContext.Provider value={{ lists, move }}>
        <Container background={backgrounds_data[board_background[1]].content}>
          {lists.map((data, index) => <List board_id={board_id} key={data.name} index={index} data={data}/>)}
        </Container>
      </BoardContext.Provider>
    );
}