import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import IconButton from '@material-ui/core/IconButton';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Paper from '@material-ui/core/Paper';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import { default as DeleteIcon, default as Filled } from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import React from 'react';
import { getId, getToken } from '../authentication/auth';
import { getBoardId, setBoardId } from '../board_content/board_c.js';
import CircularIndeterminate from '../components/loading.js';
import { ListItem_ } from "../components/styles";
import backgrounds from "../enums/backgrounds";
import api from '../services/api.js';
import './board.css';
import { Alert } from '@material-ui/lab';
import Snackbar from '@material-ui/core/Snackbar'

const useStyles = makeStyles((theme) => ({
    root: {

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
    const [editedBoardId, setEditedBoardId] = React.useState(null);
    const [editedBoardName, setEditedBoardName] = React.useState(null);
    const [editedBoardDescription, setEditedBoardDescription] = React.useState(null);
    const [deleteWarning, setDeleteWarning] = React.useState(false);
    const [isOwner, setOwner] = React.useState(false);
    const [addDialog, setAddDialog] = React.useState(false);
    const [newBoardName, setNewBoardName] = React.useState('');
    const [newBoardDesc, setNewBoardDesc] = React.useState('');
    const token = getToken();
    const [backgrounds_data, setBackgrounds] = React.useState(backgrounds);
    const id = getId();
    const [open, setOpen] = React.useState(false);
    const [openError, setOpenError] = React.useState(false);
    const [error, setError] = React.useState('');
    const [successMessage, setSuccessMessage] = React.useState('');

    const setLoadingTrue = () => {
        setLoading(true);
    }

    const handleClose = () => {
        setOpen(false);
        setOpenError(false);
    };

    const setLoadingFalse = () => {
        setLoading(false);
    }

    const setEditTrue = (board) => {
        setEditedBoardId(board.id);

        if (editedBoardName === null)
            setEditedBoardName(board.name);

        if (editedBoardDescription === null)
            setEditedBoardDescription(board.description);

        setOpenEdit(true);
    }

    const setEditFalse = () => {
        setEditedBoardName(null);
        setEditedBoardDescription(null);
        setOpenEdit(false);
    }


    function handleDeleteMessage(board) {
        setBoardId(board.id);
        if (board.owner.id.toString() === id.toString()) {
            setOwner(true);
        }
        else {
            setOwner(false);
        }
        setDeleteWarning(true);
    }

    function addBoard() {
        setLoadingTrue();
        api.post("/boards",
            {
                name: newBoardName,
                description: newBoardDesc
            },
            {
                headers: {
                    Authorization: token
                }
            }).then(res => {
                if (getBoards()) {
                    setSuccessMessage(`Quadro ${newBoardName} criado com sucesso!`)
                    setOpen(true);
                    setLoadingFalse();
                }
            }).catch(err => {
                setError(err.response.data.errors[0].defaultMessage);
                setOpenError(true);
            })
        setAddDialog(false);
        getBoards();
        setLoadingFalse();
    }

    function closeAddDialog() {
        setAddDialog(false);
    }

    async function handleDelete(board) {
        setLoadingTrue();
        var id = getBoardId();

        if (!isOwner) {
            await api.put('boards/' + id + '/leave', {}, {
                headers: {
                    Authorization: token
                }
            }).then(res => {
                setSuccessMessage(`Você saiu do quadro ID: ${id}`)
                setOpen(true);
            }).catch(err => {
                setError(err.response.data.errors[0].defaultMessage);
                setOpenError(true);
            })
        }
        else {
            await api.delete("boards/" + id,
                {
                    headers: {
                        Authorization: token
                    }
                }).then(res => {
                    if (getBoards()) {
                        setLoadingFalse();
                        setSuccessMessage(`Quadro ${board.name} excluído com sucesso!`)
                        setOpen(true);
                    }
                }).catch(err => {
                    setError(err.response.data.errors[0].defaultMessage);
                    setOpenError(true);
                })
        }

        getBoards();
        setDeleteWarning(false);
    }

    function handleAddIcon() {
        setAddDialog(true);
    }
    function handleEditCloseAndSend(board) {
        if (openEdit) {
            setLoadingTrue();
            api.put('/boards/' + editedBoardId,
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
                    setSuccessMessage(`Quadro ${editedBoardName} editado com sucesso!`)
                    setOpen(true);
                })
                .catch(err => {
                    setLoadingFalse();
                    setError(err.response.data.errors[0].defaultMessage);
                    setOpenError(true);
                });
        }
    }

    function getBackgroundId(board_background) {
        let board_b = "";
        if (board_background.length === 3) {
            board_b = board_background[1] + board_background[2];
        }
        else {
            board_b = board_background[1];
        }
        return board_b;
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
            {loading ? <div class="board-is-loading">
                <CircularIndeterminate />
            </div> :
                <div id="boardsInstance">
                    <div className="row">
                        <div>
                            <Paper elevation={24}>
                                <h2>
                                    Meus quadros
                                </h2>
                            </Paper>
                        </div>
                        <div>
                            <Button id="add-button" onClick={handleAddIcon}>
                                Adicionar
                            <AddCircleIcon id="addIcon"></AddCircleIcon>
                            </Button>
                        </div>
                    </div>
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
                    <div className="listContainer">
                        {boards.totalElements > 0 ?
                            <List component="nav" aria-label="main mailbox folders" className="list">
                                {boards.content.map((board) =>
                                    <ListItem className="item">
                                        <ListItem_ background={backgrounds_data[getBackgroundId(board.background)].content}>
                                            <ListItemLink href={"/boards/" + board.id}>
                                                <ListItemText primary="" className="title" />
                                                <div className="boardDescription" >

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
                                                        onClick={() => setEditTrue(board)}>
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
                                        </ListItem_>
                                        <Dialog open={openEdit} aria-labelledby="form-dialog-title">
                                            <DialogContent>
                                                <DialogContentText id="editBoardDialog">
                                                    EDITAR SEU QUADRO
                                        </DialogContentText>
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

                                    </ListItem>)}
                            </List> : <Alert id="no-boards-alert" variant="filled" severity="info">Você não participa de quadros. Crie um clicando em "Adicionar".</Alert>
                        }
                    </div>
                </div>
            }
            <Snackbar open={open} onClose={handleClose}>
                <Alert onClose={handleClose} severity="success">
                    {successMessage}
                </Alert>
            </Snackbar>
            <Snackbar open={openError} autoHideDuration={6000} onClose={handleClose}>
                <Alert onClose={handleClose} severity="error">
                    {error}
                </Alert>
            </Snackbar>
        </div >
    )
}