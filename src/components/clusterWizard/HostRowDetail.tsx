import React from 'react';
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
import { Introspection } from '../../api/types';
import { getMemoryCapacity, getDisks, getNics } from './hardwareInfo';

import './HostRowDetail.scss';

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

const HostDetailItem: React.FC<HostDetailItemProps> = ({ title, value = '' }) => {
  return (
    <>
      <Text component={TextVariants.h3} className="host-row-detail-item__title">
        {title}
      </Text>
      <Text component={TextVariants.p} className="host-row-detail-item__value">
        {Array.isArray(value) ? (
          <TextList component={TextListVariants.dl}>
            {value.map((item) => (
              <>
                <TextListItem component={TextListItemVariants.dt}>{item.title}</TextListItem>
                <TextListItem component={TextListItemVariants.dd}>{item.value}</TextListItem>
              </>
            ))}
          </TextList>
        ) : (
          value
        )}
      </Text>
    </>
  );
};

export const HostDetail: React.FC<HostDetailProps> = ({ hwInfo }) => {
  const memoryCapacity = Humanize.fileSize(getMemoryCapacity(hwInfo));
  return (
    <Flex>
      <FlexItem breakpointMods={[{ modifier: FlexModifiers['grow'] }]}>
        <TextContent>
          <HostDetailItem title="CPU architecture" value={hwInfo.cpu?.architecture} />
          <HostDetailItem title="Model name" value={hwInfo.cpu?.['model-name']} />
          <HostDetailItem title="Memory capacity" value={memoryCapacity} />
          <HostDetailItem title="CPUs" value={hwInfo.cpu?.cpus} />
          <HostDetailItem title="Threads per core" value={hwInfo.cpu?.['threads-per-core']} />
          <HostDetailItem title="Sockets" value={hwInfo.cpu?.sockets} />
        </TextContent>
      </FlexItem>

      <FlexItem breakpointMods={[{ modifier: FlexModifiers['grow'] }]}>
        <TextContent>
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
        </TextContent>
      </FlexItem>

      <FlexItem breakpointMods={[{ modifier: FlexModifiers['grow'] }]}>
        <TextContent>
          {getDisks(hwInfo).map((disk, idx) => (
            <HostDetailItem
              key={disk.name}
              title={`Disk ${disk.name || idx}`}
              value={Humanize.fileSize(disk.size || 0)}
            />
          ))}
        </TextContent>
      </FlexItem>
    </Flex>
  );
};
