import React from 'react';
import { Provider } from 'react-redux';
import { Router, Switch, Route, Redirect } from 'react-router-dom';
import { createBrowserHistory } from 'history';
import { Page } from '@patternfly/react-core';
import { store } from '../store';
import Header from './ui/Header';
import Sidebar from './Sidebar';
import BackgroundImage from './ui/BackgroundImage';
import LoginForm from './login/LoginForm';
import Clusters from './clusters/Clusters';
import NewCluster from './clusters/NewCluster';
import ClusterPage from './clusters/ClusterPage';

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
        defaultManagedSidebarIsOpen={false}
      >
        <Switch>
          <Route path="/clusters/new" component={NewCluster} />
          <Route path={`/clusters/:clusterId`} component={ClusterPage} />
          <Route path="/clusters" component={Clusters} />
          <Route path="/login" component={LoginForm} />
          <Redirect to="/clusters" />
        </Switch>
      </Page>
    </Router>
  </Provider>
);
export default App;
