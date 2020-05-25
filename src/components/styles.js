import styled, {css} from 'styled-components';
//import img from '../snow_mountain.jpg'

export const ListItem_ = styled.div`

    background: url(${props => props.background}) no-repeat;
    background-size: cover;
    box-shadow: 0 5px 15px rgba(0,0,0,.5);
    position: relative;
    overflow: hidden;
    color: #000;
    margin: 8px;
   

`;