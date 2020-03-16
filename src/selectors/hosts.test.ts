import { RootState } from '../store/rootReducer';
import { getHostTableRows } from './hosts';

const state: RootState = {
  hosts: {
    hosts: [
      {
        metadata: {
          name: 'host-01',
        },
        spec: {
          online: true,
          bmc: {
            ip: '192.168.10.1',
          },
        },
        status: {
          hardware: {
            cpus: [{}],
            ramGiB: 128,
            storage: [
              {
                sizeGiB: 1024,
              },
            ],
          },
        },
      },
    ],
    loading: false,
  },
};

describe('hosts selectors', () => {
  it('provides a selector to return hosts data as table rows', () => {
    const expectedTableRows = [['host-01', '192.168.10.1', 'Online', '1', '128', '1024', 'Master']];
    expect(getHostTableRows(state)).toEqual(expectedTableRows);
  });
});
