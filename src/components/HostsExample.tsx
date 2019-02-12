import React, { Component } from 'react';
import { connect } from 'react-redux';

import { fetchHostsAsync } from '../actions/hosts';
import { Host } from '../models/hosts';
import { getHostList, getHostsLoading } from '../selectors/hosts';
import { RootState } from '../store/rootReducer';
import { HostsState } from '../reducers/hosts';

interface Props {
  hosts: Host[];
  loading: boolean;
  fetchHosts: () => void;
}

class HostsExample extends Component<Props> {
  componentDidMount(): void {
    this.props.fetchHosts();
  }

  render(): React.ReactNode {
    const { hosts, loading } = this.props;
    return (
      <div>
        <h1>List of hosts</h1>
        <p>This data is coming from the REST API.</p>
        {loading ? <p>Loading...</p> : undefined}
        <ul>
          {hosts.map(host => (
            <li key={host.id}>{host.id}</li>
          ))}
        </ul>
      </div>
    );
  }
}

const mapStateToProps = (state: RootState): HostsState => ({
  hosts: getHostList(state.hosts),
  loading: getHostsLoading(state.hosts)
});

export default connect(
  mapStateToProps,
  {
    fetchHosts: fetchHostsAsync
  }
)(HostsExample);
