import React from 'react';
import hdate from 'human-date';
import { EventList } from '../../api/types';
import { SimpleList, SimpleListItem } from '@patternfly/react-core';

import './EventsList.css';

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
    <SimpleList>
      {sortedEvents.map((event) => (
        <SimpleListItem key={event.message + event.sortableTime}>
          <span className="events-list__time">{event.humanTime}:</span>
          {event.message}
        </SimpleListItem>
      ))}
    </SimpleList>
  );
};
export default EventsList;
