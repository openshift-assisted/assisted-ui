import React from 'react';
import { store } from '../store';
import { Page } from '@patternfly/react-core';
import { Provider } from 'react-redux';
import Header from './ui/Header';
import BackgroundImage from './ui/BackgroundImage';
import ClusterWizard from './ClusterWizard';
import ClusterWizardSteps from './ClusterWizardSteps';

import '../styles/index.css';

const App: React.FC = () => (
  <Provider store={store}>
    <BackgroundImage />
    <Page
      header={<Header />}
      sidebar={<ClusterWizardSteps />}
      style={{ height: '100vh', background: 'transparent' }}
      isManagedSidebar // enable this to automatically hide sidebar in mobile
    >
      <ClusterWizard />
    </Page>
  </Provider>
);
export default App;
