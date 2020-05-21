import styled, {css} from 'styled-components';
//import img from '../snow_mountain.jpg'

export const Container = styled.div`

    display: flex;
    padding: 30px 0;
    height: 100vh;

   background: url(${props => props.background}) no-repeat;
   background-size: cover;

    

`;

