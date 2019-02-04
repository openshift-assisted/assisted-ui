import { action } from 'typesafe-actions';
import { GET_NODES } from '../constants/nodes';

// NOTE: this is just an example for now
export const getNodes = (): { type: string; payload?: object } =>
  action(GET_NODES);
