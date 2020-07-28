import React from 'react';
import { Provider } from 'react-redux';
import { Router, Route } from 'react-router-dom';
import { Page } from '@patternfly/react-core';
import { Store, Router as LibRouter } from 'facet-lib';
import history from '../history';
import Header from './ui/Header';
// import Sidebar from './Sidebar';
import BackgroundImage from './ui/BackgroundImage';
import LoginForm from './login/LoginForm';

import '../styles/index.css';

const { store } = Store;

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
        <LibRouter>
          <Route path="/login" component={LoginForm} />
        </LibRouter>
      </Page>
    </Router>
  </Provider>
);
export default App;
