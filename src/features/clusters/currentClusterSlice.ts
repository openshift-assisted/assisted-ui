import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { getCluster } from '../../api/clusters';
import { Cluster } from '../../api/types';
import { handleApiError } from '../../api/utils';
import { ResourceUIState } from '../../types';

export const fetchClusterAsync = createAsyncThunk(
  'cluster/fetchClusterAsync',
  async (clusterId: string) => {
    try {
      const { data } = await getCluster(clusterId);
      return data;
    } catch (e) {
      return handleApiError(e, () => Promise.reject('Failed to fetch cluster.'));
    }
  },
);

type CurrentClusterStateSlice = {
  data?: Cluster;
  uiState: ResourceUIState;
};

const initialState: CurrentClusterStateSlice = {
  data: undefined,
  uiState: ResourceUIState.LOADING,
};

export const currentClusterSlice = createSlice({
  initialState,
  name: 'cluster',
  reducers: {
    updateCluster: (state, action: PayloadAction<Cluster>) => ({ ...state, data: action.payload }),
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchClusterAsync.pending, (state) => ({
        ...state,
        uiState: ResourceUIState.LOADING,
      }))
      .addCase(fetchClusterAsync.fulfilled, (state, action) => ({
        ...state,
        data: action.payload as Cluster,
        uiState: ResourceUIState.LOADED,
      }))
      .addCase(fetchClusterAsync.rejected, (state) => ({
        ...state,
        uiState: ResourceUIState.ERROR,
      }));
  },
});

export const { updateCluster } = currentClusterSlice.actions;
export default currentClusterSlice.reducer;
