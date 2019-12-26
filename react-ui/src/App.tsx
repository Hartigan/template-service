import React from 'react';
import AppBar from '@material-ui/core/AppBar';
import AuthContent from './components/auth/AuthContent'
import './App.css';
import { Toolbar, Typography, makeStyles } from '@material-ui/core';

const useStyles = makeStyles(theme => ({
  offset: theme.mixins.toolbar,
  title: {
    flexGrow: 1,
  }
}));

const App: React.FC = () => {
  const classes = useStyles();
  return (
    <div className="App">
      <header>
        <AppBar position="static">
          <Toolbar>
            <Typography variant="h6" className={classes.title}>
              Testing service
            </Typography>
            <AuthContent />
          </Toolbar>
        </AppBar>
      </header>
    </div>
  );
}

export default App;
