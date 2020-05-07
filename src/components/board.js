import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import { makeStyles } from '@material-ui/core/styles';
import React, { useState, useEffect } from 'react';
import { getToken, getId } from '../authentication/auth';
import api from '../services/api.js';
import './board.css';
import CircularIndeterminate from '../components/loading.js'
import AddCircleIcon from '@material-ui/icons/AddCircle';
import DeleteIcon from '@material-ui/icons/Delete';
import IconButton from '@material-ui/core/IconButton';
import EditIcon from '@material-ui/icons/Edit';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Filled from '@material-ui/icons/Delete';
import { getBoardId, setBoardId } from '../board_content/board_c.js'

const useStyles = makeStyles((theme) => ({
    root: {
        display: "flex",
        flexWrap: "wrap",
        width: '100%',
        maxWidth: 360,
        margin: 5,
        backgroundColor: theme.palette.background.paper,
        display: 'flex',
    },
}));

function ListItemLink(props) {
    return <ListItem button component="a" {...props} />;
}

export default function Boards() {
    const classess = useStyles();

    const [openEdit, setOpenEdit] = React.useState(false);
    const [loading, setLoading] = React.useState(false);
    const [boards, setBoards] = React.useState('');
    const [breakEl, setBreakEl] = React.useState(false);
    const [editedBoardName, setEditedBoardName] = React.useState(null);
    const [editedBoardDescription, setEditedBoardDescription] = React.useState(null);
    const [deleteWarning, setDeleteWarning] = React.useState(false);
    const [isOwner, setOwner] = React.useState(false);
    const [addDialog, setAddDialog] = React.useState(false);
    const [newBoardName, setNewBoardName] = React.useState('');
    const [newBoardDesc, setNewBoardDesc] = React.useState('');
    const token = getToken();
    const id = getId();

    const setLoadingTrue = () => {
        setLoading(true);
    }

    const setLoadingFalse = () => {
        setLoading(false);
    }

    const setEditTrue = () => {
        setOpenEdit(true);
    }

    const setEditFalse = () => {
        setEditedBoardName(null);
        setEditedBoardDescription(null);
        setOpenEdit(false);
    }


    function handleDeleteMessage(board){
        setBoardId(board.id);
        if(board.owner.id.toString() === id.toString()){
            setOwner(true);
        }
        else{
            setOwner(false);
        }
        setDeleteWarning(true);
    }

    function addBoard(){
        setLoadingTrue();
        api.post("/boards",
        {
            name: newBoardName,
            description: newBoardDesc
        }, 
        {
            headers:{
                Authorization: token
            }
        }).then(res =>{
            if(getBoards()){
                setLoadingFalse();
            }
        }).catch(err =>{

        })
        setAddDialog(false);
        getBoards();
        setLoadingFalse();
    }

    function closeAddDialog(){
        setAddDialog(false);
    }

    async function handleDelete(board){
        setLoadingTrue();
        var id = getBoardId();
    
        if(!isOwner){
            await api.put('boards/'  + id + '/leave',{},{
                headers:{
                    Authorization: token
                }
            }).then(res =>{
                
            }).catch(err =>{
                	console.log(err);
            })
        }
        else{
            await api.delete("boards/" + id, 
            {
                headers:{
                    Authorization: token
                }
            }).then(res =>{
                if(getBoards()){
                    setLoadingFalse();
                }
            }).catch(err =>{
            
            })
        }
       
        getBoards();
        setDeleteWarning(false);
    }

    function handleAddIcon(){
        setAddDialog(true);
    }
    function handleEditCloseAndSend(board ) {
        if (openEdit) {
            setLoadingTrue();
            api.put('/boards/' + board.id,
                {
                    name: editedBoardName,
                    description: editedBoardDescription
                },
                {
                    headers: {
                        Authorization: token  //the token is a variable which holds the token
                    }
                }).then(res => {
                    setLoadingFalse();
                    setEditFalse();
                    getBoards();
                })
                .catch(err => {                  
                    setLoadingFalse()
                });
        }
    }

    async function getBoards() { //paulinho@gmail.com,senha=456456
        setLoadingTrue();
        setBreakEl(true);
        await api.get('/boards', {
            headers: {
                Authorization: token  //the token is a variable which holds the token
            },
            params: {
                size: 9999,
                page: 0
            }
        }).then(res => {
            setBoards(res.data);
            // res.data.content.forEach(element => {
            //     arr.push(element);
            // });
            setLoadingFalse();
        })
            .catch(err => {
                setBoards(err.data);
                setLoadingFalse()
            });
    }

    if (!breakEl) {
        getBoards();
    }
    const classes = useStyles();
    return (
        <div className={classess.root}>
            {loading ? <CircularIndeterminate /> :
                <div>
                    <Button onClick={handleAddIcon}>
                    Adicionar 
                    <AddCircleIcon id="addIcon">
                        
                    </AddCircleIcon>
                    </Button>
                    
                    <Dialog open={addDialog}>
                        <DialogContent>
                        <DialogContentText id="addBoardTitle">
                            ADICIONAR UM NOVO QUADRO
                        </DialogContentText>

                        <DialogContentText>
                            Nome: <TextField 
                            id="txtBoardName"
                            onChange={event => setNewBoardName(event.target.value)}
                            ></TextField>
                        </DialogContentText>
                        <DialogContentText>
                            Descrição: <TextField 
                            id="txtDescription"
                            onChange={event => setNewBoardDesc(event.target.value)}
                            ></TextField>
                        </DialogContentText>

                        <div id="buttonsAddDialog">
                        <Button onClick={() => addBoard()}> Adicionar 
                        <AddCircleIcon id="addIcon">
                        
                        </AddCircleIcon></Button>

                        <Button onClick={() => closeAddDialog()}> Fechar 
                        <Filled id="closeIcon">
                        
                        </Filled></Button>

                        </div>

                        </DialogContent>  
                    </Dialog>
                    <div>
                    <List component="nav" aria-label="main mailbox folders" className="list">
                        {boards ? boards.content.map((board) =>
                            <ListItem className="item">
                                <ListItemLink href={"/boards/" + board.id}>
                                    <ListItemText primary="" className="title" />
                                    <div className="boardDescription">

                                        <strong>Nome: </strong> {board.name}
                                        <br />
                                        <strong>Descrição: </strong>{board.description}
                                        <br />
                                        <strong>Criador do Quadro: </strong>{board.owner.name}
                                    </div>
                                </ListItemLink>
                                <div className="actions">
                                    {
                                        Number(id) === board.owner.id ? <IconButton
                                            variant="contained"
                                            color="primary"
                                            aria-label="edit"
                                            className="editButton"
                                            onClick={setEditTrue}>
                                            <EditIcon />
                                        </IconButton> : null
                                    }

                                    <IconButton
                                        variant="contained"
                                        color="secondary"
                                        aria-label="delete"
                                        className="deleteButton"
                                        onClick={() => handleDeleteMessage(board)}
                                        >
                                        <DeleteIcon />
                                    </IconButton>

                                </div>

                                <Dialog open={openEdit} aria-labelledby="form-dialog-title">
                                    <DialogContent>
                                        <DialogContentText id="editBoardDialog">
                                            EDITAR SEU QUADRO
                                        </DialogContentText>
                                        {editedBoardName === null ? setEditedBoardName(board.name) : null}
                                        {editedBoardDescription === null ? setEditedBoardDescription(board.description) : null}
                                        <TextField
                                            autoFocus
                                            margin="dense"
                                            id={board.name}
                                            label="Nome"
                                            type="text"
                                            fullWidth
                                            onChange={event => setEditedBoardName(event.target.value)}
                                            value={editedBoardName}
                                        />
                                        <TextField
                                            autoFocus
                                            margin="dense"
                                            multiline
                                            rows={6}
                                            id={board.description}
                                            label="Descrição"
                                            type="text"
                                            fullWidth
                                            onChange={event => setEditedBoardDescription(event.target.value)}
                                            value={editedBoardDescription}
                                        />
                                    </DialogContent>
                                    <DialogActions>
                                        <Button onClick={setEditFalse} color="primary">
                                            Cancelar
                                        </Button>
                                        <Button onClick={() => handleEditCloseAndSend(board)} color="primary">
                                            Salvar
                                        </Button>
                                    </DialogActions>
                                </Dialog>
                                <Dialog open={deleteWarning && isOwner}>
                                    <DialogContent >
                                    <DialogContentText>
                                            Você é o dono deste quadro, se decidir sair do mesmo, todos os dados serão apagados.
                                            Tem certeza?
                                            </DialogContentText>
                                        <Button onClick={() => handleDelete(board)}>
                                                SIM
                                            </Button>
                                        <Button onClick={() => setDeleteWarning(false)}>
                                                NÃO
                                            </Button>
                                        </DialogContent>    
                                </Dialog>
                                <Dialog open={deleteWarning && !isOwner}>
                                    <DialogContent >
                                        <DialogContentText>
                                            Deseja mesmo sair deste quadro?
                                            </DialogContentText>
                                            <Button onClick={() => handleDelete(board)}>
                                                SIM
                                            </Button>
                                            <Button onClick={() => setDeleteWarning(false)}>
                                                NÃO
                                            </Button>
                                        </DialogContent>
                                    </Dialog>
                                
                            </ListItem>
                        ) : null}
                    </List>
                    </div>
                </div>
            }

        </div>
    )
}