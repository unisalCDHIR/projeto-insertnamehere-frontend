import React from 'react';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Link from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import Logo from '../assets/img/Logo.png';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import './signin.css';
import api from '../services/api'
import CircularIndeterminate from '../components/loading.js'
import { login, getToken } from '../authentication/auth'

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

let loading = false;

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
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));



export default function SignIn() {
  const classes = useStyles();

  const [open, setOpen] = React.useState(false);
  const [email, setEmail] = React.useState('');
  const [pwd, setPwd] = React.useState('');
  const [newpwdEmail, setnewpwdEmail] = React.useState('');
  const [loading, setLoading] = React.useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setLoadingTrue();
    await api.post('/login', {
      email: email,
      password: pwd
    }).then(res => {
      login(res.headers['authorization']);
      console.log(getToken());
      window.location = "/home";
    })
      .catch(err => {
        document.getElementById("error").textContent = "* " + err.response.data.message + " *";
        document.getElementById("error").style.visibility = "visible";
        console.log(err.response.data);
        setLoadingFalse();
      });

  }

  const handleClickOpen = () => {
    setOpen(true);
  };

  const setLoadingTrue = () => {
    setLoading(true);
  }

  const setLoadingFalse = () => {
    setLoading(false);
  }

  const handleClose = () => {
    setOpen(false);
  };

  function handleCloseAndSend() {
    setOpen(false);
    api.post('/auth/forgot', {
      email: newpwdEmail
    });
  };

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        <img alt="Logo" src={Logo} style={{ width: 150, height: 150, display: 'block', margin: 'auto', position: 'relative' }} />
        <form className={classes.form} noValidate>
          <TextField
            type="email"
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email"
            name="email"
            autoComplete="email"
            autoFocus
            value={email}
            onChange={event => setEmail(event.target.value)}
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            name="password"
            label="Senha"
            type="password"
            id="password"
            autoComplete="current-password"
            value={pwd}
            onChange={event => setPwd(event.target.value)}
          />
          <Grid
            id="error"
            color="red"
          >

          </Grid>

          <FormControlLabel
            control={<Checkbox value="remember" color="primary" />}
            label="Lembrar senha"
          />
          <Button 
            id="loginButton"
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? <CircularIndeterminate /> : 'Login'}
          </Button>

          <Grid xs={12} container>
            <Grid item xs={6} id="forgot">
              <Button size="small" color="primary" onClick={handleClickOpen}>
                Esqueci minha senha</Button>
            </Grid>

            <Grid item xs={6} id="register">
              <Button size="small" color="primary" className={classes.margin}><Link href="/register" variant="body2">
                {"Registre-se"}
              </Link></Button>
            </Grid>
          </Grid>
        </form>
      </div>
      <Box mt={8}>
        <Copyright />
      </Box>

      <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
        <DialogContent>
          <DialogContentText>
            Informe seu Email para redefinir a senha
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="Email"
            type="email"
            fullWidth
            value={newpwdEmail}
            onChange={event => setnewpwdEmail(event.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Fechar
          </Button>
          <Button onClick={handleCloseAndSend} color="primary">
            Enviar
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}
