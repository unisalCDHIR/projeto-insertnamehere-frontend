import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import { makeStyles } from '@material-ui/core/styles';
import Tab from '@material-ui/core/Tab';
import Tabs from '@material-ui/core/Tabs';
import Typography from '@material-ui/core/Typography';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import DashboardOutlinedIcon from '@material-ui/icons/DashboardOutlined';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import PropTypes from 'prop-types';
import React from 'react';
import Profile from '../account/account.js';
import { getId, getToken, logout } from '../authentication/auth';
import Boards from '../components/board';
import '../home/home.css';

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
  const [value, setValue] = React.useState(1);
  const [open, setOpen] = React.useState(false);

  // setInterval(() => {
  //   getBoards();
  // }, 5000);

  const handleClose = () => {
    setOpen(false);
    document.getElementsByClassName("MuiTab-wrapper")[1].click();
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


  return (
    <div className={classes.root}>
      <Tabs
        orientation="vertical"
        variant="scrollable"
        value={value}
        initialSelectedIndex={value}
        onChange={handleChange}
        aria-label="Vertical tabs example"
        className={classes.tabs}
        indicatorColor="primary"
        id="homeTabs"
      >
        <Tab id="profile" icon={<AccountCircleIcon id="profile"/>} className={classes.profile} {...a11yProps(0)} />
        
        <Tab id="boards" icon={<DashboardOutlinedIcon id="boards" />} className={classes.boards} {...a11yProps(1)} />
            
        <Tab id="logout" onClick={handleLogout} icon={<ExitToAppIcon id="logout" />} className={classes.logout} {...a11yProps(2)} />
      </Tabs>

      <TabPanel value={value} index={0}>
        <Profile />
      </TabPanel>

      <TabPanel value={value} index={1}>
        <Boards />
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
