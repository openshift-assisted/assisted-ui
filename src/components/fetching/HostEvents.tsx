import React from 'react';
import EventListFetch, { EventFetchProps } from './EventListFetch';

const HostEvents: React.FC<EventFetchProps> = ({ entityId }) => (
  <EventListFetch entityId={entityId} entityKind="host" />
);

export default HostEvents;
