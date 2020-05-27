import { AxiosPromise } from 'axios';
import client from './axiosClient';
import { API_ROOT } from '.';
import { EventList, Event } from './types';

export const getEvents = (id: Event['entityId']): AxiosPromise<EventList> =>
  client.get(`${API_ROOT}/events/${id}`);
