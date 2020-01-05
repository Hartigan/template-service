import React from 'react';
import AppBar from '@material-ui/core/AppBar';
import AuthContent from './components/auth/AuthContent'
import './App.css';
import { Toolbar, Typography, makeStyles } from '@material-ui/core';
import FileTreeView from './components/files/FileTreeView';
import { AuthService } from './services/AuthService';
import { HttpServiceFactory } from './services/HttpServiceFactory';
import { FoldersService } from './services/FoldersService';
import { FileExplorerState } from './states/FileExplorerState';
import { ProblemsService } from './services/ProblemsService';

const useStyles = makeStyles(theme => ({
  offset: theme.mixins.toolbar,
  title: {
    flexGrow: 1,
  }
}));

const authService = new AuthService();
const httpServiceFactory = new HttpServiceFactory(authService);
const foldersService = new FoldersService(httpServiceFactory);
const problemsService = new ProblemsService(httpServiceFactory);
const fileExplorerState = new FileExplorerState(foldersService);

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
            <AuthContent authService={authService} />
          </Toolbar>
        </AppBar>
      </header>
      <FileTreeView
        foldersService={foldersService}
        problemsService={problemsService}
        state={fileExplorerState} />
    </div>
  );
}

export default App;
