import { Dispatch } from 'redux';
import { createAsyncAction } from 'typesafe-actions';
import { getResourceList } from '../api';
import { ApiResourceKindPlural } from '../types';
import { Image } from '../types/images';

export const fetchImages = createAsyncAction(
  'GET_IMAGES_REQUEST',
  'GET_IMAGES_SUCCESS',
  'GET_IMAGES_FAILURE',
)<void, Image[], string>();

export const fetchImagesAsync = () => async (dispatch: Dispatch) => {
  dispatch(fetchImages.request());
  try {
    const { data } = await getResourceList<Image>(ApiResourceKindPlural.images);
    return dispatch(fetchImages.success(data));
  } catch (e) {
    console.error(e);
    return dispatch(fetchImages.failure('Failed to fetch images'));
  }
};
