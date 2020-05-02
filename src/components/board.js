import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import { makeStyles } from '@material-ui/core/styles';
import React from 'react';
import { getToken } from '../authentication/auth';
import api from '../services/api.js';
import './board.css';
import CircularIndeterminate from '../components/loading.js'

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

    const [loading, setLoading] = React.useState(false);
    const [boards, setBoards] = React.useState('');
    const [breakEl, setBreakEl] = React.useState(false);
    const token = getToken();

    const setLoadingTrue = () => {
        setLoading(true);
      }
    
      const setLoadingFalse = () => {
        setLoading(false);
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
                <List component="nav" aria-label="main mailbox folders" className="list">
                    {boards ? boards.content.map((board) =>
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
                    ) : null}
                </List>
            }
        </div>
    )
}