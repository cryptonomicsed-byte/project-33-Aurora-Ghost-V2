import React from 'react';
import { NebulaCommand, HapticType } from '../types';

interface NebulaProps {
  command: NebulaCommand | null;
  onHaptic: (type: HapticType) => void;
}

export const Nebula: React.FC<NebulaProps> = ({ command, onHaptic }) => {
  return (
    <group>
      <mesh position={[0, 0, 0]}>
        <sphereGeometry args={[2, 32, 32]} />
        <meshBasicMaterial wireframe color="#00ffff" />
      </mesh>
    </group>
  );
};
