import React from 'react';
import { Formik, FormikProps, FormikHelpers } from 'formik';
import * as Yup from 'yup';
import { Link } from 'react-router-dom';
import _ from 'lodash';
import {
  Form,
  PageSectionVariants,
  TextContent,
  Text,
  ButtonVariant,
  Grid,
  GridItem,
  TextVariants,
  Spinner,
} from '@patternfly/react-core';
import { ExternalLinkAltIcon, ExclamationCircleIcon } from '@patternfly/react-icons';
import { global_danger_color_100 as dangerColor } from '@patternfly/react-tokens';
import { useDispatch } from 'react-redux';
import { Netmask } from 'netmask';

import ClusterToolbar from '../clusters/ClusterToolbar';
import PageSection from '../ui/PageSection';
import { InputField, TextAreaField, TextAreaSecretField } from '../ui/formik';
import { ToolbarButton, ToolbarText, ToolbarSecondaryGroup } from '../ui/Toolbar';
import GridGap from '../ui/GridGap';
import { EventsModalButton } from '../ui/eventsModal';
import { Cluster, ClusterUpdateParams, Inventory } from '../../api/types';
import { patchCluster, postInstallCluster, getClusters } from '../../api/clusters';
import { handleApiError, stringToJSON, getErrorMessage } from '../../api/utils';
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
  ipBlockValidationSchema,
  dnsNameValidationSchema,
  hostPrefixValidationSchema,
  vipValidationSchema,
  pullSecretKnownOrRequired,
} from '../ui/formik/validationSchemas';
import ClusterBreadcrumbs from '../clusters/ClusterBreadcrumbs';
import { HostSubnets, ClusterConfigurationValues } from '../../types/clusters';
import NetworkConfiguration from './NetworkConfiguration';

const requiredSchema = Yup.mixed().required('Required to install the cluster.');

const validationSchema = (hostSubnets: HostSubnets) =>
  Yup.lazy<ClusterConfigurationValues>((values) =>
    Yup.object<ClusterConfigurationValues>().shape({
      name: nameValidationSchema,
      baseDnsDomain: dnsNameValidationSchema,
      clusterNetworkHostPrefix: hostPrefixValidationSchema,
      clusterNetworkCidr: ipBlockValidationSchema,
      serviceNetworkCidr: ipBlockValidationSchema,
      apiVip: vipValidationSchema(hostSubnets, values),
      ingressVip: vipValidationSchema(hostSubnets, values),
      pullSecret: validJSONSchema,
      sshPublicKey: sshPublicKeyValidationSchema,
    }),
  );

const installValidationSchema = (hostSubnets: HostSubnets) =>
  Yup.lazy<ClusterConfigurationValues>((values) =>
    Yup.object<ClusterConfigurationValues>().shape({
      name: nameValidationSchema,
      baseDnsDomain: requiredSchema.concat(dnsNameValidationSchema),
      clusterNetworkHostPrefix: requiredSchema.concat(hostPrefixValidationSchema),
      clusterNetworkCidr: requiredSchema.concat(ipBlockValidationSchema),
      serviceNetworkCidr: requiredSchema.concat(ipBlockValidationSchema),
      apiVip: requiredSchema.concat(vipValidationSchema(hostSubnets, values)),
      ingressVip: requiredSchema.concat(vipValidationSchema(hostSubnets, values)),
      pullSecret: validJSONSchema.concat(pullSecretKnownOrRequired(values)),
      sshPublicKey: sshPublicKeyValidationSchema,
    }),
  );

const sshPublicKeyHelperText = (
  <>
    SSH public key for debugging OpenShift nodes, value of <em>~/.ssh/id_rsa.pub</em> can be
    copy&amp;pasted here. To generate new pair, use <em>ssh-keygen -o</em>.
  </>
);

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
  const [isPullSecretEdit, setPullSecretEdit] = React.useState(!cluster.pullSecretSet);

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
    pullSecret: '',
    sshPublicKey: cluster.sshPublicKey || '',
    pullSecretSet: !!cluster.pullSecretSet, // private (read-only), for validations only, set by backend
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
      const params = isPullSecretEdit ? values : _.omit(values, ['pullSecret']);
      const { data } = await patchCluster(cluster.id, params);
      formikActions.resetForm({ values });
      dispatch(updateCluster(data));
      setPullSecretEdit(false);
    } catch (e) {
      handleApiError<ClusterUpdateParams>(e, () =>
        dispatchAlertsAction(
          addAlert({ title: 'Failed to update the cluster', message: getErrorMessage(e) }),
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
              message: getErrorMessage(e),
            }),
          ),
        );
      }
    }
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={
        submitType === 'install'
          ? installValidationSchema(hostSubnets)
          : validationSchema(hostSubnets)
      }
      onSubmit={handleSubmit}
      // initialTouched={_.mapValues(initialValues, () => true)}
      validateOnMount
    >
      {({
        isSubmitting,
        isValid,
        dirty,
        submitForm,
        setFieldValue,
        values,
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
        const onPullSecretToggle = (isHidden: boolean) => {
          if (isHidden) {
            setPullSecretEdit(false);
          } else {
            setPullSecretEdit(true);
            setFieldValue('pullSecret', '', false);
          }
        };

        return (
          <>
            <ClusterBreadcrumbs clusterName={cluster.name} />
            <PageSection variant={PageSectionVariants.light} isMain>
              <Form>
                <Grid hasGutter>
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
                      <NetworkConfiguration hostSubnets={hostSubnets} />
                      <TextContent>
                        <Text component="h2">Security</Text>
                      </TextContent>
                      <TextAreaSecretField
                        name="pullSecret"
                        label="Pull Secret"
                        isSet={cluster.pullSecretSet}
                        isEdit={isPullSecretEdit}
                        onToggle={onPullSecretToggle}
                        helperTextHidden="The pull secret is already set and its value will not be shown for security reasons."
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
                      />
                    </GridGap>
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
                Install Cluster
              </ToolbarButton>
              <ToolbarButton
                type="submit"
                name="save"
                variant={ButtonVariant.secondary}
                isDisabled={isSubmitting || !isValid || !dirty}
                onClick={handleSubmitButtonClick}
              >
                Save Changes
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
              <ToolbarSecondaryGroup>
                <EventsModalButton
                  entityKind="cluster"
                  entityId={cluster.id}
                  title="Cluster Events"
                  variant={ButtonVariant.link}
                  style={{ textAlign: 'right' }}
                >
                  View Cluster Events History
                </EventsModalButton>
              </ToolbarSecondaryGroup>
            </ClusterToolbar>
          </>
        );
      }}
    </Formik>
  );
};

export default ClusterConfiguration;
