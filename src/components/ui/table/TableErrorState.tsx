import React from 'react';
import {
  Title,
  EmptyState,
  EmptyStateBody,
  Bullseye,
  EmptyStateIcon,
  IconProps,
  EmptyStateVariant,
} from '@patternfly/react-core';
import { ExclamationCircleIcon } from '@patternfly/react-icons';
import { global_danger_color_200 as globalDangerColor200 } from '@patternfly/react-tokens';

type Props = {
  title?: string;
  content?: React.ReactNode;
  icon?: string | React.FC<IconProps>;
  iconColor?: string;
};

const TableErrorState: React.FC<Props> = ({
  title = 'Error loading data',
  content = 'There was an error retrieving data. Check your connection and try again.',
  icon = ExclamationCircleIcon,
  iconColor = globalDangerColor200.value,
}) => (
  <Bullseye>
    <EmptyState variant={EmptyStateVariant.small}>
      <EmptyStateIcon icon={icon} color={iconColor} />
      <Title size="lg">{title}</Title>
      <EmptyStateBody>{content}</EmptyStateBody>
    </EmptyState>
  </Bullseye>
);

export default TableErrorState;
