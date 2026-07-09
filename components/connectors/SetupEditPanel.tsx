'use client';

import React from 'react';
import AdvancedSetupPanel from './AdvancedSetupPanel';
import type { Connector } from '@/lib/types';

type SetupEditPanelProps = {
  connectorType?: string;
  existingConnector?: Connector;
  onClose: () => void;
  onSwitchToSimple?: () => void;
  embedded?: boolean;
};

export default function SetupEditPanel(props: SetupEditPanelProps) {
  return <AdvancedSetupPanel {...props} />;
}
