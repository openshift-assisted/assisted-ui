import React from 'react';
import {
  Table,
  TableHeader,
  TableBody,
  TableVariant,
  IRow,
  expandable,
} from '@patternfly/react-table';
import Humanize from 'humanize-plus';
import { EmptyState, ErrorState } from '../ui/uiState';
import { getColSpanRow } from '../ui/table/utils';
import { ResourceUIState } from '../../types';
import { Host, Introspection, BlockDevice } from '../../api/types';
import { DiscoveryImageModalButton } from './discoveryImageModal';
import HostStatus from './HostStatus';
import { ConnectedIcon } from '@patternfly/react-icons';

type Props = {
  hosts?: Host[];
  uiState: ResourceUIState;
  fetchHosts: () => void;
  variant?: TableVariant;
};

const HostsTable: React.FC<Props> = ({ hosts = [], uiState, fetchHosts, variant }) => {
  // const headerStyle = {
  //   position: 'sticky',
  //   top: 0,
  //   background: 'white',
  //   zIndex: 1,
  // };
  // const headerStyle = {};
  // const headerConfig = { header: { props: { style: headerStyle } } };

  const columns = [
    { title: 'ID', cellFormatters: [expandable] },
    { title: 'Role' },
    { title: 'Serial Number' },
    { title: 'Status' },
    { title: 'vCPU' },
    { title: 'Memory' },
    { title: 'Disk' },
  ];

  type HostRowHwInfo = { cpu: string; memory: string; disk: string };

  const getHostRowHardwareInfo = (hwInfoString: string): HostRowHwInfo => {
    let hwInfo: Introspection = {};
    try {
      hwInfo = JSON.parse(hwInfoString);
    } catch (e) {
      console.error('Failed to parse Hardware Info', e);
    }
    return {
      cpu: `${hwInfo?.cpu?.cpus}x ${Humanize.formatNumber(hwInfo?.cpu?.['cpu-mhz'] || 0)} MHz`,
      memory: Humanize.fileSize(hwInfo?.memory?.[0]?.total || 0),
      disk: Humanize.fileSize(
        hwInfo?.['block-devices']
          ?.filter((device: BlockDevice) => device['device-type'] === 'disk')
          .reduce((diskSize: number, device: BlockDevice) => diskSize + (device?.size || 0), 0) ||
          0,
      ),
    };
  };

  const hostToHostTableRow = (host: Host): IRow => {
    // console.log('--- host: ', host);
    const { id, status, statusInfo, hardwareInfo = '' } = host;
    const { cpu, memory, disk } = getHostRowHardwareInfo(hardwareInfo);
    return {
      // isOpen: true,
      cells: [
        id, // TODO: should be "name"
        'Master', // TODO: should be flexible (a dropdown for master/worker)
        id, // TODO: should be serial number
        { title: <HostStatus status={status} statusInfo={statusInfo} /> },
        cpu,
        memory,
        disk,
      ],
    };
  };

  const hostRows = hosts.map(hostToHostTableRow);
  // const hostRows = hosts.map(hostToHostTableRow).reduce((newRows: IRow[], currentRow) => {
  //   newRows.push(currentRow);
  //   newRows.push({ parent: currentRow[0], fullWidth: true, cells: ['hello'] } as IRow);
  //   return newRows;
  // }, []);

  const emptyState = (
    <EmptyState
      icon={ConnectedIcon}
      title="Waiting for hosts..."
      content="Boot the discovery ISO on a hardware that should become part of this bare metal cluster. After booting the ISO the hosts get inspected and register to the cluster. At least 3 bare metal hosts are required to form the cluster."
      primaryAction={<DiscoveryImageModalButton />}
    />
  );
  const errorState = <ErrorState title="Failed to fetch hosts" fetchData={fetchHosts} />;

  const getRows = () => {
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
        return getColSpanRow(emptyState, columnCount);
    }
  };

  const rows = getRows();
  return (
    <Table
      rows={rows}
      cells={columns}
      // onCollapse={(event, rowKey, isOpen) => {
      //   console.log('rowKey', rowKey);
      //   console.log('isOpen', isOpen);
      // }}
      variant={variant ? variant : rows.length > 10 ? TableVariant.compact : undefined}
      aria-label="Hosts table"
    >
      <TableHeader />
      <TableBody />
    </Table>
  );
};

export default HostsTable;
