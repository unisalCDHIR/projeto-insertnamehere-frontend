import React ,{ useRef, useContext } from 'react';

import { Container } from './styles';

import { MdAdd } from 'react-icons/md'

import Card from "../card/index";

import BoardContext from '../board/context'

import { useDrag, useDrop } from 'react-dnd'

import AddCircleIcon from '@material-ui/icons/AddCircle';

import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';

import TextField from '@material-ui/core/TextField';

import api from '../../services/api';
import { getToken } from '../../authentication/auth';

export default function List( { data, index: listIndex } ){

  const { lists } = useContext(BoardContext);

  const [openAddCard, setOpenAddCard] = React.useState(false);

  const [newCardName, setNewCardName] = React.useState('');

  const [newCardDescription, setNewCardDescription] = React.useState('');

  const [newCardColumn, setNewCardColumn] = React.useState("BACKLOG");

  let token = getToken();

  async function addCard(){
    api.post("/cards", {
      boardId: "30",
      column: newCardColumn,
      description: newCardDescription,
      name: newCardName,
      usersIds: [
        3
      ]
    },  {
          headers: {
          Authorization: token
      }
  }).then(res => {
      console.log(res);
    }).catch(err => {
      console.log(err);
    });
  }

    return (
      <Container >
        <header>
          <h2>{data.name}</h2>
          {data.name === "BACKLOG" && (
          <button onClick={() => setOpenAddCard(true)} type="button">
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
        <Dialog open={openAddCard} aria-labelledby="form-dialog-title">
            <DialogContent>
              <DialogContentText>
                <strong>ADICIONAR UM NOVO CARD</strong>
              </DialogContentText>
              <DialogContentText>
                <strong>Nome do card :</strong> 
                <TextField
                  id="txtCardName"
                  onChange={event => setNewCardName(event.target.value)}
                ></TextField>
              </DialogContentText>
              <DialogContentText>
                <strong>Descrição :</strong>
                <TextField
                  id="txtCardDescription"
                  onChange={event => setNewCardDescription(event.target.value)}
                ></TextField>
              </DialogContentText>
            </DialogContent>
          <DialogActions>
            <Button onClick={() => addCard()} color="primary">
              <strong>Adicionar</strong> <AddCircleIcon/>
            </Button>

            <Button onClick={() => setOpenAddCard(false)} color="primary">
              <strong>FECHAR</strong> 
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    );
}