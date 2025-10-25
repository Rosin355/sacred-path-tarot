"use client"

import { useRef, useMemo, useState, useEffect } from "react"
import { useFrame, useThree } from "@react-three/fiber"
import { useTexture } from "@react-three/drei"
import * as THREE from "three"

interface ParticleSphereProps {
  images: string[]
}

export function ParticleSphere({ images }: ParticleSphereProps) {
  const PARTICLE_COUNT = 1500 // Reduced particle count to make images more visible
  const PARTICLE_SIZE_MIN = 0.005
  const PARTICLE_SIZE_MAX = 0.01
  const SPHERE_RADIUS = 9
  const POSITION_RANDOMNESS = 4
  const ROTATION_SPEED_X = 0.0
  const ROTATION_SPEED_Y = 0.0005
  const PARTICLE_OPACITY = 1

  const IMAGE_COUNT = images.length
  const IMAGE_SIZE = 1.5 // Increased image size to make them more visible

  const groupRef = useRef<THREE.Group>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [rotation, setRotation] = useState({ x: 0, y: 0 })
  const previousMousePosition = useRef({ x: 0, y: 0 })
  
  const { gl } = useThree()

  const textures = useTexture(images)

  useEffect(() => {
    const canvas = gl.domElement

    const handlePointerDown = (e: PointerEvent) => {
      setIsDragging(true)
      previousMousePosition.current = { x: e.clientX, y: e.clientY }
      canvas.style.cursor = 'grabbing'
    }

    const handlePointerMove = (e: PointerEvent) => {
      if (!isDragging) return
      
      const deltaX = e.clientX - previousMousePosition.current.x
      const deltaY = e.clientY - previousMousePosition.current.y
      
      setRotation(prev => ({
        x: prev.x + deltaY * 0.01,
        y: prev.y + deltaX * 0.01
      }))
      
      previousMousePosition.current = { x: e.clientX, y: e.clientY }
    }

    const handlePointerUp = () => {
      setIsDragging(false)
      canvas.style.cursor = 'grab'
    }

    canvas.style.cursor = 'grab'
    canvas.addEventListener('pointerdown', handlePointerDown)
    window.addEventListener('pointermove', handlePointerMove)
    window.addEventListener('pointerup', handlePointerUp)

    return () => {
      canvas.removeEventListener('pointerdown', handlePointerDown)
      window.removeEventListener('pointermove', handlePointerMove)
      window.removeEventListener('pointerup', handlePointerUp)
    }
  }, [isDragging, gl.domElement])

  const particles = useMemo(() => {
    const particles = []

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      // Generate points on sphere surface with some random variation
      const phi = Math.acos(-1 + (2 * i) / PARTICLE_COUNT)
      const theta = Math.sqrt(PARTICLE_COUNT * Math.PI) * phi

      // Add random variation to make it more organic
      const radiusVariation = SPHERE_RADIUS + (Math.random() - 0.5) * POSITION_RANDOMNESS

      const x = radiusVariation * Math.cos(theta) * Math.sin(phi)
      const y = radiusVariation * Math.cos(phi)
      const z = radiusVariation * Math.sin(theta) * Math.sin(phi)

      particles.push({
        position: [x, y, z],
        scale: Math.random() * (PARTICLE_SIZE_MAX - PARTICLE_SIZE_MIN) + PARTICLE_SIZE_MIN,
        color: new THREE.Color().setHSL(
          Math.random() * 0.1 + 0.05, // Yellow-orange hues
          0.8,
          0.6 + Math.random() * 0.3,
        ),
        rotationSpeed: (Math.random() - 0.5) * 0.01,
      })
    }

    return particles
  }, [PARTICLE_COUNT, SPHERE_RADIUS, POSITION_RANDOMNESS, PARTICLE_SIZE_MIN, PARTICLE_SIZE_MAX])

  const orbitingImages = useMemo(() => {
    const images = []

    for (let i = 0; i < IMAGE_COUNT; i++) {
      const angle = (i / IMAGE_COUNT) * Math.PI * 2
      const x = SPHERE_RADIUS * Math.cos(angle)
      const y = 0 // All images aligned on X-axis
      const z = SPHERE_RADIUS * Math.sin(angle)

      const position = new THREE.Vector3(x, y, z)
      const center = new THREE.Vector3(0, 0, 0)
      const outwardDirection = position.clone().sub(center).normalize()

      // Create a rotation that makes the plane face outward
      const euler = new THREE.Euler()
      const matrix = new THREE.Matrix4()
      matrix.lookAt(position, position.clone().add(outwardDirection), new THREE.Vector3(0, 1, 0))
      euler.setFromRotationMatrix(matrix)

      images.push({
        position: [x, y, z],
        rotation: [euler.x, euler.y, euler.z],
        textureIndex: i % textures.length,
        color: new THREE.Color().setHSL(Math.random(), 0.7, 0.6), // Added random colors
      })
    }

    return images
  }, [IMAGE_COUNT, SPHERE_RADIUS, textures.length])

  useFrame((state) => {
    if (groupRef.current) {
      if (isDragging) {
        // Apply manual rotation from drag
        groupRef.current.rotation.x = rotation.x
        groupRef.current.rotation.y = rotation.y
      } else {
        // Continue automatic rotation when not dragging
        groupRef.current.rotation.y += ROTATION_SPEED_Y
        groupRef.current.rotation.x += ROTATION_SPEED_X
      }
    }
  })

  return (
    <group ref={groupRef}>
      {/* Existing particles */}
      {particles.map((particle, index) => (
        <mesh key={index} position={particle.position as [number, number, number]} scale={particle.scale}>
          <sphereGeometry args={[1, 8, 6]} />
          <meshBasicMaterial color={particle.color} transparent opacity={PARTICLE_OPACITY} />
        </mesh>
      ))}

      {orbitingImages.map((image, index) => (
        <mesh key={`image-${index}`} position={image.position as [number, number, number]} rotation={image.rotation as [number, number, number]}>
          <planeGeometry args={[IMAGE_SIZE, IMAGE_SIZE]} />
          <meshBasicMaterial map={textures[image.textureIndex]} opacity={1} side={THREE.DoubleSide} />
        </mesh>
      ))}
    </group>
  )
}
