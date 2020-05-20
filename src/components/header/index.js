import React from 'react';

import { Container } from './styles';

import ExitToAppIcon from '@material-ui/icons/ExitToApp';

import HomeIcon from '@material-ui/icons/Home';

import "../header/styles.css"

import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';

import PeopleAltIcon from '@material-ui/icons/PeopleAlt';

export default function Header({board_name, board_description, board_users, board_owner, board_owner_email}){

    const [openLogout, setOpenLogout] = React.useState(false);
    const [openPeople, setOpenPeople] = React.useState(false);

    function handleCloseLogout(){
        setOpenLogout(false);
    }

    function handleCloseAndLogout(){
        localStorage.removeItem("TOKEN_KEY");
        localStorage.removeItem("ID_KEY");
        setOpenLogout(false);
        window.location = '/login';
    }

    return (

        <>
        <Container>
            <h1> CDHI - Quadros Organizacionais</h1>

            <PeopleAltIcon onClick={() => setOpenPeople(true)} id="peopleIcon"/>

            <ExitToAppIcon onClick={() => setOpenLogout(true)} id="logoutIcon"/>

            <Dialog open={openLogout} aria-labelledby="form-dialog-title">
            <DialogContent>
                 <DialogContentText>
                    Deseja mesmo fazer logout?
                </DialogContentText>
            </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseLogout} color="primary">
            Não
          </Button>
          <Button onClick={handleCloseAndLogout} color="primary">
            Sim
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={openPeople} aria-labelledby="form-dialog-title">
            <DialogContent>
            <DialogContentText><strong id="boardTitle" >PESSOAS DO QUADRO</strong></DialogContentText>
                {board_users.map(user => <> 
                    <DialogContentText>
                    <strong>Nº de usuários: </strong>{board_users.length}
                    </DialogContentText>
                    <DialogContentText>
                    <strong>Nome do usuário: </strong> {user.name}</DialogContentText>
                    <DialogContentText>
                    <strong>Email do usuário: </strong> {user.email}  
                    </DialogContentText></>)}
            </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenPeople(false)} color="primary">
            FECHAR
          </Button>
        </DialogActions>
      </Dialog>

           
        </Container>
        </>
    );
}