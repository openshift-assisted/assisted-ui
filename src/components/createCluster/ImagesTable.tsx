import React from 'react';
import { Table, TableHeader, TableBody, TableVariant } from '@patternfly/react-table';
import { ImageTableRows } from '../../types/images';
import { EmptyState, ErrorState, LoadingState } from '../ui/uiState';
import { getColSpanRow } from '../ui/table/utils';
import { ResourceListUIState } from '../../types';
import { useSelector } from 'react-redux';
import { getImagesError } from '../../selectors/images';
import { Button, ButtonVariant } from '@patternfly/react-core';
import { AddCircleOIcon } from '@patternfly/react-icons';

type Props = {
  imageRows: ImageTableRows;
  uiState: ResourceListUIState;
  fetchImages: () => void;
};

const ImagesTable: React.FC<Props> = ({ imageRows, uiState, fetchImages }) => {
  const error = useSelector(getImagesError);
  const columns = [{ title: 'Name' }, { title: 'Namespace' }, { title: 'Proxy' }];

  // const emptyState = <EmptyState title="No images generated yet." />;
  const emptyState = (
    <EmptyState
      icon={AddCircleOIcon}
      title="No discovery images generated yet"
      primaryAction={<Button variant={ButtonVariant.primary}>Generate discovery ISO</Button>}
    />
  );
  const errorState = <ErrorState title={error} fetchData={fetchImages} />;
  const loadingState = <LoadingState />;

  const getRows = () => {
    const columnCount = columns.length;
    switch (uiState) {
      case ResourceListUIState.LOADING:
        return getColSpanRow(loadingState, columnCount);
      case ResourceListUIState.ERROR:
        return getColSpanRow(errorState, columnCount);
      case ResourceListUIState.EMPTY:
        return getColSpanRow(emptyState, columnCount);
      default:
        return imageRows;
    }
  };

  const rows = getRows();
  return (
    <Table rows={rows} cells={columns} variant={TableVariant.compact} aria-label="Images table">
      <TableHeader />
      <TableBody />
    </Table>
  );
};

export default ImagesTable;
