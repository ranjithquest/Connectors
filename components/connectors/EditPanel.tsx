import type { Connector } from '@/lib/types';
import AdvancedSetupPanel from './AdvancedSetupPanel';

interface EditPanelProps {
  connector: Connector;
  onClose: () => void;
}

export default function EditPanel({ connector, onClose }: EditPanelProps) {
  return <AdvancedSetupPanel existingConnector={connector} onClose={onClose} />;
}
