import React, { FC, Fragment } from 'react';
import { Table, TableHeader, TableBody } from '@patternfly/react-table';

const HostsTable: FC = (): JSX.Element => {
  const headerStyle = { position: 'sticky', top: 0, background: 'white' };
  const headerConfig = { header: { props: { style: headerStyle } } };
  // TODO(jtomasek): Those should not be needed to define as they are optional,
  // needs fixing in @patternfly/react-table
  const columnConfig = {
    transfroms: [], // TODO fix the typo once it is fixed in @patternfly/react-table
    // transforms: [],
    cellTransforms: [],
    formatters: [],
    cellFormatters: [],
    props: {}
  };
  const columns = [
    { title: 'Name', ...headerConfig, ...columnConfig },
    { title: 'IP Address', ...headerConfig, ...columnConfig },
    { title: 'Status', ...headerConfig, ...columnConfig },
    { title: 'CPU', ...headerConfig, ...columnConfig },
    { title: 'Memory', ...headerConfig, ...columnConfig },
    { title: 'Disk', ...headerConfig, ...columnConfig },
    { title: 'Type', ...headerConfig, ...columnConfig }
  ];
  const hosts = Array.from(Array(12).keys()).map(i => [
    `master-host${i}`,
    '10.207.186.120',
    'Manageable',
    '25',
    '100 GB',
    '75 TB',
    'Master'
  ]);
  return (
    <Fragment>
      <Table rows={hosts} cells={columns} aria-label="Hosts table">
        <TableHeader />
        <TableBody />
      </Table>
    </Fragment>
  );
};

export default HostsTable;
