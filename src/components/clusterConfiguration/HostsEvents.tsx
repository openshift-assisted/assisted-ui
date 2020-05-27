import React, { useEffect, useState } from 'react';
import EventsList from '../ui/EventsList';
import { EventList, Event } from '../../api/types';
import { getEvents } from '../../api/events';
import { POLLING_INTERVAL } from '../../config/constants';

type HostEventsProps = {
  hostId: Event['entityId'];
};

const HostEvents: React.FC<HostEventsProps> = ({ hostId }) => {
  const [events, setEvents] = useState([] as EventList);
  const [lastPolling, setLastPolling] = useState(0);

  useEffect(() => {
    getEvents(hostId).then((result) => {
      setEvents(result.data);
      setTimeout(() => {
        setLastPolling(Date.now());
      }, POLLING_INTERVAL);
    });
  }, [hostId, lastPolling]);

  return <EventsList events={events} />;
};

export default HostEvents;
