import React from 'react';
import { AxiosPromise } from 'axios';
import { ResourceUIState } from '../types';

type State<T> = {
  data?: T;
  uiState: ResourceUIState;
};

type Action<T> = {
  type: 'REQUEST' | 'SUCCESS' | 'ERROR';
  payload?: T;
};

const reducer = <T>(state: State<T>, { type, payload }: Action<T>) => {
  switch (type) {
    case 'REQUEST':
      return { ...state, uiState: ResourceUIState.LOADING };
    case 'SUCCESS':
      if (payload instanceof Array && !payload.length) {
        return { ...state, uiState: ResourceUIState.EMPTY, data: payload };
      } else {
        return { ...state, uiState: ResourceUIState.LOADED, data: payload };
      }
    case 'ERROR':
      return { ...state, uiState: ResourceUIState.ERROR };
    default:
      return state;
  }
};

const createInitialState = <T>(manual: boolean): State<T> => ({
  uiState: manual ? ResourceUIState.LOADED : ResourceUIState.LOADING,
  data: undefined,
});

const useApi = <Data, A>(
  apiCall: (params: A) => AxiosPromise<Data>,
  params: A,
  manual = false,
): [State<Data>, () => void] => {
  const [state, dispatch] = React.useReducer(reducer, createInitialState<Data>(manual));

  const fetchData = async () => {
    dispatch({ type: 'REQUEST' });
    try {
      const { data } = await apiCall(params);
      dispatch({ type: 'SUCCESS', payload: data });
    } catch (e) {
      console.error(e);
      console.error(e.response.data);
      dispatch({ type: 'ERROR' });
    }
  };

  const stringifiedParams = typeof params === 'string' ? params : JSON.stringify(params);

  React.useEffect(() => {
    if (!manual) {
      fetchData();
    }
  }, [apiCall, stringifiedParams]); // eslint-disable-line react-hooks/exhaustive-deps

  const refetch = React.useCallback(
    () => {
      fetchData();
    },
    [params, stringifiedParams], // eslint-disable-line react-hooks/exhaustive-deps
  );

  return [state as State<Data>, refetch];
};

export default useApi;
