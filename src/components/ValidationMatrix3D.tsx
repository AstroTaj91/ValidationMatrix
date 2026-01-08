import { useRef, useState } from 'react';
import { Canvas, useFrame, ThreeEvent } from '@react-three/fiber';
import { OrbitControls, Text, Html, PerspectiveCamera, Line } from '@react-three/drei';
import * as THREE from 'three';
import type { IdeaPoint } from '@shared/types';

interface ValidationMatrix3DProps {
    ideas: IdeaPoint[];
    onIdeaClick?: (ideaId: number) => void;
    selectedId?: number | null;
}

/**
 * 3D Axes component with labels
 */
function Axes() {
    const axisLength = 110;
    const tickCount = 4;

    return (
        <group>
            {/* X Axis - Time (Red) */}
            <Line
                points={[[0, 0, 0], [axisLength, 0, 0]]}
                color="#ef4444"
                lineWidth={2}
            />
            <Text
                position={[axisLength + 8, 0, 0]}
                fontSize={6}
                color="#ef4444"
                anchorX="left"
            >
                Time →
            </Text>
            <Text
                position={[axisLength + 8, -4, 0]}
                fontSize={3}
                color="#94a3b8"
                anchorX="left"
            >
                (Lower is better)
            </Text>

            {/* Y Axis - Money (Yellow) */}
            <Line
                points={[[0, 0, 0], [0, axisLength, 0]]}
                color="#f59e0b"
                lineWidth={2}
            />
            <Text
                position={[0, axisLength + 8, 0]}
                fontSize={6}
                color="#f59e0b"
                anchorX="center"
            >
                Money ↑
            </Text>
            <Text
                position={[0, axisLength + 4, 0]}
                fontSize={3}
                color="#94a3b8"
                anchorX="center"
            >
                (Lower is better)
            </Text>

            {/* Z Axis - Opportunity (Green) */}
            <Line
                points={[[0, 0, 0], [0, 0, axisLength]]}
                color="#22c55e"
                lineWidth={2}
            />
            <Text
                position={[0, 0, axisLength + 8]}
                fontSize={6}
                color="#22c55e"
                anchorX="center"
            >
                Opportunity →
            </Text>
            <Text
                position={[0, -4, axisLength + 8]}
                fontSize={3}
                color="#94a3b8"
                anchorX="center"
            >
                (Higher is better)
            </Text>

            {/* Tick marks and labels */}
            {Array.from({ length: tickCount }, (_, i) => {
                const value = ((i + 1) * 100) / tickCount;
                const pos = ((i + 1) * axisLength) / tickCount;
                return (
                    <group key={i}>
                        {/* X axis ticks */}
                        <Line points={[[pos, -2, 0], [pos, 2, 0]]} color="#475569" lineWidth={1} />
                        <Text position={[pos, -6, 0]} fontSize={3} color="#64748b" anchorX="center">
                            {value}
                        </Text>

                        {/* Y axis ticks */}
                        <Line points={[[-2, pos, 0], [2, pos, 0]]} color="#475569" lineWidth={1} />
                        <Text position={[-6, pos, 0]} fontSize={3} color="#64748b" anchorX="right">
                            {value}
                        </Text>

                        {/* Z axis ticks */}
                        <Line points={[[0, -2, pos], [0, 2, pos]]} color="#475569" lineWidth={1} />
                        <Text position={[0, -6, pos]} fontSize={3} color="#64748b" anchorX="center">
                            {value}
                        </Text>
                    </group>
                );
            })}

            {/* Grid planes */}
            <gridHelper args={[100, 10, '#1e293b', '#1e293b']} position={[50, 0, 50]} />
        </group>
    );
}

interface IdeaSphereProps {
    idea: IdeaPoint;
    onClick?: () => void;
    isSelected?: boolean;
}

/**
 * Interactive sphere representing an idea
 */
function IdeaSphere({ idea, onClick, isSelected }: IdeaSphereProps) {
    const meshRef = useRef<THREE.Mesh>(null);
    const [hovered, setHovered] = useState(false);

    // Position based on scores
    const position: [number, number, number] = [
        idea.timeScore,
        idea.moneyScore,
        idea.opportunityScore,
    ];

    // Animate on hover
    useFrame(() => {
        if (meshRef.current) {
            const scale = hovered || isSelected ? 1.3 : 1;
            meshRef.current.scale.lerp(new THREE.Vector3(scale, scale, scale), 0.1);
        }
    });

    const handlePointerOver = (e: ThreeEvent<PointerEvent>) => {
        e.stopPropagation();
        setHovered(true);
        document.body.style.cursor = 'pointer';
    };

    const handlePointerOut = () => {
        setHovered(false);
        document.body.style.cursor = 'auto';
    };

    const handleClick = (e: ThreeEvent<MouseEvent>) => {
        e.stopPropagation();
        onClick?.();
    };

    // Calculate quality score (opportunity high, time/money low is good)
    const qualityScore = idea.opportunityScore - (idea.timeScore + idea.moneyScore) / 2;
    const sphereColor = qualityScore > 30 ? '#22c55e' : qualityScore > 0 ? '#f59e0b' : '#ef4444';

    return (
        <group position={position}>
            <mesh
                ref={meshRef}
                onPointerOver={handlePointerOver}
                onPointerOut={handlePointerOut}
                onClick={handleClick}
            >
                <sphereGeometry args={[3, 32, 32]} />
                <meshStandardMaterial
                    color={hovered || isSelected ? '#3b82f6' : sphereColor}
                    emissive={hovered || isSelected ? '#3b82f6' : sphereColor}
                    emissiveIntensity={hovered || isSelected ? 0.5 : 0.2}
                    metalness={0.3}
                    roughness={0.4}
                />
            </mesh>

            {/* Tooltip on hover */}
            {hovered && (
                <Html distanceFactor={15} style={{ pointerEvents: 'none' }}>
                    <div className="bg-background/95 backdrop-blur-lg border border-white/20 rounded-lg p-3 shadow-xl min-w-[180px]">
                        <p className="font-semibold text-sm text-foreground mb-2 line-clamp-2">
                            {idea.title}
                        </p>
                        <div className="space-y-1 text-xs">
                            <div className="flex justify-between">
                                <span className="text-red-400">Time:</span>
                                <span className="font-medium">{idea.timeScore}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-yellow-400">Money:</span>
                                <span className="font-medium">{idea.moneyScore}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-green-400">Opportunity:</span>
                                <span className="font-medium">{idea.opportunityScore}</span>
                            </div>
                        </div>
                        <p className="text-xs text-muted-foreground mt-2">Click for details</p>
                    </div>
                </Html>
            )}
        </group>
    );
}

/**
 * Optimal zone indicator (low time, low money, high opportunity)
 */
function OptimalZone() {
    return (
        <mesh position={[15, 15, 85]} renderOrder={-1}>
            <sphereGeometry args={[20, 32, 32]} />
            <meshBasicMaterial
                color="#22c55e"
                transparent
                opacity={0.08}
                depthWrite={false}
            />
        </mesh>
    );
}

/**
 * Main 3D Visualization Component
 */
export function ValidationMatrix3D({ ideas, onIdeaClick, selectedId }: ValidationMatrix3DProps) {
    return (
        <div className="w-full h-full min-h-[500px] rounded-xl overflow-hidden bg-slate-950/50 border border-white/10">
            <Canvas>
                <PerspectiveCamera makeDefault position={[150, 120, 150]} fov={50} />
                <ambientLight intensity={0.4} />
                <pointLight position={[100, 100, 100]} intensity={1} />
                <pointLight position={[-50, 50, 50]} intensity={0.5} color="#3b82f6" />

                <Axes />
                <OptimalZone />

                {ideas.map((idea) => (
                    <IdeaSphere
                        key={idea.id}
                        idea={idea}
                        onClick={() => onIdeaClick?.(idea.id)}
                        isSelected={selectedId === idea.id}
                    />
                ))}

                <OrbitControls
                    enableDamping
                    dampingFactor={0.05}
                    minDistance={50}
                    maxDistance={400}
                    target={[50, 50, 50]}
                />
            </Canvas>

            {/* Legend */}
            <div className="absolute bottom-4 left-4 bg-background/80 backdrop-blur-lg rounded-lg p-3 border border-white/10">
                <p className="text-xs font-medium mb-2">Optimal Zone</p>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <div className="w-3 h-3 rounded-full bg-green-500/30 border border-green-500/50" />
                    <span>Low Time + Low Money + High Opportunity</span>
                </div>
            </div>
        </div>
    );
}
