import { createSelector } from 'reselect';

import {
  MIN_DISK_SPACE_GB,
  MIN_RAM_GB,
  MIN_CPUS
} from '../constants/validations';

import { RootState } from '../store/rootReducer';
import { Host } from '../models/hosts';
import {
  IntrospectionData,
  IntrospectionDataState
} from '../models/introspectionData';
import { ValidationError, ValidationErrors } from '../models/validations';
import { getHosts } from './hosts';

export const getIntrospectionData = (
  state: RootState
): IntrospectionDataState => state.hosts.introspectionData;

export const getHostValidationErrors = createSelector(
  getHosts,
  getIntrospectionData,
  (hosts: Host[], introspectionData: IntrospectionDataState) => {
    let validationErrors: ValidationErrors = {};
    hosts.map(host => {
      validationErrors[host.name] = [];
      hostIntrospectionValidators.map(validator => {
        let validationResult = validator(host, introspectionData[host.name]);
        if (validationResult !== true) {
          validationErrors[host.name].push(validationResult);
        }
      });
    });
    return validationErrors;
  }
);

// Array of validators.
// Make sure all host introspection validators have the same signature
interface HostIntrospectionValidator {
  (host: Host, introspectionData?: IntrospectionData): ValidationError | true;
}
let hostIntrospectionValidators: HostIntrospectionValidator[] = [];

// Add disk space validation to list of validators
hostIntrospectionValidators.push((host, introspectionData) => {
  const GB_TO_B_FACTOR = 1073741824;
  if (!!introspectionData) {
    let passed: boolean = false;
    introspectionData.inventory.disks.map(disk => {
      if (disk.size >= MIN_DISK_SPACE_GB * GB_TO_B_FACTOR) {
        passed = true;
      }
    });
    return passed || {
      name: 'No disk with sufficient space found.',
      message: `${
        host.name
      }: No disk found that fits the minimum requirement of ${MIN_DISK_SPACE_GB}GB.`
    };
  }
  return true;
});
