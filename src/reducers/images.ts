import { combineReducers } from 'redux';
import { ActionType, getType } from 'typesafe-actions';

import * as actions from '../actions/images';
import { Image } from '../types/images';
import { ResourceState } from './types';

export type ImagesActions = ActionType<typeof actions>;

export default combineReducers<ResourceState<Image>, ImagesActions>({
  items: (state = [], action) => {
    switch (action.type) {
      case getType(actions.fetchImages.success):
        return [...action.payload];
      default:
        return state;
    }
  },
  error: (state = '', action) => {
    switch (action.type) {
      case getType(actions.fetchImages.request):
      case getType(actions.fetchImages.success):
        return '';
      case getType(actions.fetchImages.failure):
        return action.payload;
      default:
        return state;
    }
  },
  loading: (state = true, action) => {
    switch (action.type) {
      case getType(actions.fetchImages.request):
        return true;
      case getType(actions.fetchImages.success):
      case getType(actions.fetchImages.failure):
        return false;
      default:
        return state;
    }
  },
});
