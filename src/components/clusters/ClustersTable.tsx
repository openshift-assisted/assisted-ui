import React from 'react';
import { Table, TableHeader, TableBody, TableVariant, IRowData } from '@patternfly/react-table';
import { ClusterTableRows } from '../../types/clusters';

interface Props {
  rows: ClusterTableRows;
  deleteCluster: (id: string) => void;
}

const ClustersTable: React.FC<Props> = ({ rows, deleteCluster }) => {
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
    { title: 'ID', ...headerConfig, ...columnConfig },
    { title: 'Status', ...headerConfig, ...columnConfig },
    { title: 'Hosts', ...headerConfig, ...columnConfig },
    { title: 'Namespace', ...headerConfig, ...columnConfig },
  ];
  const actions = [
    {
      title: 'Delete',
      onClick: (event: React.MouseEvent, rowIndex: number, rowData: IRowData) =>
        deleteCluster(rowData[1]),
    },
  ];
  return (
    <Table
      rows={rows}
      cells={columns}
      actions={actions}
      variant={rows.length > 5 ? TableVariant.compact : undefined}
      aria-label="Clusters table"
    >
      <TableHeader />
      <TableBody />
    </Table>
  );
};

export default ClustersTable;
