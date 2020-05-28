import React from 'react';
import EventListFetch, { EventFetchProps } from './EventListFetch';

const HostEvents: React.FC<EventFetchProps> = (props) => (
  <EventListFetch entityKind="host" {...props} />
);

export default HostEvents;
