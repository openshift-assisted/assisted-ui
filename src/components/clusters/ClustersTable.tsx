import React from 'react';
import {
  Table,
  TableHeader,
  TableBody,
  IRowData,
  SortByDirection,
  ISortBy,
  OnSort,
  IRow,
} from '@patternfly/react-table';
import { ExtraParamsType } from '@patternfly/react-table/dist/js/components/Table/base/types';
import { ClusterTableRows } from '../../types/clusters';
import { rowSorter, HumanizedSortable } from '../ui/table/utils';
import sortable from '../ui/table/sortable';

const rowKey = ({ rowData }: ExtraParamsType) => rowData?.id?.title;

interface ClustersTableProps {
  rows: ClusterTableRows;
  deleteCluster: (id: string) => void;
}

// TODO(mlibra): let's try to remove it - not needed for HostsTable
// TODO(jtomasek): Those should not be needed to define as they are optional,
// needs fixing in @patternfly/react-table
const headerStyle = {
  position: 'sticky',
  top: 0,
  background: 'white',
  zIndex: 1,
};

const columnConfig = {
  transforms: [sortable],
  cellTransforms: [],
  formatters: [],
  cellFormatters: [],
  props: {},
};

const headerConfig = { header: { props: { style: headerStyle } } };

const columns = [
  { title: 'Name', ...headerConfig, ...columnConfig },
  { title: 'ID', ...headerConfig, ...columnConfig },
  { title: 'Version', ...headerConfig, ...columnConfig },
  { title: 'Status', ...headerConfig, ...columnConfig },
  { title: 'Hosts', ...headerConfig, ...columnConfig },
];

const ClustersTable: React.FC<ClustersTableProps> = ({ rows, deleteCluster }) => {
  const [sortBy, setSortBy] = React.useState({
    index: 0, // Name-column
    direction: SortByDirection.asc,
  } as ISortBy);

  const actions = React.useMemo(
    () => [
      {
        title: 'Delete',
        onClick: (event: React.MouseEvent, rowIndex: number, rowData: IRowData) =>
          deleteCluster(rowData.id.title),
      },
    ],
    [deleteCluster],
  );

  const onSort: OnSort = React.useCallback(
    (_event, index, direction) => {
      setSortBy({
        index,
        direction,
      });
    },
    [setSortBy],
  );

  const sortedRows = React.useMemo(
    () =>
      rows.sort(
        rowSorter(
          sortBy,
          (row: IRow, index = 0) => row.cells?.[index] as string | HumanizedSortable,
        ),
      ),
    [rows, sortBy],
  );

  return (
    <Table
      rows={sortedRows}
      cells={columns}
      actions={actions}
      aria-label="Clusters table"
      sortBy={sortBy}
      onSort={onSort}
    >
      <TableHeader />
      <TableBody rowKey={rowKey} />
    </Table>
  );
};

export default ClustersTable;
