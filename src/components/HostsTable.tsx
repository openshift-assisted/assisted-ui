import React from 'react';
import { Table, TableHeader, TableBody, TableVariant } from '@patternfly/react-table';
import { HostTableRows } from '../types/hosts';
import { EmptyState, ErrorState, LoadingState } from './ui/uiState';
import { getColSpanRow } from './ui/table/utils';
import { ResourceListUIState } from '../types';
import { useSelector } from 'react-redux';
import { getHostsError } from '../selectors/hosts';

type Props = {
  hostRows: HostTableRows;
  uiState: ResourceListUIState;
  fetchHosts: () => void;
  variant?: TableVariant;
};

const HostsTable: React.FC<Props> = ({ hostRows, uiState, fetchHosts, variant }) => {
  const error = useSelector(getHostsError);
  // const headerStyle = {
  //   position: 'sticky',
  //   top: 0,
  //   background: 'white',
  //   zIndex: 1,
  // };
  const headerStyle = {};
  const headerConfig = { header: { props: { style: headerStyle } } };
  // TODO(jtomasek): Those should not be needed to define as they are optional,
  // needs fixing in @patternfly/react-table
  const columnConfig = {
    transforms: [],
    cellTransforms: [],
    formatters: [],
    cellFormatters: [],
    props: {},
  };
  const columns = [
    { title: 'ID', ...headerConfig, ...columnConfig },
    { title: 'Role', ...headerConfig, ...columnConfig },
    { title: 'Serial Number', ...headerConfig, ...columnConfig },
    { title: 'Status', ...headerConfig, ...columnConfig },
    { title: 'CPU', ...headerConfig, ...columnConfig },
    { title: 'Memory', ...headerConfig, ...columnConfig },
    { title: 'Disk', ...headerConfig, ...columnConfig },
  ];

  const emptyState = (
    <EmptyState
      title="No hosts connected yet."
      content="Connect at least 3 hosts to your cluster to pool together resources and start running workloads."
    />
  );
  const errorState = <ErrorState title={error} fetchData={fetchHosts} />;
  const loadingState = <LoadingState />;

  const getRows = () => {
    const columnCount = columns.length;
    switch (uiState) {
      case ResourceListUIState.LOADING:
        return getColSpanRow(loadingState, columnCount);
      case ResourceListUIState.ERROR:
        return getColSpanRow(errorState, columnCount);
      case ResourceListUIState.EMPTY:
        return getColSpanRow(emptyState, columnCount);
      default:
        return hostRows;
    }
  };

  const rows = getRows();
  return (
    <Table
      rows={rows}
      cells={columns}
      variant={variant ? variant : rows.length > 5 ? TableVariant.compact : undefined}
      aria-label="Hosts table"
    >
      <TableHeader />
      <TableBody />
    </Table>
  );
};

export default HostsTable;
