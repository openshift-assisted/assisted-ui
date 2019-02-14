import React, { FC, Fragment } from 'react';
import { Table, TableHeader, TableBody } from '@patternfly/react-table';

interface Props {
  hostRows: string[][];
}

const HostsTable: FC<Props> = ({ hostRows }: Props): JSX.Element => {
  const headerStyle = {
    position: 'sticky',
    top: 0,
    background: 'white',
    zIndex: 1
  };
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
  return (
    <Fragment>
      <Table rows={hostRows} cells={columns} aria-label="Hosts table">
        <TableHeader />
        <TableBody />
      </Table>
    </Fragment>
  );
};

export default HostsTable;
