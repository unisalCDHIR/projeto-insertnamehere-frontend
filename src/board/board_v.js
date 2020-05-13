import React from 'react';
import HomeIcon from '@material-ui/icons/Home';
import './board_v.css';
import api from '../services/api'
import { getId, getToken, logout } from '../authentication/auth';
import PeopleIcon from '@material-ui/icons/People';
import Logo from '../assets/img/Logo.png';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import uuid from "uuid/v4";
import Boards from '../components/board';


export default function Board () {

    const [breakEl, setBreakEl] = React.useState(false);
    const [boardName, setBoardName] = React.useState('');
    const [boardDesc, setBoardDesc] = React.useState('');
    const [boardCards, setBoardCards] = React.useState([]);
    const [boardUsers, setBoardUsers] = React.useState('');
    const [boardOwner, setBoardOwner] = React.useState('');
    const [boardOwnerEmail, setBoardOwnerEmail] = React.useState('');
    const [boardPeople, setPeople] = React.useState(false);
    const [dialogConfirm, setDialog] = React.useState(false);
    const [dialogOwner, setDialogOwner] = React.useState(false);
    const [confirmLogout, setConfirmLogout] = React.useState(false);

    if (!breakEl)
    {
        getBoardById();
    }

    function getBoardId(){
        var info = window.location.href.split('/');
        return info[4];
    }

    async function getBoardById(){
        setBreakEl(true);
        var boardId = getBoardId();
        var token = getToken();
        await api.get('/boards/' + boardId, {
            headers: {
                Authorization: token  //the token is a variable which holds the token
            }
        }).then(res => {
            console.log(res.data);
            setBoardName(res.data.name);
            setBoardDesc(res.data.description);
            setBoardCards(res.data.cards);
            setBoardUsers(res.data.users);
            setBoardOwner(res.data.owner.name);
            setBoardOwnerEmail(res.data.owner.email);
            
           
        })
            .catch(err => {
               
        });
    }

    const itemsFromBackendBacklog = [];
      
    const itemsFromBackendToDo = [];
    
    const itemsFromBackendOnGoing = [];
    
    const itemsFromBackendDone = [];

    if(boardCards.length>0){ //ver questoes de funcao async
        boardCards.forEach(element => {
           if(element.column === "BACKLOG"){
                 itemsFromBackendBacklog.push({ id: uuid(), content: element.description})
              }
             else if(element.column === "TODO"){
                  itemsFromBackendToDo.push({ id: uuid(), content: element.description})
            }
            else if(element.column === "ONGOING"){
                itemsFromBackendOnGoing.push({ id: uuid(), content: element.description})
             }
              else if(element.column === "DONE"){
                  itemsFromBackendDone.push({ id: uuid(), content: element.description})
              }
        })};
    
    const columnsFromBackend = {
        [uuid()]: {
          name: "BACKLOG",
          items: itemsFromBackendBacklog
        },
        [uuid()]: {
          name: "TO DO",
          items: itemsFromBackendToDo
        },
        [uuid()]: {
          name: "ONGOING",
          items: itemsFromBackendOnGoing
        },
        [uuid()]: {
          name: "DONE",
          items: itemsFromBackendDone
        }
      };
      
      const [columns, setColumns] = React.useState(columnsFromBackend);
        
        const onDragEnd = (result, columns, setColumns) => {
            if(itemsFromBackendBacklog.length>0 && itemsFromBackendOnGoing>0 && itemsFromBackendToDo.length>0 && itemsFromBackendDone.length>0){
                if (!result.destination) return;
          const { source, destination } = result;
        
          if (source.droppableId !== destination.droppableId) {
            const sourceColumn = columns[source.droppableId];
            const destColumn = columns[destination.droppableId];
            const sourceItems = [...sourceColumn.items];
            const destItems = [...destColumn.items];
            const [removed] = sourceItems.splice(source.index, 1);
            destItems.splice(destination.index, 0, removed);
            setColumns({
              ...columns,
              [source.droppableId]: {
                ...sourceColumn,
                items: sourceItems
              },
              [destination.droppableId]: {
                ...destColumn,
                items: destItems
              }
            });
          } else {
            const column = columns[source.droppableId];
            const copiedItems = [...column.items];
            const [removed] = copiedItems.splice(source.index, 1);
            copiedItems.splice(destination.index, 0, removed);
            setColumns({
              ...columns,
              [source.droppableId]: {
                ...column,
                items: copiedItems
              }
            });
          }
            }
          
        };

    function goToHome(){
        setDialog(true);
    }

    function goToPeople(){
        setDialogOwner(true);
    }

    function handleGoToHome(){
        window.location = '/home';
    }

    function Logout(){
        setConfirmLogout(true);
        //logout();
        //window.location = '/login'
    }

    function handleLogoutAct(){
        logout();
        window.location = '/login'
    }


    return (
        <div id="header">
            <div id="boardButtons">
                <HomeIcon id="homeIcon" onClick={goToHome} style={{fontSize:40}}/> <PeopleIcon id="peopleIcon" onClick={goToPeople} style={{fontSize:40}}/><img id="Logo" src={Logo} height="62" width="62" /> 
                <strong> - Quadros Organizacionais</strong>
                <ExitToAppIcon style={{fontSize:40}} onClick={Logout} id="logoutBtn" />
            </div>
            
            <div id="boardInfo">
                <h3>Quadro: "{boardName}" </h3>
                <h3>Descrição: "{boardDesc}" </h3>
            </div>
            <Dialog open={dialogConfirm}>
                <DialogContent >
                    <DialogContentText>
                        <strong>Deseja voltar para home?</strong>
                    </DialogContentText>
                        <Button onClick={() => handleGoToHome()}>
                            SIM
                        </Button>
                        <Button onClick={() => setDialog(false)}>
                            NÃO
                        </Button>
                </DialogContent>
            </Dialog>

            <Dialog open={confirmLogout}>
                <DialogContent >
                    <DialogContentText>
                        <strong>Deseja dar logout?</strong>
                    </DialogContentText>
                        <Button onClick={() => handleLogoutAct()}>
                            SIM
                        </Button>
                        <Button onClick={() => setConfirmLogout(false)}>
                            NÃO
                        </Button>
                </DialogContent>
            </Dialog>

            <Dialog open={dialogOwner}>
                <DialogContent >
                    <DialogContentText>
                        <strong>PESSOAS</strong>
                    </DialogContentText>
                    <DialogContentText>
                        <strong>Dono do quadro: </strong>{boardOwner}
                    </DialogContentText>

                    <DialogContentText>
                        <strong>Email do dono: </strong>  {boardOwnerEmail}
                    </DialogContentText>
                    <Button onClick={() => setDialogOwner(false)}>
                            SAIR
                    </Button>    
                </DialogContent>
            </Dialog>
            <div id="kanbanElement" style={{ display: "flex", justifyContent: "center", height: "100%" }}>
        <DragDropContext 
              onDragEnd={result => onDragEnd(result, columns, setColumns)}
          >
          {Object.entries(columns).map(([columnId, column], index) => {
            return (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center"
                }}
                key={columnId}
              >
                <h2>{column.name}</h2>
                <div style={{ margin: 8 }}>
                  <Droppable droppableId={columnId} key={columnId}>
                    {(provided, snapshot) => {
                      return (
                        <div
                          {...provided.droppableProps}
                          ref={provided.innerRef}
                          style={{
                            background: snapshot.isDraggingOver
                              ? "lightblue"
                              : "lightgrey",
                            padding: 4,
                            width: 250,
                            minHeight: 500
                          }}
                        >
                          {column.items.map((item, index) => {
                            return (
                              <Draggable
                                key={item.id}
                                draggableId={item.id}
                                index={index}
                              >
                                {(provided, snapshot) => {
                                  return (
                                    <div
                                      ref={provided.innerRef}
                                      {...provided.draggableProps}
                                      {...provided.dragHandleProps}
                                      style={{
                                        userSelect: "none",
                                        padding: 16,
                                        margin: "0 0 8px 0",
                                        minHeight: "50px",
                                        backgroundColor: snapshot.isDragging
                                          ? "#263B4A"
                                          : "#456C86",
                                        color: "white",
                                        ...provided.draggableProps.style
                                      }}
                                    >
                                      {item.content}
                                    </div>
                                  );
                                }}
                              </Draggable>
                            );
                          })}
                          {provided.placeholder}
                        </div>
                      );
                    }}
                  </Droppable>
                </div>
              </div>
            );
          })}
        </DragDropContext>
      </div>
        </div>
        
    )

}



