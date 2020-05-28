import React from 'react';
import hdate from 'human-date';
import {
  DataList,
  DataListItem,
  DataListCell,
  DataListItemCells,
  DataListItemRow,
} from '@patternfly/react-core';
import { EventList } from '../../api/types';

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

  return (
    <DataList aria-label="Event list" isCompact>
      {sortedEvents.map((event) => {
        const id = event.message + event.sortableTime;
        return (
          <DataListItem aria-labelledby={id} key={id}>
            <DataListItemRow>
              <DataListItemCells
                dataListCells={[
                  <DataListCell key={`${id}-time`} width={1}>
                    <span id={id}>{event.humanTime}</span>
                  </DataListCell>,
                  <DataListCell key={`${id}-message`} width={4}>
                    {event.message}
                  </DataListCell>,
                ]}
              ></DataListItemCells>
            </DataListItemRow>
          </DataListItem>
        );
      })}
    </DataList>
  );
};

export default EventsList;
