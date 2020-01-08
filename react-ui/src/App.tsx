import React from 'react';
import AppBar from '@material-ui/core/AppBar';
import AuthContent from './components/auth/AuthContent'
import './App.css';
import { Toolbar, Typography, makeStyles, Container, Grid } from '@material-ui/core';
import FileTreeView from './components/files/FileTreeView';
import { AuthService } from './services/AuthService';
import { HttpServiceFactory } from './services/HttpServiceFactory';
import { FoldersService } from './services/FoldersService';
import { FileExplorerState } from './states/FileExplorerState';
import { ProblemsService } from './services/ProblemsService';
import FilePreview from './components/files/FilePreview';
import { VersionService } from './services/VersionService';
import { ProblemSetService } from './services/ProblemSetService';

const useStyles = makeStyles(theme => ({
  offset: theme.mixins.toolbar,
  title: {
    flexGrow: 1,
  },
  tab: {
    width: "100%"
  },
  tree: {
    width: "30%",
  },
  content: {
    width: "70%",
  },
}));

const authService = new AuthService();
const httpServiceFactory = new HttpServiceFactory(authService);
const versionService = new VersionService(httpServiceFactory);
const foldersService = new FoldersService(httpServiceFactory);
const problemsService = new ProblemsService(httpServiceFactory);
const problemSetService = new ProblemSetService(httpServiceFactory);
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
      <Container className={classes.tab}>
        <Grid container>
          <Grid item className={classes.tree}>
            <FileTreeView
              versionService={versionService}
              foldersService={foldersService}
              problemsService={problemsService}
              problemSetService={problemSetService}
              state={fileExplorerState} />
          </Grid>
          <Grid item className={classes.content}>
            <FilePreview
              fileExplorerState={fileExplorerState}
              problemsService={problemsService}
              versionService={versionService} />
          </Grid>
        </Grid>
      </Container>
      
    </div>
  );
}

export default App;
