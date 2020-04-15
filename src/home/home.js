import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import '../home/home.css'
import DashboardOutlinedIcon from '@material-ui/icons/DashboardOutlined';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import { getToken, logout } from '../authentication/auth'
import api from '../services/api.js'

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

const token = getToken();

    async function getBoards(){ //paulinho@gmail.com,senha=456456
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

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

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
        
        <Tab icon={<DashboardOutlinedIcon id="boards" />} className={classes.boards} {...a11yProps(1)} />
            
        <Tab onClick={handleLogout} icon={<ExitToAppIcon id="logout" />} className={classes.logout} {...a11yProps(2)} />
      </Tabs>
      <TabPanel value={value} index={0}>
        Profile
      </TabPanel>
      <TabPanel value={value} index={1}>
        Boards
      </TabPanel>
      <TabPanel value={value} index={2}>
        Logout
      </TabPanel>
    </div>
  );
}
