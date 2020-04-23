import React from 'react';
import * as _ from 'lodash';
import {
  Table,
  TableHeader,
  TableBody,
  TableVariant,
  IRow,
  expandable,
} from '@patternfly/react-table';
import { ConnectedIcon } from '@patternfly/react-icons';
import {
  Flex,
  FlexItem,
  TextContent,
  TextList,
  TextListItem,
  TextListVariants,
  TextListItemVariants,
} from '@patternfly/react-core';
import Humanize from 'humanize-plus';
import { EmptyState, ErrorState } from '../ui/uiState';
import { getColSpanRow } from '../ui/table/utils';
import { ResourceUIState } from '../../types';
import { Host, Introspection, BlockDevice } from '../../api/types';
import { DiscoveryImageModalButton } from './discoveryImageModal';
import HostStatus from './HostStatus';

type HostsTableProps = {
  hosts?: Host[];
  uiState: ResourceUIState;
  fetchHosts: () => void;
  variant?: TableVariant;
};

type HostDetailProps = {
  hwInfo: HostHardwareInfo;
};

type OpenRows = {
  [id: string]: boolean;
};

export type HostHardwareInfo = {
  cpu: string;
  memory: string;
  disk: string;
};

const getHostRowHardwareInfo = (hwInfoString: string): HostHardwareInfo => {
  let hwInfo: Introspection = {};
  try {
    hwInfo = JSON.parse(hwInfoString);
    console.log('--- hwInfo: ', hwInfo);
  } catch (e) {
    console.error('Failed to parse Hardware Info', e);
  }
  return {
    cpu: `${hwInfo?.cpu?.cpus}x ${Humanize.formatNumber(hwInfo?.cpu?.['cpu-mhz'] || 0)} MHz`,
    memory: Humanize.fileSize(hwInfo?.memory?.[0]?.total || 0),
    disk: Humanize.fileSize(
      hwInfo?.['block-devices']
        ?.filter((device: BlockDevice) => device['device-type'] === 'disk')
        .reduce((diskSize: number, device: BlockDevice) => diskSize + (device?.size || 0), 0) || 0,
    ),
  };
};

const HostDetail: React.FC<HostDetailProps> = (props) => (
  <Flex>
    <FlexItem>
      <TextContent>
        <TextList component={TextListVariants.dl}>
          <TextListItem component={TextListItemVariants.dt}>Web</TextListItem>
          <TextListItem component={TextListItemVariants.dd}>
            The part of the Internet that contains websites and web pages
          </TextListItem>
          <TextListItem component={TextListItemVariants.dt}>HTML</TextListItem>
          <TextListItem component={TextListItemVariants.dd}>
            A markup language for creating web pages
          </TextListItem>
          <TextListItem component={TextListItemVariants.dt}>CSS</TextListItem>
          <TextListItem component={TextListItemVariants.dd}>
            A technology to make HTML look better
          </TextListItem>
        </TextList>
      </TextContent>{' '}
    </FlexItem>
    <FlexItem>
      <TextContent>
        <TextList component={TextListVariants.dl}>
          <TextListItem component={TextListItemVariants.dt}>HTML</TextListItem>
          <TextListItem component={TextListItemVariants.dd}>
            A markup language for creating web pages
          </TextListItem>
          <TextListItem component={TextListItemVariants.dt}>CSS</TextListItem>
          <TextListItem component={TextListItemVariants.dd}>
            A technology to make HTML look better
          </TextListItem>
        </TextList>
      </TextContent>{' '}
    </FlexItem>
  </Flex>
);

const hostToHostTableRow = (openRows: OpenRows) => (host: Host, idx: number): IRow => {
  const { id, status, statusInfo, hardwareInfo = '' } = host;
  const hwInfo = getHostRowHardwareInfo(hardwareInfo);
  const { cpu, memory, disk } = hwInfo;

  return [
    {
      // visible row
      isOpen: !!openRows[id],
      cells: [
        id, // TODO: should be "name"
        'Master', // TODO: should be flexible (a dropdown for master/worker)
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

const columns = [
  { title: 'ID', cellFormatters: [expandable] },
  { title: 'Role' },
  { title: 'Serial Number' },
  { title: 'Status' },
  { title: 'vCPU' },
  { title: 'Memory' },
  { title: 'Disk' },
];

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
