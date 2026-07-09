import type { Connector } from '@/lib/types';
import AdvancedSetupPanel from './AdvancedSetupPanel';

interface EditPanelProps {
  connector: Connector;
  onClose: () => void;
  initialFieldFocus?: { tab: string; fieldId: string };
}

export default function EditPanel({ connector, onClose, initialFieldFocus }: EditPanelProps) {
  return <AdvancedSetupPanel existingConnector={connector} onClose={onClose} initialFieldFocus={initialFieldFocus} />;
}
