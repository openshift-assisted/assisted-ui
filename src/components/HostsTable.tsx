import React, { FC, Fragment } from 'react';
import { Table, TableHeader, TableBody } from '@patternfly/react-table';
import { Bullseye, Button, Popover } from '@patternfly/react-core';
import { HostTableRows } from '../models/hosts';
import { ValidationError } from '../models/validations';
import HostsEmptyState from './HostsEmptyState';

interface Props {
  hostRows: HostTableRows;
  hostValidationErrors: any;
  loadingHosts: boolean;
}

const HostsTable: FC<Props> = ({
  hostRows,
  loadingHosts,
  hostValidationErrors
}: Props): JSX.Element => {
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

  const statusFormatter = (hostStatus: any, extra: any) => {
    let validationErrors: ValidationError[] = hostValidationErrors[extra.rowData.name.title];
    let errorElements = validationErrors.map((error, index) => {
        return (
            <div key={index}>
                <p>{error.name}</p>
                <p>{error.message}</p>
            </div>
        );
    });
    return (
      <div>
      {(validationErrors.length > 0) ? (
        <Popover
          position="right"
          size="regular"
          headerContent={<div>Errors</div>}
          bodyContent={errorElements}
        >
          <Button variant="plain">Errors</Button>
        </Popover>
      ) : (
        <p>{hostStatus}</p>
      )}
    </div>
    )
  };

  const statusColumnConfig = {
    transfroms: [], // TODO fix the typo once it is fixed in @patternfly/react-table
    // transforms: [],
    cellTransforms: [],
    formatters: [],
    cellFormatters: [statusFormatter],
    props: {}
  };
  const columns = [
    { title: 'Name', ...headerConfig, ...columnConfig },
    { title: 'IP Address', ...headerConfig, ...columnConfig },
    { title: 'Status', ...headerConfig, ...statusColumnConfig },
    { title: 'CPU', ...headerConfig, ...columnConfig },
    { title: 'Memory', ...headerConfig, ...columnConfig },
    { title: 'Disk', ...headerConfig, ...columnConfig },
    { title: 'Type', ...headerConfig, ...columnConfig }
  ];
  return (
    <Fragment>
      <Table rows={hostRows} cells={columns} aria-label="Hosts table">
        <TableHeader />
        {!loadingHosts && !!hostRows.length && <TableBody />}
      </Table>
      {loadingHosts && <Bullseye>Loading...</Bullseye>}
      {!loadingHosts && !hostRows.length && <HostsEmptyState />}
    </Fragment>
  );
};

export default HostsTable;
