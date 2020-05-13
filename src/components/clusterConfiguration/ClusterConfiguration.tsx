import React from 'react';
import { Formik, FormikHelpers, FormikProps } from 'formik';
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
  Alert,
  AlertVariant,
  AlertActionCloseButton,
  TextInputTypes,
  TextVariants,
  Spinner,
  Breadcrumb,
  BreadcrumbItem,
} from '@patternfly/react-core';
import { ExternalLinkAltIcon, ExclamationCircleIcon } from '@patternfly/react-icons';
import { global_danger_color_100 as dangerColor } from '@patternfly/react-tokens';
import { useDispatch, useSelector } from 'react-redux';

import ClusterToolbar from '../clusters/ClusterToolbar';
import PageSection from '../ui/PageSection';
import { ToolbarButton, ToolbarText } from '../ui/Toolbar';
import { InputField, TextAreaField } from '../ui/formik';
import GridGap from '../ui/GridGap';
import { Cluster, ClusterUpdateParams } from '../../api/types';
import { patchCluster } from '../../api/clusters';
import { handleApiError } from '../../api/utils';
import { CLUSTER_MANAGER_SITE_LINK } from '../../config/constants';
import AlertsSection from '../ui/AlertsSection';
import { updateCluster } from '../../features/clusters/currentClusterSlice';
import BaremetalInventory from './BaremetalInventory';
import { nameValidationSchema, sshPublicKeyValidationSchema } from '../ui/formik/validationSchemas';
import { selectClusterNamesButCurrent } from '../../selectors/clusters';

interface ClusterConfigurationProps {
  cluster: Cluster;
}

const SshPublicKeyHelperText = () => (
  <div>
    SSH public key for debugging OpenShift nodes, value of <em>~/.ssh/id_rsa.pub</em> can be
    copy&amp;pasted here. To generate new pair, use <em>ssh-keygen -o</em>.
  </div>
);

const ClusterConfiguration: React.FC<ClusterConfigurationProps> = ({ cluster }) => {
  const dispatch = useDispatch();
  const clusterNames = useSelector(selectClusterNamesButCurrent);

  const initialValues: ClusterUpdateParams = {
    name: cluster.name || '',
    baseDnsDomain: cluster.baseDnsDomain || '',
    clusterNetworkCIDR: cluster.clusterNetworkCIDR || '',
    clusterNetworkHostPrefix: cluster.clusterNetworkHostPrefix || 0,
    serviceNetworkCIDR: cluster.serviceNetworkCIDR || '',
    apiVip: cluster.apiVip || '',
    dnsVip: cluster.dnsVip || '',
    ingressVip: cluster.ingressVip || '',
    pullSecret: cluster.pullSecret || '',
    sshPublicKey: cluster.sshPublicKey || '',
  };

  const validationSchema = React.useCallback(
    () =>
      Yup.object().shape({
        name: Yup.mixed()
          .test(
            'unique-name',
            'Name "${value}" is already taken.', // eslint-disable-line no-template-curly-in-string
            (value) => !clusterNames.includes(value),
          )
          .concat(nameValidationSchema),
        sshPublicKey: sshPublicKeyValidationSchema,
      }),
    [clusterNames],
  );

  const handleSubmit = async (
    values: ClusterUpdateParams,
    formikActions: FormikHelpers<ClusterUpdateParams>,
  ) => {
    try {
      const { data } = await patchCluster(cluster.id, values); // eslint-disable-line @typescript-eslint/no-non-null-assertion
      dispatch(updateCluster(data));
    } catch (e) {
      handleApiError<ClusterUpdateParams>(e, () =>
        formikActions.setStatus({ error: 'Failed to update the cluster' }),
      );
    }
  };

  return (
    <Formik
      initialValues={initialValues}
      initialStatus={{ error: null }}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
    >
      {({
        handleSubmit,
        setStatus,
        isSubmitting,
        isValid,
        submitForm,
        status,
      }: FormikProps<ClusterUpdateParams>) => (
        <>
          <PageSection variant={PageSectionVariants.light}>
            <Breadcrumb>
              <BreadcrumbItem>
                <Link to="/clusters">Clusters</Link>
              </BreadcrumbItem>
              <BreadcrumbItem isActive>{cluster.name}</BreadcrumbItem>
            </Breadcrumb>
          </PageSection>
          <PageSection variant={PageSectionVariants.light} isMain>
            <Form onSubmit={handleSubmit}>
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
                    <InputField
                      name="clusterNetworkCIDR"
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
                      name="serviceNetworkCIDR"
                      label="Service Network CIDR"
                      helperText="The IP address pool to use for service IP addresses. You can enter only one IP address pool. If you need to access the services from an external network, configure load balancers and routers to manage the traffic."
                      isRequired
                    />
                    <InputField
                      label="API Virtual IP"
                      name="apiVip"
                      helperText="Virtual IP used to reach the OpenShift cluster API."
                      isRequired
                    />
                    <InputField
                      name="dnsVip"
                      label="Internal DNS Virtual IP"
                      helperText="Virtual IP used internally by the cluster for automating internal DNS requirements."
                      isRequired
                    />
                    <InputField
                      name="ingressVip"
                      label="Ingress Virtual IP"
                      helperText="Virtual IP used for cluster ingress traffic."
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
                      helperText={<SshPublicKeyHelperText />}
                      isRequired
                    />
                  </GridGap>
                </GridItem>
              </Grid>
            </Form>
          </PageSection>
          <AlertsSection>
            {status.error && (
              <Alert
                variant={AlertVariant.danger}
                title={status.error}
                action={<AlertActionCloseButton onClose={() => setStatus({ error: null })} />}
              />
            )}
          </AlertsSection>
          <ClusterToolbar>
            <ToolbarButton
              variant={ButtonVariant.link}
              component={(props) => <Link to="/clusters" {...props} />}
            >
              Close
            </ToolbarButton>
            <ToolbarButton
              type="submit"
              variant={ButtonVariant.secondary}
              isDisabled={isSubmitting || !isValid}
              onClick={submitForm}
            >
              Save Configuration
            </ToolbarButton>
            <ToolbarButton variant={ButtonVariant.primary} isDisabled>
              Deploy cluster
            </ToolbarButton>
            {isSubmitting && (
              <ToolbarText component={TextVariants.small}>
                <Spinner size="sm" /> Saving...
              </ToolbarText>
            )}
            {!isValid && (
              <ToolbarText component={TextVariants.small}>
                <ExclamationCircleIcon color={dangerColor.value} /> There are validation errors.
              </ToolbarText>
            )}
          </ClusterToolbar>
        </>
      )}
    </Formik>
  );
};

export default ClusterConfiguration;
