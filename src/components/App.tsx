import React, { Component } from 'react';
import { Page } from '@patternfly/react-core';
import { Provider } from 'react-redux';

import Header from './ui/Header';
import BackgroundImage from './ui/BackgroundImage';
import ClusterWizard from './ClusterWizard';
import { store } from '../store';

class App extends Component {
  render(): JSX.Element {
    return (
      <Provider store={store}>
        <BackgroundImage />
        <Page header={<Header />}>
          <ClusterWizard />
        </Page>
      </Provider>
    );
  }
}

export default App;
