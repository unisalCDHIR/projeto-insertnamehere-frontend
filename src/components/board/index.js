import React, {useState} from 'react';

import produce from 'immer'

import { Container } from './styles';

import List from '../list/index';

import BoardContext from './context'

import DatatoFeed from '../../board/board_feed';

export default function Board_Content({data_cards}){

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
        <Container >
          {lists.map((data, index) => <List key={data.name} index={index} data={data}/>)}
        </Container>
      </BoardContext.Provider>
    );
}