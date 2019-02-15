import { RootState } from '../store/rootReducer';
import { getHostTableRows } from './hosts';

const state: RootState = {
  hosts: {
    hosts: [
      {
        name: 'host-01',
        ip: '192.168.10.1',
        status: 'Enroll',
        cpu: '25',
        memory: '128',
        disk: '1024',
        type: 'Master'
      }
    ],
    loading: false
  }
};

describe('hosts selectors', () => {
  it('provides a selector to return hosts data as table rows', () => {
    const expectedTableRows = [
      ['host-01', '192.168.10.1', 'Enroll', '25', '128', '1024', 'Master']
    ];
    expect(getHostTableRows(state)).toEqual(expectedTableRows);
  });
});
