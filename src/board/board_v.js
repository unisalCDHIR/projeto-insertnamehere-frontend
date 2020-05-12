import React from 'react';
import HomeIcon from '@material-ui/icons/Home';
import './board_v.css';
import api from '../services/api'
import { getId, getToken, logout } from '../authentication/auth';
import PeopleIcon from '@material-ui/icons/People';
import Logo from '../assets/img/Logo.png';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';


export default function Board () {

    function getBoardId(){
        var info = window.location.href.split('/');
        return info[4];
    }
    
    
    function goToHome(){
        window.location = '/home';
    }

    function goToPeople(){

    }

    function Logout(){
        logout();
        window.location = '/login'
    }
    
    const [breakEl, setBreakEl] = React.useState(false);
    const [boardName, setBoardName] = React.useState('');
    const [boardDesc, setBoardDesc] = React.useState('');
    const [boardCards, setBoardCards] = React.useState('');
    const [boardUsers, setBoardUsers] = React.useState('');
    const [boardOwner, setBoardOwner] = React.useState('');
    const [boardPeople, setPeople] = React.useState(false);
    
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
            setBoardOwner(res.data.owner);
        })
            .catch(err => {
               
        });
    }
    
    if (!breakEl)
    {
        getBoardById();
    }

    return (
        <div id="header">
            <div id="boardButtons">
                <HomeIcon id="homeIcon" onClick={goToHome} style={{fontSize:40}}/> <PeopleIcon id="peopleIcon" onClick={goToPeople} style={{fontSize:40}}/><img id="Logo" src={Logo} height="42" width="42" /> 
                <strong>- Quadros Organizacionais</strong>
                <ExitToAppIcon onClick={Logout} id="logout" />
            </div>
            
            <div id="boardInfo">
                <h3>Quadro: "{boardName}" </h3>
                <h3>Descrição: "{boardDesc}" </h3>
            </div>


        </div>
    )

}



