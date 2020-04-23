import React from 'react';
import PageSection from '../ui/PageSection';

const AlertsSection: React.FC = ({ children }) => (
  <PageSection noPadding>
    <div style={{ position: 'absolute', padding: 20, bottom: 0, width: '100%' }}>{children}</div>
  </PageSection>
);

export default AlertsSection;
