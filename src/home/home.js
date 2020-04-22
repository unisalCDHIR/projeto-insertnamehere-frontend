import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import '../home/home.css'
import DashboardOutlinedIcon from '@material-ui/icons/DashboardOutlined';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import { getId, getToken, logout } from '../authentication/auth'
import api from '../services/api.js'
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import { HasBoards, GetBoards, SetBoards } from '../board_content/board_c'
import Profile from '../account/account.js'

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <Typography
      component="div"
      role="tabpanel"
      hidden={value !== index}
      id={`vertical-tabpanel-${index}`}
      aria-labelledby={`vertical-tab-${index}`}
      {...other}
    >
      {value === index && <Box p={3}>{children}</Box>}
    </Typography>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
};

function a11yProps(index) {
  return {
    id: `vertical-tab-${index}`,
    'aria-controls': `vertical-tabpanel-${index}`,
  };
}

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.paper,
    display: 'flex',
    height: '100vh',
  },
  tabs: {
    borderRight: `1px solid ${theme.palette.divider}`,
  },
  profile: {
    width:100,
    height:100,
  },
  boards: {
    width:100,
    height:100,
  },
  logout:{
    width:100,
    height:100,
  },
}));


export default function VerticalTabs() {

  const classes = useStyles();
  const [value, setValue] = React.useState(0);
  const [open, setOpen] = React.useState(false);
  const [boards, setBoards] = React.useState('');

  const token = getToken();
  const id = getId();

  async function getBoards(){ //paulinho@gmail.com,senha=456456
    await api.get('/boards',{
        headers: {
          Authorization: token  //the token is a variable which holds the token
          }
        }).then(res => {
          setBoards(res.data);
        })
        .catch(err => {
          setBoards(err.data);
        });
  }

  // setInterval(() => {
  //   getBoards();
  // }, 5000);
  
  SetBoards(boards.content);

  const handleClose = () => {
    setOpen(false);
  };

  function handleCloseAndLogout(){
    logout();
    window.location = '/login'
  }

  function handleLogout(){
    setOpen(true);
  }

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  async function handleBoards(){
    await getBoards();
    console.log(boards.content);
  }

  return (
    <div className={classes.root}>
      <Tabs
        orientation="vertical"
        variant="scrollable"
        value={value}
        onChange={handleChange}
        aria-label="Vertical tabs example"
        className={classes.tabs}
        indicatorColor="primary"
      >
        <Tab icon={<AccountCircleIcon id="profile"/>} className={classes.profile} {...a11yProps(0)} />
        
        <Tab onClick={handleBoards} icon={<DashboardOutlinedIcon id="boards" />} className={classes.boards} {...a11yProps(1)} />
            
        <Tab onClick={handleLogout} icon={<ExitToAppIcon id="logout" />} className={classes.logout} {...a11yProps(2)} />
      </Tabs>

      <TabPanel value={value} index={0}>
        <Profile />
      </TabPanel>

      <TabPanel value={value} index={1}>
        {}
      </TabPanel>

      <TabPanel value={value} index={2}>
      </TabPanel>
      <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
        <DialogContent>
          <DialogContentText>
            Deseja mesmo fazer logout?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Não
          </Button>
          <Button onClick={handleCloseAndLogout} color="primary">
            Sim
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
