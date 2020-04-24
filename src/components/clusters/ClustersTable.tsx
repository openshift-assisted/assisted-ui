import React from 'react';
import { Table, TableHeader, TableBody, TableVariant, IRowData } from '@patternfly/react-table';
import { ExtraParamsType } from '@patternfly/react-table/dist/js/components/Table/base/types';
import { ClusterTableRows } from '../../types/clusters';

const rowKey = ({ rowData }: ExtraParamsType) => rowData?.id?.title;

interface ClustersTableProps {
  rows: ClusterTableRows;
  deleteCluster: (id: string) => void;
}

const ClustersTable: React.FC<ClustersTableProps> = ({ rows, deleteCluster }) => {
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
  ];
  const actions = [
    {
      title: 'Delete',
      onClick: (event: React.MouseEvent, rowIndex: number, rowData: IRowData) =>
        deleteCluster(rowData.id.title),
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
      <TableBody rowKey={rowKey} />
    </Table>
  );
};

export default ClustersTable;
