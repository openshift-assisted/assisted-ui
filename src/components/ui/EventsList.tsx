import React from 'react';
import hdate from 'human-date';
import { EventList } from '../../api/types';
import { TableVariant, Table, TableBody } from '@patternfly/react-table';
import { ExtraParamsType } from '@patternfly/react-table/dist/js/components/Table/base';
import { fitContent } from '../ui/table/wrappable';
import { Tooltip, TooltipPosition } from '@patternfly/react-core';
import { getHumanizedDateTime } from './utils';

const getEventRowKey = ({ rowData }: ExtraParamsType) =>
  rowData?.props?.sortableTime + rowData?.message?.title;

type EventsListProps = {
  events: EventList;
};

const EventsList: React.FC<EventsListProps> = ({ events }) => {
  if (events.length === 0) {
    return null;
  }
  // Do not memoize result to keep it recomputed since we use "relative" time bellow
  const sortedEvents = events
    .map((event) => ({
      ...event,
      humanTime: hdate.relativeTime(event.eventTime),
      sortableTime: new Date(event.eventTime).getTime(),
    }))
    .sort(
      // Descending order
      (a, b) => b.sortableTime - a.sortableTime,
    );

  const rows = sortedEvents.map((event) => ({
    cells: [
      {
        title: (
          <Tooltip content={getHumanizedDateTime(event.eventTime)} position={TooltipPosition.right}>
            <strong>{event.humanTime}</strong>
          </Tooltip>
        ),
      },
      event.message,
    ],
    props: { sortableTime: event.sortableTime },
  }));

  return (
    <Table
      rows={rows}
      cells={[{ title: 'Time', cellTransforms: [fitContent] }, { title: 'Message' }]}
      variant={TableVariant.compact}
      aria-label="Host's disks table"
      borders={false}
    >
      <TableBody rowKey={getEventRowKey} />
    </Table>
  );
};

export default EventsList;
