import React from 'react';
import EventsList from '../ui/EventsList';
import { EventList, Event } from '../../api/types';

type HostEventsProps = {
  hostId: Event['entityId'];
};

const HostEvents: React.FC<HostEventsProps> = ({ hostId }) => {
  // TODO(mlibra): remove mock data
  const events: EventList = [
    {
      entityId: hostId,
      eventTime: '2020-05-27T13:38:13',
      message: 'Foo',
      requestId: 'foo_unused',
    },
    {
      entityId: hostId,
      eventTime: '2020-05-27T08:38:13',
      message:
        'Foo 2 very long text which is hard to display at a single line. bjhocdsa mnkl;csda mlk; mnkl; ji hhjkn nkjl jkbjklb hgi hglhjkl bnmbnmcbdsla blbjckldsacds acdsa cds.',
      requestId: 'foo_unused',
    },
    {
      entityId: hostId,
      eventTime: '2019-05-27T13:38:13',
      message: 'Bar',
      requestId: 'foo_unused',
    },
  ];

  return <EventsList events={events} />;
};

export default HostEvents;
