import * as React from 'react';
import { Tooltip } from '@patternfly/react-core';
import { OutlinedQuestionCircleIcon } from '@patternfly/react-icons';

import './help-tooltip.scss';

const HelpTooltip: React.FC<HelpTooltipProps> = ({ helperText }) =>
  helperText ? (
    <span className="help-tooltip">
      <Tooltip content={helperText} tippyProps={{ interactive: true }}>
        <OutlinedQuestionCircleIcon />
      </Tooltip>
    </span>
  ) : null;

export default HelpTooltip;

type HelpTooltipProps = {
  helperText: React.ReactNode;
};
