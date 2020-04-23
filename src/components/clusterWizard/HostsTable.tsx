import React from 'react';
import _ from 'lodash';
import {
  Table,
  TableHeader,
  TableBody,
  TableVariant,
  IRow,
  expandable,
} from '@patternfly/react-table';
import { ConnectedIcon } from '@patternfly/react-icons';
import { EmptyState, ErrorState } from '../ui/uiState';
import { getColSpanRow } from '../ui/table/utils';
import { ResourceUIState } from '../../types';
import { Host } from '../../api/types';
import { DiscoveryImageModalButton } from './discoveryImageModal';
import HostStatus from './HostStatus';
import { HostDetail } from './HostRowDetail';
import { getHostRowHardwareInfo, getHardwareInfo } from './harwareInfo';

type HostsTableProps = {
  hosts?: Host[];
  uiState: ResourceUIState;
  fetchHosts: () => void;
  variant?: TableVariant;
};

type OpenRows = {
  [id: string]: boolean;
};

const columns = [
  { title: 'ID', cellFormatters: [expandable] },
  { title: 'Role' },
  { title: 'Serial Number' },
  { title: 'Status' },
  { title: 'vCPU' },
  { title: 'Memory' },
  { title: 'Disk' },
];

const hostToHostTableRow = (openRows: OpenRows) => (host: Host, idx: number): IRow => {
  const { id, status, statusInfo, role, hardwareInfo = '' } = host;
  const hwInfo = getHardwareInfo(hardwareInfo) || {};
  const { cpu, memory, disk } = getHostRowHardwareInfo(hwInfo);

  return [
    {
      // visible row
      isOpen: !!openRows[id],
      cells: [
        id,
        role,
        id, // TODO: should be serial number
        { title: <HostStatus status={status} statusInfo={statusInfo} /> },
        cpu,
        memory,
        disk,
      ],
    },
    {
      // expandable detail
      parent: idx * 2, // every row has these two items
      fullWidth: true,
      cells: [{ title: <HostDetail key={id} hwInfo={hwInfo} /> }],
    },
  ];
};

const HostsTableEmptyState: React.FC = () => (
  <EmptyState
    icon={ConnectedIcon}
    title="Waiting for hosts..."
    content="Boot the discovery ISO on a hardware that should become part of this bare metal cluster. After booting the ISO the hosts get inspected and register to the cluster. At least 3 bare metal hosts are required to form the cluster."
    primaryAction={<DiscoveryImageModalButton />}
  />
);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const rowKey = (params: any) => params.rowData.id.title;

const HostsTable: React.FC<HostsTableProps> = ({ hosts = [], uiState, fetchHosts, variant }) => {
  const [openRows, setOpenRows] = React.useState({} as OpenRows);

  const hostRows = React.useMemo(() => _.flatten(hosts.map(hostToHostTableRow(openRows))), [
    hosts,
    openRows,
  ]);

  const rows = React.useMemo(() => {
    const errorState = <ErrorState title="Failed to fetch hosts" fetchData={fetchHosts} />;
    const columnCount = columns.length;
    switch (uiState) {
      // case ResourceUIState.LOADING:
      //   return getColSpanRow(loadingState, columnCount);
      case ResourceUIState.ERROR:
        return getColSpanRow(errorState, columnCount);
      // case ResourceUIState.EMPTY:
      //   return getColSpanRow(emptyState, columnCount);
      default:
        if (hostRows.length) {
          return hostRows;
        }
        return getColSpanRow(HostsTableEmptyState, columnCount);
    }
  }, [uiState, fetchHosts, hostRows]);

  const onCollapse = React.useCallback(
    (_event, rowKey) => {
      const cells = hostRows[rowKey].cells;
      const id = (cells && cells[0]) as string;
      if (id) {
        setOpenRows(Object.assign({}, openRows, { [id]: !openRows[id] }));
      }
    },
    [hostRows, openRows],
  );

  return (
    <Table
      rows={rows}
      cells={columns}
      onCollapse={onCollapse}
      variant={variant ? variant : rows.length > 10 ? TableVariant.compact : undefined}
      aria-label="Hosts table"
    >
      <TableHeader />
      <TableBody rowKey={rowKey} />
    </Table>
  );
};

export default HostsTable;
