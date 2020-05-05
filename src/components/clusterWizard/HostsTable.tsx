import React from 'react';
import _ from 'lodash';
import {
  Table,
  TableHeader,
  TableBody,
  TableVariant,
  IRow,
  expandable,
  IRowData,
} from '@patternfly/react-table';
import { ConnectedIcon } from '@patternfly/react-icons';
import { ExtraParamsType } from '@patternfly/react-table/dist/js/components/Table/base';
import { AlertVariant } from '@patternfly/react-core';
import { EmptyState, ErrorState } from '../ui/uiState';
import { getColSpanRow } from '../ui/table/utils';
import { ResourceUIState } from '../../types';
import { Host, Cluster } from '../../api/types';
import { enableClusterHost, disableClusterHost } from '../../api/clusters';
import { Alerts, Alert } from '../ui/Alerts';
import { getHostRowHardwareInfo, getHardwareInfo } from './hardwareInfo';
import { DiscoveryImageModalButton } from './discoveryImageModal';
import HostStatus from './HostStatus';
import { HostDetail } from './HostRowDetail';
import { RoleDropdown } from './RoleDropdown';

import './HostsTable.css';

type HostsTableProps = {
  cluster: Cluster;
  uiState: ResourceUIState;
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
        {
          title: <RoleDropdown role={role} host={host} />,
        },
        id, // TODO(mlibra): should be serial number
        { title: <HostStatus status={status} statusInfo={statusInfo} /> },
        cpu,
        memory,
        disk,
      ],
      extraData: host,
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

const rowKey = ({ rowData }: ExtraParamsType) => rowData?.id?.title;

const HostsTable: React.FC<HostsTableProps> = ({ uiState, variant, cluster }) => {
  const [openRows, setOpenRows] = React.useState({} as OpenRows);
  const [alerts, setAlerts] = React.useState([] as Alert[]);

  const hostRows = React.useMemo(
    () => _.flatten((cluster.hosts || []).map(hostToHostTableRow(openRows))),
    [cluster.hosts, openRows],
  );

  const rows = React.useMemo(() => {
    const errorState = <ErrorState title="Failed to fetch hosts" />;
    const columnCount = columns.length;
    switch (uiState) {
      // case ResourceUIState.LOADING:
      //   return getColSpanRow(loadingState, columnCount);
      // case ResourceUIState.EMPTY:
      //   return getColSpanRow(emptyState, columnCount);
      case ResourceUIState.ERROR:
        return getColSpanRow(errorState, columnCount);
      default:
        if (hostRows.length) {
          return hostRows;
        }
        return getColSpanRow(HostsTableEmptyState, columnCount);
    }
  }, [uiState, hostRows]);

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

  const addAlert = React.useCallback(
    (alert: Alert) => {
      if (alert.key) {
        alert.onClose = () => {
          setAlerts(alerts.filter((a) => a.key !== alert.key));
        };

        // remove existing and place new on the top
        setAlerts([alert, ...alerts.filter((a) => a.key !== alert.key)]);
      } else {
        setAlerts([alert, ...alerts]);
      }
    },
    [alerts, setAlerts],
  );

  const onHostEnable = React.useCallback(
    (event: React.MouseEvent, rowIndex: number, rowData: IRowData) => {
      const hostId = rowData.extraData.id;
      enableClusterHost(cluster.id, hostId).catch((err) => {
        console.error('Failed to enable host in cluster: ', err);
        addAlert({
          key: `enable-${hostId}`,
          variant: AlertVariant.warning,
          text: `Failed to enable host ${hostId}`,
        });
      });
    },
    [cluster.id, addAlert],
  );

  const onHostDisable = React.useCallback(
    (event: React.MouseEvent, rowIndex: number, rowData: IRowData) => {
      const hostId = rowData.extraData.id;
      disableClusterHost(cluster.id, hostId).catch((err) => {
        console.error('Failed to disable host in cluster: ', err);
        addAlert({
          key: `disable-${hostId}`,
          variant: AlertVariant.warning,
          text: `Failed to disable host ${hostId}`,
        });
      });
    },
    [cluster.id, addAlert],
  );

  const actionResolver = React.useCallback(
    (rowData: IRowData) => {
      const host = rowData.extraData;
      if (!host) {
        // I.e. row with detail
        return [];
      }

      const actions = [];
      if (host.status === 'disabled') {
        actions.push({
          title: 'Enable in cluster',
          onClick: onHostEnable,
        });
      }
      if (['discovering', 'disconnected', 'known', 'insufficient'].includes(host.status)) {
        actions.push({
          title: 'Disable in cluster',
          onClick: onHostDisable,
        });
      }

      return actions;
    },
    [onHostEnable, onHostDisable],
  );

  return (
    <>
      <Table
        rows={rows}
        cells={columns}
        onCollapse={onCollapse}
        variant={variant ? variant : rows.length > 10 ? TableVariant.compact : undefined}
        aria-label="Hosts table"
        actionResolver={actionResolver}
        className="hosts-table"
      >
        <TableHeader />
        <TableBody rowKey={rowKey} />
      </Table>
      <Alerts alerts={alerts} className="host-table-alerts" />
    </>
  );
};

export default HostsTable;
