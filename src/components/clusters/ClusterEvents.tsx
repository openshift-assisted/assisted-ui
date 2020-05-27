import React from 'react';
import EventListFetch, { EventFetchProps } from '../ui/EventListFetch';

const ClusterEvents: React.FC<EventFetchProps> = ({ entityId }) => (
  <EventListFetch entityId={entityId} entityKind="cluster" />
);

export default ClusterEvents;
