import React, { FC } from 'react';
import { ListItem, TextContent, Text } from '@patternfly/react-core';

interface ClusterWizardStepProps {
  index: number;
  title: string;
  currentStepIndex: number;
}

const ClusterWizardStep: FC<ClusterWizardStepProps> = ({
  index,
  title,
  currentStepIndex
}: ClusterWizardStepProps): JSX.Element => (
  <ListItem>
    <TextContent>
      <Text
        component="h1"
        style={currentStepIndex == index ? { color: 'red' } : undefined}
      >
        ({index}.) {title}
      </Text>
    </TextContent>
  </ListItem>
);

export default ClusterWizardStep;
