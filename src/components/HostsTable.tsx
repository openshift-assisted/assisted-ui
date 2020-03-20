import React from 'react';
import { Table, TableHeader, TableBody, TableVariant } from '@patternfly/react-table';
import { HostTableRows } from '../types/hosts';
import { TableEmptyState, TableErrorState, TableLoadingState } from './ui/table';
import { getColSpanRow } from './ui/table/utils';
import { Button, ButtonVariant } from '@patternfly/react-core';

interface Props {
  hostRows: HostTableRows;
  loading: boolean;
  error: string;
  fetchHosts: () => void;
}

const HostsTable: React.FC<Props> = ({ hostRows, loading, error, fetchHosts }) => {
  const headerStyle = {
    position: 'sticky',
    top: 0,
    background: 'white',
    zIndex: 1,
  };
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
    { title: 'Name', ...headerConfig, ...columnConfig },
    { title: 'IP Address', ...headerConfig, ...columnConfig },
    { title: 'Status', ...headerConfig, ...columnConfig },
    { title: 'CPU', ...headerConfig, ...columnConfig },
    { title: 'Memory', ...headerConfig, ...columnConfig },
    { title: 'Disk', ...headerConfig, ...columnConfig },
    { title: 'Type', ...headerConfig, ...columnConfig },
  ];

  const emptyState = (
    <TableEmptyState
      title="No hosts connected yet."
      content="Connect at least 3 hosts to your cluster to pool together resources and start running workloads."
    />
  );
  const errorState = (
    <TableErrorState
      title={error}
      content={
        <>
          There was an error retrieving data. Check your connection and{' '}
          <Button onClick={fetchHosts} variant={ButtonVariant.link} isInline>
            try again
          </Button>
          .
        </>
      }
    />
  );
  const loadingState = <TableLoadingState />;

  const getRows = () => {
    const columnCount = columns.length;
    if (error) return getColSpanRow(errorState, columnCount);
    else if (loading) return getColSpanRow(loadingState, columnCount);
    else if (!hostRows.length) return getColSpanRow(emptyState, columnCount);
    else return hostRows;
  };

  return (
    <Table
      rows={getRows()}
      cells={columns}
      variant={columns.length > 5 ? TableVariant.compact : undefined}
      aria-label="Hosts table"
    >
      <TableHeader />
      <TableBody />
    </Table>
  );
};

export default HostsTable;
