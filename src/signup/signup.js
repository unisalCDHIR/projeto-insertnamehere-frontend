import React from 'react';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import Link from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import Logo from '../assets/img/Logo.png';
import './signup.css';
import api from '../services/api';
import Snackbar from '@material-ui/core/Snackbar'
import { Alert } from '@material-ui/lab';


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

const useStyles = makeStyles(theme => ({
  paper: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(3),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

export default function SignUp() {
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);
  const [openError, setOpenError] = React.useState(false);
  const [openEmailError, setOpenEmailError] = React.useState(false);
  const [error, setError] = React.useState('');
  const [name, setName] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [cpassword, setcPassword] = React.useState('');

  async function handleSubmit(event){

    event.preventDefault();

    if(password.toString() === cpassword.toString()){

      await api.post('/users',{
        email: email,
        name: name,
        password: password
      }).then(res => {
        console.log(res.status);
        if(res.status.toString() === "201"){
          setOpen(true);
          window.location = "/login" 
        }
        
      })
      .catch(err => {
        setOpenEmailError(true);
        setError(err.response.data.errors[0].defaultMessage);
      });

    }
    else{
      setOpenError(true);
    }
  }

  const handleClose = () => {
    setOpen(false);
  };

  const handleCloseError = () =>{ 
    setOpenError(false);
  };

  const handleCloseEmailError = () =>{
    setOpenEmailError(false);
  }

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        <img alt="Logo" src={Logo} style={{ width: 150, height: 150, display: 'block', margin: 'auto', position: 'relative' }} />
        <form className={classes.form} noValidate>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                autoComplete="name"
                name="name"
                variant="outlined"
                required
                fullWidth
                id="name"
                value={name}
                label="Nome completo"
                autoFocus
                onChange={event => setName(event.target.value)}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                variant="outlined"
                required
                fullWidth
                id="email"
                label="Email"
                name="email"
                value={email}
                autoComplete="email"
                onChange={event => setEmail(event.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                variant="outlined"
                required
                fullWidth
                name="password"
                label="Senha"
                type="password"
                id="password"
                value={password}
                autoComplete="password"
                onChange={event => setPassword(event.target.value)}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                variant="outlined"
                required
                fullWidth
                name="cPassword"
                label="Confirme sua senha"
                type="password"
                id="cPassword"
                value={cpassword}
                autoComplete="cPassword"
                onChange={event => setcPassword(event.target.value)}
              />
            </Grid>

          </Grid>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
            onClick={handleSubmit}
          >
            Registrar
          </Button>
          <Grid container>
            <Grid item id="login">
              <Button size="small" color="primary" className={classes.margin}>
                <Link href="/login" variant="body2">
                  Ja tem uma conta? Faça o Login
              </Link>
              </Button>
            </Grid>
          </Grid>
        </form>
      </div>
      <Box mt={5}>
        <Copyright />
      </Box>
      <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
        <Alert onClose={handleClose} severity="success">
            Conta criada com sucesso
        </Alert>
      </Snackbar>
      <Snackbar open={openError} autoHideDuration={6000} onClose={handleCloseError}>
        <Alert onClose={handleClose} severity="error">
            Senhas não coincidem
        </Alert>
      </Snackbar>
      <Snackbar open={openEmailError} autoHideDuration={6000} onClose={handleCloseEmailError}>
        <Alert onClose={handleClose} severity="error">
          {error}
        </Alert>
      </Snackbar>
    </Container>
  );
}