import React from 'react';
import { AxiosPromise } from 'axios';
import { ResourceUIState } from '../types';

type Status<T> = {
  data?: T;
  uiState: ResourceUIState;
  error: string;
};

const useApi = <Data, A>(
  apiCall: (params: A) => AxiosPromise<Data>,
  params: A,
  fetchOnMount = true,
): [Status<Data>, () => void] => {
  const [uiState, setUiState] = React.useState<ResourceUIState>(ResourceUIState.LOADING);
  const [error, setError] = React.useState('');
  const [data, setData] = React.useState<Data>();
  const [refetch, setRefetch] = React.useState(true);
  const didMountRef = React.useRef(fetchOnMount);

  React.useEffect(() => {
    const fetchData = async () => {
      setUiState(ResourceUIState.LOADING);
      setError('');
      try {
        const { data } = await apiCall(params);
        setData(data);
        if (data instanceof Array && !data.length) {
          setUiState(ResourceUIState.EMPTY);
        } else {
          setUiState(ResourceUIState.LOADED);
        }
      } catch (e) {
        console.error(e);
        console.error(e.response.data);
        setUiState(ResourceUIState.ERROR);
        setError(e.response.data);
      }
    };

    if (didMountRef.current) {
      fetchData();
      didMountRef.current = true;
    }
  }, [apiCall, params, refetch]);
  return [{ data, uiState, error }, () => setRefetch(!refetch)];
};

export default useApi;
