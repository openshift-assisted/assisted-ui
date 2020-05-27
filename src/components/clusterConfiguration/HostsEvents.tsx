import React, { useEffect, useState } from 'react';
import EventsList from '../ui/EventsList';
import { EventList, Event } from '../../api/types';
import { getEvents } from '../../api/events';
import { POLLING_INTERVAL } from '../../config/constants';
import { Alert, AlertVariant } from '@patternfly/react-core';

type HostEventsProps = {
  hostId: Event['entityId'];
};

const HostEvents: React.FC<HostEventsProps> = ({ hostId }) => {
  const [events, setEvents] = useState([] as EventList);
  const [lastPolling, setLastPolling] = useState(0);
  const [error, setError] = useState('');

  useEffect(() => {
    getEvents(hostId)
      .catch((error) => {
        console.warn(`Failed to load events for host ${hostId}: `, error);
        setError('Failed to load events');
      })
      .then((result) => {
        console.log('-- result: ', result);
        if (result) {
          setEvents(result.data);
          setError('');
        }
        setTimeout(() => {
          setLastPolling(Date.now());
        }, POLLING_INTERVAL);
      });
  }, [hostId, lastPolling]);

  return error ? (
    <Alert variant={AlertVariant.danger} title={error} />
  ) : (
    <EventsList events={events} />
  );
};

export default HostEvents;
