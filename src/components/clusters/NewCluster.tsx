import React, { useEffect, useCallback } from 'react';
import { Redirect, Link } from 'react-router-dom';
import { PageSectionVariants, ButtonVariant, Button } from '@patternfly/react-core';
import { uniqueNamesGenerator, Config, starWars } from 'unique-names-generator';
import _ from 'lodash';
import PageSection from '../ui/PageSection';
import { ErrorState, LoadingState } from '../ui/uiState';
import { postCluster } from '../../api/clusters';
import useApi from '../../api/useApi';
import { ResourceUIState } from '../../types';

const namesConfig: Config = {
  // dictionaries: [adjectives, colors, animals],
  dictionaries: [starWars],
  separator: '-',
  length: 1,
  style: 'lowerCase',
};

const NewCluster: React.FC = () => {
  const nameRef = React.useRef(_.kebabCase(uniqueNamesGenerator(namesConfig)));
  const [{ data: cluster, uiState }, createCluster] = useApi(
    postCluster,
    { name: nameRef.current },
    true,
  );

  // useEffect(() => {
  //   createCluster({})
  // })

  // const [uiState, setUiState] = React.useState('loading');
  // const [cluster, setCluster] = React.useState<Cluster>();

  // const createClusterAsync = async () => {
  //   try {
  //     setUiState('loading');
  //     const name = _.kebabCase(uniqueNamesGenerator(namesConfig));
  //     const { data } = await createCluster({ name });
  //     setCluster(data);
  //     setUiState('done');
  //   } catch (e) {
  //     setUiState('error');
  //     console.error(e);
  //     console.error(e.response?.data);
  //   }
  // };

  // useEffect(() => {
  //   createClusterAsync();
  // }, []);

  const cancel = (
    <Button
      key="cancel"
      variant={ButtonVariant.secondary}
      component={(props) => <Link to="/clusters" {...props} />}
    >
      Cancel
    </Button>
  );

  const errorState = (
    <PageSection variant={PageSectionVariants.light} isMain>
      <ErrorState
        title={'Failed to create new cluster'}
        fetchData={createCluster}
        actions={[cancel]}
      />
    </PageSection>
  );
  const loadingState = (
    <PageSection variant={PageSectionVariants.light} isMain>
      <LoadingState />
    </PageSection>
  );

  if (uiState === ResourceUIState.LOADING) return loadingState;
  if (uiState === ResourceUIState.ERROR) return errorState;
  if (cluster) return <Redirect to={`/clusters/${cluster.id}`} />;
  return <Redirect to="/clusters" />;
};

export default NewCluster;
