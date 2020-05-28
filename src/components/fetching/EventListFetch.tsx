import React, { useEffect, useState } from 'react';
import EventsList from '../ui/EventsList';
import { EventList, Event } from '../../api/types';
import { getEvents } from '../../api/events';
import { POLLING_INTERVAL } from '../../config/constants';
import { ErrorState } from '../ui/uiState';

export type EventFetchProps = {
  entityId: Event['entityId'];
};

type EventListFetchProps = EventFetchProps & {
  entityKind: string;
};

const EventListFetch: React.FC<EventListFetchProps> = ({ entityId, entityKind }) => {
  const [events, setEvents] = useState<EventList>([]);
  const [lastPolling, setLastPolling] = useState(0);
  const [error, setError] = useState('');

  useEffect(() => {
    let timer: NodeJS.Timeout;
    const fetch = async () => {
      try {
        const result = await getEvents(entityId);
        if (result) {
          setEvents(result.data);
          setError('');
        }
        timer = setTimeout(() => {
          setLastPolling(Date.now());
        }, POLLING_INTERVAL);
      } catch (error) {
        console.warn(`Failed to load events for ${entityKind} ${entityId}: `, error);
        setError('Failed to load events');
      }
    };
    fetch();
    return () => clearTimeout(timer);
  }, [entityId, lastPolling, entityKind]);

  const forceRefetch = React.useCallback(() => {
    setLastPolling(Date.now());
  }, [setLastPolling]);

  return error ? (
    <ErrorState title={error} fetchData={forceRefetch} />
  ) : (
    <EventsList events={events} />
  );
};

export default EventListFetch;
