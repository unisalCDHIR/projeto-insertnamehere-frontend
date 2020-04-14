import React from 'react';
import DashboardOutlinedIcon from '@material-ui/icons/DashboardOutlined';
import PermIdentityOutlinedIcon from '@material-ui/icons/PermIdentityOutlined';
import api from '../services/api.js'
import './home.css'


export default function Home(){

    async function getBoards(){
        await api.get('/boards',{
            headers: {
              Authorization: 'Bearer eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJjYWlvbW9sb25pOTlAZ21haWwuY29tIiwiZXhwIjoxNTg2MzY1NzI4fQ.TmApfL3JtJG2qFU9vyyx_3LuMSlbf87giV8J9Y3WYLpIET3zKeysRXRXHnHM9P_yOD9Z6_4J5m9klMi9qJX7rA'  //the token is a variable which holds the token
            }
           }).then(res => {
            console.log(res.data);
          })
          .catch(err => {
            console.log(err);
          });
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
            </ul>



        </nav>
    );
}