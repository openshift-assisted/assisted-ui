import Axios, { AxiosError } from 'axios';
import { ISortBy, SortByDirection, IRow } from '@patternfly/react-table';

type OnError = <T>(arg0: AxiosError<T>) => void;

export type HumanizedSortable = {
  title: string | React.ReactNode;
  sortableValue: number | string;
};

export const handleApiError = <T>(error: AxiosError<T>, onError?: OnError) => {
  if (Axios.isCancel(error)) {
    console.error('Request canceled:', error.message);
  } else {
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.error('Response data:', error.response.data);
      console.error('Response status:', error.response.status);
      console.error('Response headers:', error.response.headers);
    } else if (error.request) {
      // The request was made but no response was received
      // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
      // http.ClientRequest in node.js
      console.error('Request:', error.request);
    } else {
      // Something happened in setting up the request that triggered an Error
      console.error('Error', error.message);
    }
    console.error('Error config:', error.config);
    if (onError) return onError(error);
  }
};

type getCellType = (row: IRow, index: number | undefined) => string | HumanizedSortable;

export const rowSorter = (sortBy: ISortBy, getCell: getCellType) => (a: IRow, b: IRow): number => {
  // const colIndex = (sortBy.index || 0) + colIndexShift;
  const coefficient = sortBy.direction === SortByDirection.asc ? 1 : -1;
  const cellA = getCell(a, sortBy.index);
  const cellB = getCell(b, sortBy.index);

  let valA = typeof cellA === 'string' ? cellA : cellA?.sortableValue;
  let valB = typeof cellB === 'string' ? cellB : cellB?.sortableValue;

  if (typeof valA === 'string' || typeof valB === 'string') {
    valA = (valA || '') as string; // handle undefined
    return valA.localeCompare(valB as string) * coefficient;
  }

  // numeric (like timestamp or memory)
  valA = valA || 0; // handle undefined
  valB = valB || 0;
  return (valA - valB) * coefficient;
};
