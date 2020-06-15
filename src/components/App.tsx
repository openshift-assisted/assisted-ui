import React from 'react';
import { Provider } from 'react-redux';
import { Router, Switch, Route, Redirect } from 'react-router-dom';
import { Page } from '@patternfly/react-core';
import { store, Clusters, ClusterPage } from 'facet-lib';
import history from '../history';
import Header from './ui/Header';
// import Sidebar from './Sidebar';
import BackgroundImage from './ui/BackgroundImage';
import LoginForm from './login/LoginForm';

import '../styles/index.css';

const App: React.FC = () => (
  <Provider store={store}>
    <Router history={history}>
      <BackgroundImage />
      <Page
        header={<Header />}
        // sidebar={<Sidebar />}
        style={{ height: '100vh', background: 'transparent' }}
        isManagedSidebar // enable this to automatically hide sidebar in mobile
        defaultManagedSidebarIsOpen={false}
      >
        <Switch>
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
