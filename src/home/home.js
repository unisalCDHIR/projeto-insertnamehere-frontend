import React from 'react';
import DashboardOutlinedIcon from '@material-ui/icons/DashboardOutlined';
import PermIdentityOutlinedIcon from '@material-ui/icons/PermIdentityOutlined';
import api from '../services/api.js'
import './home.css'
import { getToken, logout } from '../authentication/auth'
import ExitToAppIcon from '@material-ui/icons/ExitToApp';


export default function Home(){

    const token = getToken();

    async function getBoards(){
        await api.get('/boards',{
            headers: {
              Authorization: token  //the token is a variable which holds the token
            }
           }).then(res => {
            console.log(res.data);
          })
          .catch(err => {
            console.log(err);
          });
    }

    function handleLogout(){
        logout();
        window.location = '/login'
    }

    getBoards();

    return (
        <nav>
            <ul className="nav-links">
                <li>
                    <PermIdentityOutlinedIcon id="profile"/> 
                </li>
                <li>
                    <DashboardOutlinedIcon id="Cards"/>
                </li>
                <li>
                    <ExitToAppIcon 
                    id="Logout"
                    onClick={handleLogout}
                    />
                </li>
            </ul>



        </nav>
    );
}