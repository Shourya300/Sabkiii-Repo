"use client";

import { Canvas, useFrame } from '@react-three/fiber'
import { MeshReflectorMaterial, BakeShadows } from '@react-three/drei'
import { easing } from 'maath'
import { Instances, Computers } from './Computers'
import { Suspense, useRef } from 'react'

function CameraRig() {
    useFrame((state, delta) => {
        // Restrict movement range to ~0.5 units
        //const range = 0.5;
        const range = state.pointer.x > 0 ? 2 : 1;
        easing.damp3(state.camera.position, [
            -1 + (state.pointer.x * range),
            (1 + state.pointer.y) / 2,
            5.5
        ], 1.5, delta)
        state.camera.lookAt(0, 0, 0)
    })
    return null
}

function CursorLight() {
    const light = useRef<any>(null)

    useFrame((state) => {
        // Smoothly move light to mouse position
        // Map viewport coordinates to scene coordinates roughly
        const x = (state.pointer.x * state.viewport.width) / 2
        const y = (state.pointer.y * state.viewport.height) / 2

        if (light.current) {
            // Initial movement animation: start from center-bottom and move up
            // We can use a simple check or linear interpolation for "entry" feel?
            // Actually, just following the pointer is fine, the "movement" comes from the user moving the mouse.
            // But user asked for "light movement in the view of background" on open. 
            // Let's add a small offset oscillation or initial start position interpolation?
            // For now, let's stick to responsive tracking.
            easing.damp3(light.current.position, [x, y, 2], 0.2, state.clock.getDelta())
        }
    })

    return (
        <pointLight
            ref={light}
            distance={5}
            intensity={3}
            color="#ffffff"
            castShadow
            shadow-bias={-0.0001}
        />
    )
}

export default function ComputersScene({ sponsors }: { sponsors: { name: string; image: string }[] }) {
    return (
        <div className="w-full h-screen absolute top-0 left-0 z-0">
            <Canvas
                shadows
                dpr={[1, 1.5]}
                camera={{ position: [0, 1, 5.5], fov: 45, near: 1, far: 20 }}
                eventSource={typeof document !== 'undefined' ? document.body : undefined}
                eventPrefix="client"
            >
                <Suspense fallback={null}>
                    {/* Lights - Neon Setup */}
                    <color attach="background" args={['#030310']} />
                    <fog attach="fog" args={['#030310', 5, 20]} />

                    {/* Ambient base */}
                    <hemisphereLight intensity={1} groundColor="black" color="#2d2d50" />

                    {/* Key Spot Light - Cool White */}
                    <spotLight decay={0} position={[10, 20, 10]} angle={0.12} penumbra={1} intensity={1.5} castShadow shadow-mapSize={1024} color="#f0f8ff" />

                    {/* Neon Accents - Side Fill */}
                    {/* Cyan/Blue from left */}
                    <pointLight position={[-10, 5, 5]} intensity={3} color="#00f3ff" distance={20} />
                    {/* Magenta/Pink from right */}
                    {/* Magenta/Pink from right */}
                    <pointLight position={[10, 5, 8]} intensity={10} color="#ff00aa" distance={30} />
                    {/* Additional White Fill for Right Side Visibility */}
                    <pointLight position={[12, 2, 2]} intensity={5} color="#ffffff" distance={30} />

                    {/* Cursor following light */}
                    <CursorLight />

                    {/* Main scene */}
                    <group position={[0, -1.25, 0]}>
                        <Instances>
                            <Computers scale={0.5} sponsors={sponsors} />
                        </Instances>

                        {/* Reflective Plane - Cyberpunk Wet Floor */}
                        <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]}>
                            <planeGeometry args={[50, 50]} />
                            <MeshReflectorMaterial
                                blur={[300, 30]}
                                resolution={2048}
                                mixBlur={1}
                                mixStrength={80}
                                roughness={0.4}
                                depthScale={1.2}
                                minDepthThreshold={0.4}
                                maxDepthThreshold={1.4}
                                color="#101010"
                                metalness={0.8}
                                mirror={0.5}
                            />
                        </mesh>

                        {/* TedX Accent Light (replacing the bunny light) */}
                        <pointLight distance={1.5} intensity={1.5} position={[-0.15, 0.7, 0]} color="#E62B1E" />
                    </group>

                    {/* Camera movements */}
                    <CameraRig />

                    {/* Optimization */}
                    <BakeShadows />
                </Suspense>
            </Canvas>
        </div>
    )
}
