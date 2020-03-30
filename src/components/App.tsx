import React from 'react';
import { Provider } from 'react-redux';
import { Router, Switch, Route } from 'react-router-dom';
import { createBrowserHistory } from 'history';
import { Page } from '@patternfly/react-core';
import { store } from '../store';
import Header from './ui/Header';
import Sidebar from './Sidebar';
import BackgroundImage from './ui/BackgroundImage';
import LoginForm from './login/LoginForm';
import Clusters from './clusters/Clusters';
import BaremetalInventory from './BaremetalInventory';

import '../styles/index.css';

const App: React.FC = () => (
  <Provider store={store}>
    <Router history={createBrowserHistory()}>
      <BackgroundImage />
      <Page
        header={<Header />}
        sidebar={<Sidebar />}
        style={{ height: '100vh', background: 'transparent' }}
        isManagedSidebar // enable this to automatically hide sidebar in mobile
      >
        <Switch>
          <Route path="/clusters">
            <Clusters />
          </Route>
          <Route path="/baremetal-inventory">
            <BaremetalInventory />
          </Route>
          <Route path="/">
            <LoginForm />
          </Route>
        </Switch>
      </Page>
    </Router>
  </Provider>
);
export default App;
