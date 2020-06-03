import React from 'react';
import _ from 'lodash';
import { Formik, FormikProps, FormikHelpers } from 'formik';
import * as Yup from 'yup';
import { Link } from 'react-router-dom';
import {
  Form,
  PageSectionVariants,
  TextContent,
  Text,
  ButtonVariant,
  Grid,
  GridItem,
  TextInputTypes,
  TextVariants,
  Spinner,
} from '@patternfly/react-core';
import { ExternalLinkAltIcon, ExclamationCircleIcon } from '@patternfly/react-icons';
import { global_danger_color_100 as dangerColor } from '@patternfly/react-tokens';
import { useDispatch } from 'react-redux';
import { Netmask } from 'netmask';

import ClusterToolbar from '../clusters/ClusterToolbar';
import PageSection from '../ui/PageSection';
import { ToolbarButton, ToolbarText } from '../ui/Toolbar';
import { InputField, TextAreaField, SelectField } from '../ui/formik';
import GridGap from '../ui/GridGap';
import { Cluster, ClusterUpdateParams, Inventory } from '../../api/types';
import { patchCluster, postInstallCluster, getClusters } from '../../api/clusters';
import { handleApiError, stringToJSON } from '../../api/utils';
import { CLUSTER_MANAGER_SITE_LINK } from '../../config/constants';
import AlertsSection from '../ui/AlertsSection';
import { updateCluster } from '../../features/clusters/currentClusterSlice';
import alertsReducer, {
  addAlert,
  AlertProps,
  removeAlert,
} from '../../features/alerts/alertsSlice';
import BaremetalInventory from './BaremetalInventory';
import {
  nameValidationSchema,
  sshPublicKeyValidationSchema,
  validJSONSchema,
  ipValidationSchema,
  ipBlockValidationSchema,
  dnsNameValidationSchema,
  hostPrefixValidationSchema,
} from '../ui/formik/validationSchemas';
import ClusterBreadcrumbs from '../clusters/ClusterBreadcrumbs';
import ClusterEvents from '../fetching/ClusterEvents';

type HostSubnets = {
  subnet: Netmask;
  hostIDs: string[];
  humanized: string;
}[];

type ClusterConfigurationValues = ClusterUpdateParams & {
  hostSubnet: string;
};

const requiredSchema = Yup.mixed().required('Required to install the cluster.');

const validationSchema = Yup.object().shape({
  name: nameValidationSchema,
  baseDnsDomain: dnsNameValidationSchema,
  clusterNetworkHostPrefix: hostPrefixValidationSchema,
  clusterNetworkCidr: ipBlockValidationSchema,
  serviceNetworkCidr: ipBlockValidationSchema,
  apiVip: ipValidationSchema,
  ingressVip: ipValidationSchema,
  pullSecret: validJSONSchema,
  sshPublicKey: sshPublicKeyValidationSchema,
});

const installValidationSchema = Yup.object().shape({
  name: nameValidationSchema,
  baseDnsDomain: requiredSchema.concat(dnsNameValidationSchema),
  clusterNetworkHostPrefix: requiredSchema.concat(hostPrefixValidationSchema),
  clusterNetworkCidr: requiredSchema.concat(ipBlockValidationSchema),
  serviceNetworkCidr: requiredSchema.concat(ipBlockValidationSchema),
  apiVip: requiredSchema.concat(ipValidationSchema),
  ingressVip: requiredSchema.concat(ipValidationSchema),
  pullSecret: requiredSchema.concat(validJSONSchema),
  sshPublicKey: requiredSchema.concat(sshPublicKeyValidationSchema),
});

const sshPublicKeyHelperText = (
  <>
    SSH public key for debugging OpenShift nodes, value of <em>~/.ssh/id_rsa.pub</em> can be
    copy&amp;pasted here. To generate new pair, use <em>ssh-keygen -o</em>.
  </>
);

const validateVIP = (
  hostSubnets: HostSubnets,
  values: ClusterConfigurationValues,
  value: string,
) => {
  const { subnet } = hostSubnets.find((hn) => hn.humanized === values.hostSubnet) || {};
  const valid = subnet?.contains(value) && value !== subnet?.broadcast && value !== subnet?.base;
  return valid ? undefined : 'IP Address is outside of selected subnet';
};

const findMatchingSubnet = (
  ingressVip: string | undefined,
  apiVip: string | undefined,
  hostSubnets: HostSubnets,
): string => {
  let matchingSubnet;
  if (hostSubnets.length) {
    if (!ingressVip && !apiVip) {
      matchingSubnet = hostSubnets[0];
    } else {
      matchingSubnet = hostSubnets.find((hn) => {
        let found = true;
        if (ingressVip) {
          found = found && hn.subnet.contains(ingressVip);
        }
        if (apiVip) {
          found = found && hn.subnet.contains(apiVip);
        }
        return found;
      });
    }
  }
  return matchingSubnet ? matchingSubnet.humanized : 'No subnets available';
};

type ClusterConfigurationProps = {
  cluster: Cluster;
};

const ClusterConfiguration: React.FC<ClusterConfigurationProps> = ({ cluster }) => {
  const [submitType, setSubmitType] = React.useState('save');
  const dispatch = useDispatch();
  const [alerts, dispatchAlertsAction] = React.useReducer(alertsReducer, []);

  const hostnameMap: { [id: string]: string } =
    cluster.hosts?.reduce((acc, host) => {
      const inventory = stringToJSON<Inventory>(host.inventory) || {};
      acc = {
        ...acc,
        [host.id]: inventory.hostname,
      };
      return acc;
    }, {}) || {};

  const hostSubnets: HostSubnets =
    cluster.hostNetworks?.map((hn) => {
      const subnet = new Netmask(hn.cidr as string);
      return {
        subnet,
        hostIDs: hn.hostIds?.map((id) => hostnameMap[id] || id) || [],
        humanized: `${subnet.first}-${subnet.last}`,
      };
    }) || [];

  const initialValues: ClusterConfigurationValues = {
    name: cluster.name || '',
    baseDnsDomain: cluster.baseDnsDomain || '',
    clusterNetworkCidr: cluster.clusterNetworkCidr || '',
    clusterNetworkHostPrefix: cluster.clusterNetworkHostPrefix || 0,
    serviceNetworkCidr: cluster.serviceNetworkCidr || '',
    apiVip: cluster.apiVip || '',
    ingressVip: cluster.ingressVip || '',
    pullSecret: cluster.pullSecret || '',
    sshPublicKey: cluster.sshPublicKey || '',
    hostSubnet: findMatchingSubnet(cluster.ingressVip, cluster.apiVip, hostSubnets),
  };

  const handleSubmit = async (
    values: ClusterConfigurationValues,
    formikActions: FormikHelpers<ClusterConfigurationValues>,
  ) => {
    // async validation for cluster name - run only on submit
    try {
      const { data: clusters } = await getClusters();
      const names = clusters.map((c) => c.name).filter((n) => n !== cluster.name);
      if (names.includes(values.name)) {
        return formikActions.setFieldError('name', `Name "${values.name}" is already taken.`);
      }
    } catch (e) {
      console.error('Failed to perform unique cluster name validation.', e);
    }

    // update the cluster validation
    try {
      const { data } = await patchCluster(cluster.id, values);
      dispatch(updateCluster(data));
    } catch (e) {
      handleApiError<ClusterUpdateParams>(e, () =>
        dispatchAlertsAction(
          addAlert({ title: 'Failed to update the cluster', message: e.response?.data?.reason }),
        ),
      );
    }

    // start cluster installation
    if (submitType === 'install') {
      try {
        const { data } = await postInstallCluster(cluster.id);
        dispatch(updateCluster(data));
      } catch (e) {
        handleApiError(e, () =>
          dispatchAlertsAction(
            addAlert({
              title: 'Failed to start cluster installation',
              message: e.response?.data?.reason,
            }),
          ),
        );
      }
    }
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={submitType === 'install' ? installValidationSchema : validationSchema}
      onSubmit={handleSubmit}
      initialTouched={_.mapValues(initialValues, () => true)}
      validateOnMount
    >
      {({
        isSubmitting,
        isValid,
        submitForm,
        setFieldValue,
        values,
        validateField,
      }: FormikProps<ClusterConfigurationValues>) => {
        // TODO(jtomasek): refactor this into ClusterConfigurationForm component and wrap handleSubmit in React.useCallback
        const handleSubmitButtonClick = async (e: React.MouseEvent) => {
          // NOTE(jtomasek): await is not exactly expected here but does the job of ensuring that
          // submitType is updated when we call submitForm
          await setSubmitType((e.target as HTMLButtonElement).name);
          submitForm();
        };
        if (hostSubnets.length && !hostSubnets.find((hn) => hn.humanized === values.hostSubnet)) {
          setFieldValue(
            'hostSubnet',
            findMatchingSubnet(cluster.ingressVip, cluster.apiVip, hostSubnets),
          );
        }
        return (
          <>
            <ClusterBreadcrumbs clusterName={cluster.name} />
            <PageSection variant={PageSectionVariants.light} isMain>
              <Form>
                <Grid gutter="md">
                  <GridItem span={12} lg={10} xl={6}>
                    {/* TODO(jtomasek): remove this if we're not putting full width content here (e.g. hosts table)*/}
                    <GridGap>
                      <TextContent>
                        <Text component="h1">Configure a bare metal OpenShift cluster</Text>
                      </TextContent>
                      <InputField label="Cluster Name" name="name" isRequired />
                      <InputField
                        label="Base DNS domain"
                        name="baseDnsDomain"
                        helperText="The base domain of the cluster. All DNS records must be sub-domains of this base and include the cluster name."
                        isRequired
                      />
                    </GridGap>
                  </GridItem>
                  <GridItem span={12}>
                    <BaremetalInventory cluster={cluster} />
                  </GridItem>
                  <GridItem span={12} lg={10} xl={6}>
                    <GridGap>
                      <TextContent>
                        <Text component="h2">Networking</Text>
                      </TextContent>
                      <SelectField
                        name="hostSubnet"
                        label="Available subnets"
                        options={
                          hostSubnets.length
                            ? hostSubnets.map((hn) => ({
                                label: hn.humanized,
                                value: hn.humanized,
                              }))
                            : [{ label: 'No subnets available', value: 'nosubnets' }]
                        }
                        getHelperText={(value) => {
                          const matchingSubnet = hostSubnets.find((hn) => hn.humanized === value);
                          return matchingSubnet
                            ? `Subnet is available on hosts: ${matchingSubnet.hostIDs.join(', ')}`
                            : undefined;
                        }}
                        onChange={() => {
                          validateField('ingressVip');
                          validateField('apiVip');
                        }}
                        isRequired
                      />
                      <InputField
                        label="API Virtual IP"
                        name="apiVip"
                        helperText="Virtual IP used to reach the OpenShift cluster API."
                        isRequired
                        isDisabled={!hostSubnets.length}
                        validate={(value: string) => validateVIP(hostSubnets, values, value)}
                      />
                      <InputField
                        name="ingressVip"
                        label="Ingress Virtual IP"
                        helperText="Virtual IP used for cluster ingress traffic."
                        isRequired
                        isDisabled={!hostSubnets.length}
                        validate={(value: string) => validateVIP(hostSubnets, values, value)}
                      />
                      <TextContent>
                        <Text component="h2">Advanced Networking</Text>
                      </TextContent>
                      <InputField
                        name="clusterNetworkCidr"
                        label="Cluster Network CIDR"
                        helperText="IP address block from which Pod IPs are allocated This block must not overlap with existing physical networks. These IP addresses are used for the Pod network, and if you need to access the Pods from an external network, configure load balancers and routers to manage the traffic."
                        isRequired
                      />
                      <InputField
                        name="clusterNetworkHostPrefix"
                        label="Cluster Network Host Prefix"
                        type={TextInputTypes.number}
                        helperText="The subnet prefix length to assign to each individual node. For example, if Cluster Network Host Prefix is set to 23, then each node is assigned a /23 subnet out of the given cidr (clusterNetworkCIDR), which allows for 510 (2^(32 - 23) - 2) pod IPs addresses. If you are required to provide access to nodes from an external network, configure load balancers and routers to manage the traffic."
                        isRequired
                      />
                      <InputField
                        name="serviceNetworkCidr"
                        label="Service Network CIDR"
                        helperText="The IP address pool to use for service IP addresses. You can enter only one IP address pool. If you need to access the services from an external network, configure load balancers and routers to manage the traffic."
                        isRequired
                      />
                      <TextContent>
                        <Text component="h2">Security</Text>
                      </TextContent>
                      <TextAreaField
                        name="pullSecret"
                        label="Pull Secret"
                        helperText={
                          <>
                            The pull secret obtained from the Pull Secret page on the{' '}
                            {
                              <a
                                href={CLUSTER_MANAGER_SITE_LINK}
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                Red Hat OpenShift Cluster Manager site <ExternalLinkAltIcon />
                              </a>
                            }
                            .
                          </>
                        }
                        isRequired
                      />
                      <TextAreaField
                        name="sshPublicKey"
                        label="SSH Public Key"
                        helperText={sshPublicKeyHelperText}
                        isRequired
                      />
                    </GridGap>
                  </GridItem>
                  <GridItem span={12} lg={10} xl={6}>
                    <TextContent>
                      <Text component="h2">Events</Text>
                    </TextContent>
                    <ClusterEvents entityId={cluster.id} />
                  </GridItem>
                </Grid>
              </Form>
            </PageSection>
            <AlertsSection
              alerts={alerts}
              onClose={(alert: AlertProps) => dispatchAlertsAction(removeAlert(alert.key))}
            />
            <ClusterToolbar>
              <ToolbarButton
                variant={ButtonVariant.primary}
                name="install"
                onClick={handleSubmitButtonClick}
                isDisabled={isSubmitting || !isValid}
              >
                Create Cluster
              </ToolbarButton>
              <ToolbarButton
                type="submit"
                name="save"
                variant={ButtonVariant.secondary}
                isDisabled={isSubmitting || !isValid}
                onClick={handleSubmitButtonClick}
              >
                Save Draft
              </ToolbarButton>
              <ToolbarButton
                variant={ButtonVariant.link}
                component={(props) => <Link to="/clusters" {...props} />}
              >
                Close
              </ToolbarButton>
              {isSubmitting && (
                <ToolbarText component={TextVariants.small}>
                  <Spinner size="sm" />{' '}
                  {submitType === 'save' ? 'Saving...' : 'Validating & starting installation...'}
                </ToolbarText>
              )}
              {!isValid && (
                <ToolbarText component={TextVariants.small}>
                  <ExclamationCircleIcon color={dangerColor.value} /> There are validation errors.
                </ToolbarText>
              )}
            </ClusterToolbar>
          </>
        );
      }}
    </Formik>
  );
};

export default ClusterConfiguration;
