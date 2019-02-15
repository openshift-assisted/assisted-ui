import React, { Component } from 'react';
import { Page } from '@patternfly/react-core';
import { Provider } from 'react-redux';

import Header from './ui/Header';
import BackgroundImage from './ui/BackgroundImage';
import ClusterWizard from './ClusterWizard';
import ClusterWizardSteps from './ClusterWizardSteps';
import { store } from '../store';

class App extends Component {
  render(): JSX.Element {
    return (
      <Provider store={store}>
        <BackgroundImage />
        <Page
          header={<Header />}
          sidebar={<ClusterWizardSteps />}
          // TODO(jtomasek): enable this to automatically hide sidebar in mobile
          // view. This requires update to Page.d.ts and Page.js in @patternfly/react-core
          // isManagedSidebar
        >
          <ClusterWizard />
        </Page>
      </Provider>
    );
  }
}
export default App;
