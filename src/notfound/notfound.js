import React from 'react';
import { Link } from 'react-router-dom';
import PageNotFound from '../assets/img/PageNotFound.png';
import { GiHouse } from 'react-icons/gi';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import Container from '@material-ui/core/Container';

function Copyright() {
    return (
        <Typography variant="body2" color="textSecondary" align="center">
            {'Copyright © '}
            CDHI
        {' '}
            {new Date().getFullYear()}
            {'.'}
        </Typography>
    );
}

const NotFound = () => (
    <Container>
    <div>
        <img alt="NotFound" src={PageNotFound} style={{ width: 400, height: 400, display: 'block', margin: 'auto',paddingTop:'81px', position: 'relative' }} />
        <center><Link to="/signin"><GiHouse /> Voltar para home</Link></center>
        <Box mt={8}>
            <Copyright />
        </Box>
        
    </div>
    </Container>
);
export default NotFound;