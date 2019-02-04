import { combineReducers } from 'redux';
import { ActionType } from 'typesafe-actions';

import * as nodes from '../actions/nodes';
import { Node } from '../models/nodes';
import { GET_NODES } from '../constants/nodes';

export type NodesAction = ActionType<typeof nodes>;

export interface NodesState {
  readonly nodes: Node[];
}

export default combineReducers<NodesState, NodesAction>({
  nodes: (state = [], action) => {
    switch (action.type) {
      case GET_NODES:
        return [...state];

      default:
        return state;
    }
  }
});
