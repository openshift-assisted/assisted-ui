import React, { ReactChild } from 'react';
import Humanize from 'humanize-plus';
import {
  Flex,
  FlexItem,
  TextContent,
  TextList,
  TextListItem,
  TextListVariants,
  TextListItemVariants,
  Text,
  TextVariants,
  FlexModifiers,
} from '@patternfly/react-core';
import { Introspection, BlockDevice } from '../../api/types';
import { getMemoryCapacity, getDisks, getNics } from './hardwareInfo';

import './HostRowDetail.css';
import { Table, TableHeader, TableBody, TableVariant } from '@patternfly/react-table';
import { ExtraParamsType } from '@patternfly/react-table/dist/js/components/Table/base';

type HostDetailProps = {
  hwInfo: Introspection;
};

type HostDetailItemProps = {
  title: string;
  value?:
    | {
        title: string;
        value?: string;
      }[]
    | string
    | number;
};

type SectionTitleProps = {
  title: string;
};

type SectionColumnProps = {
  children: ReactChild | ReactChild[];
};

type DisksTableProps = {
  disks: BlockDevice[];
};

const HostDetailItem: React.FC<HostDetailItemProps> = ({ title, value = '' }) => {
  return (
    <>
      <Text component={TextVariants.h3} className="host-row-detail-item__title">
        {title}
      </Text>
      <div>
        {Array.isArray(value) ? (
          <TextList component={TextListVariants.dl}>
            {value.map((item) => [
              <TextListItem key={item.title} component={TextListItemVariants.dt}>
                {item.title}
              </TextListItem>,
              <TextListItem key={`dd-${item.title}`} component={TextListItemVariants.dd}>
                {item.value}
              </TextListItem>,
            ])}
          </TextList>
        ) : (
          value
        )}
      </div>
    </>
  );
};

const SectionTitle: React.FC<SectionTitleProps> = ({ title }) => (
  <FlexItem breakpointMods={[{ modifier: FlexModifiers['full-width'] }]}>
    <TextContent>
      <Text component={TextVariants.h2}>{title}</Text>
    </TextContent>
  </FlexItem>
);

const SectionColumn: React.FC<SectionColumnProps> = ({ children }) => (
  <FlexItem breakpointMods={[{ modifier: FlexModifiers['grow'] }]}>
    <TextContent>{children}</TextContent>
  </FlexItem>
);

const diskColumns = [
  { title: 'Name' },
  { title: 'Size' },
  { title: 'Device type' },
  { title: 'fstype' },
  { title: 'Removeable' },
  { title: 'Device number' },
  { title: 'Mount point' },
];

const diskRowKey = ({ rowData }: ExtraParamsType) => rowData?.name?.title;

const DisksTable: React.FC<DisksTableProps> = ({ disks }) => {
  const rows = disks
    .sort((diskA, diskB) => diskA.name?.localeCompare(diskB.name || '') || 0)
    .map((disk) => ({
      cells: [
        disk.name,
        Humanize.fileSize(disk.size || 0),
        disk['device-type'],
        disk.fstype,
        disk['removable-device'],
        disk['major-device-number']
          ? `(${disk['major-device-number']}, ${disk['minor-device-number']})`
          : '',
        disk.mountpoint,
      ],
    }));

  return (
    <Table
      rows={rows}
      cells={diskColumns}
      variant={TableVariant.compact}
      aria-label="Host's disks table"
    >
      <TableHeader />
      <TableBody rowKey={diskRowKey} />
    </Table>
  );
};

export const HostDetail: React.FC<HostDetailProps> = ({ hwInfo }) => {
  const memoryCapacity = Humanize.fileSize(getMemoryCapacity(hwInfo));
  const disks = getDisks(hwInfo);

  return (
    <Flex>
      <SectionTitle title="Host Details" />
      <SectionColumn>
        <HostDetailItem title="CPU architecture" value={hwInfo.cpu?.architecture} />
        <HostDetailItem title="Model name" value={hwInfo.cpu?.['model-name']} />
        {/* TODO(mlibra): <HostDetailItem title="Motherboard serial number" value={} /> */}
      </SectionColumn>
      <SectionColumn>
        <HostDetailItem title="Memory capacity" value={memoryCapacity} />
        <HostDetailItem title="CPU clock speed" value={hwInfo.cpu?.['cpu-mhz']} />
      </SectionColumn>
      <SectionColumn>
        <HostDetailItem title="CPUs" value={hwInfo.cpu?.cpus} />
        <HostDetailItem title="Sockets" value={hwInfo.cpu?.sockets} />
        <HostDetailItem title="Threads per core" value={hwInfo.cpu?.['threads-per-core']} />
      </SectionColumn>

      <SectionTitle title={`Disks (${disks.length})`} />
      <SectionColumn>
        <DisksTable disks={disks} />
      </SectionColumn>

      <SectionTitle title="NICs" />
      <SectionColumn>
        {getNics(hwInfo).map((nic, idx) => (
          <HostDetailItem
            key={nic.name}
            title={`NIC ${nic.name || idx}`}
            value={[
              {
                title: 'IP',
                value: nic.cidrs?.map((cidr) => `${cidr['ip-address']}/${cidr.mask}`).join(','),
              },
              {
                title: 'MAC',
                value: nic.mac,
              },
              {
                title: 'State',
                value: nic.state,
              },
            ]}
          />
        ))}
      </SectionColumn>
    </Flex>
  );
};
