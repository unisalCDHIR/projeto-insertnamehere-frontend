import React, {useState, useContext } from 'react';

import produce from 'immer'

import { Container } from './styles';

import List from '../list/index';

import BoardContext from './context'

import DatatoFeed from '../../board/board_feed';

import backgrounds from "../../enums/backgrounds.js"
import api from '../../services/api';
import { getToken } from '../../authentication/auth';

export default function Board_Content({ board_background, data_cards, board_id, owner}){

    const [openBackgrounds, setOpenBackgrounds] = React.useState(false);  //TERMINAR DIALOG BACKGROUNDS

    const [backgrounds_data, setBackgrounds] = React.useState(backgrounds);

    const [lists, setLists] = useState(data_cards);

    let token = getToken();

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

     async function putCardinCol(card_dragged, to_column, name, description){

      if(to_column === "ON GOING" || to_column === "TO DO"){
        to_column = to_column.split(" ")[0] + to_column.split(" ")[1];
      }

      api.put("/cards/" + card_dragged, {
        boardId: board_id,
        column: to_column,
        name: name,
        description: description,
        usersIds: [
          owner
        ]
      },{
        headers:{
          Authorization: token
        }
      })
   }

    function move(fromList, toList, from, to){
      setLists(produce(lists, draft => {
            const dragged = draft[fromList].items[from];
            draft[fromList].items.splice(from, 1);
            draft[toList].items.splice(to, 0, dragged);
            putCardinCol(dragged.id,draft[toList].name, dragged.name, dragged.content);
      }))
    }

    
    return (
      <BoardContext.Provider value={{ lists, move }}>
        <Container id="board" background={backgrounds_data[getBackgroundId(board_background)].content}>
          {lists.map((data, index) => <List board_id={board_id} key={data.name} index={index} data={data}/>)}
        </Container>
      </BoardContext.Provider>
    );
}