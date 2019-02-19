import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import {
  PageSectionVariants,
  Toolbar,
  TextVariants
} from '@patternfly/react-core';

import { fetchHostsAsync } from '../actions/hosts';
import { getHostTableRows, getHostsLoading } from '../selectors/hosts';
import { getHostValidationErrors } from '../selectors/validations';
import { RootState } from '../store/rootReducer';
import PageSection from './ui/PageSection';
import HostsTable from './HostsTable';
import { HostTableRows } from '../models/hosts';
import ClusterWizardToolbar from './ClusterWizardToolbar';
import { ToolbarButton, ToolbarText } from './ui/Toolbar';
import { WizardStep } from '../models/wizard';

interface Props {
  hostRows: HostTableRows;
  hostValidationErrors: any;
  loadingHosts: boolean;
  fetchHosts: () => void;
  setCurrentStep: (step: WizardStep) => void;
}

class BaremetalInventory extends Component<Props> {
  componentDidMount(): void {
    this.props.fetchHosts();
  }

  render(): JSX.Element {
    const { hostRows, loadingHosts, setCurrentStep, hostValidationErrors } = this.props;
    return (
      <Fragment>
        <PageSection variant={PageSectionVariants.darker}>
          Summary stats
        </PageSection>
        <PageSection variant={PageSectionVariants.light}>
          <Toolbar>
            <ToolbarButton variant="primary">Add Hosts</ToolbarButton>
          </Toolbar>
        </PageSection>
        <PageSection
          variant={PageSectionVariants.light}
          isMain
          style={{ padding: 0 }}
        >
          <HostsTable hostRows={hostRows} loadingHosts={loadingHosts} hostValidationErrors={hostValidationErrors} />
        </PageSection>
        <ClusterWizardToolbar>
          <ToolbarButton variant="primary" isDisabled>
            Deploy Cluster
          </ToolbarButton>
          <ToolbarButton
            variant="secondary"
            onClick={() => setCurrentStep(WizardStep.ClusterSetup)}
          >
            Back
          </ToolbarButton>
          <ToolbarText component={TextVariants.small}>
            Connect at least 3 hosts to begin deployment.
          </ToolbarText>
        </ClusterWizardToolbar>
      </Fragment>
    );
  }
}

const mapStateToProps = (
  state: RootState
): {
  hostRows: string[][];
  hostValidationErrors: any;
  loadingHosts: boolean;
} => ({
  hostRows: getHostTableRows(state),
  hostValidationErrors: getHostValidationErrors(state),
  loadingHosts: getHostsLoading(state)
});

export default connect(
  mapStateToProps,
  { fetchHosts: fetchHostsAsync }
)(BaremetalInventory);
