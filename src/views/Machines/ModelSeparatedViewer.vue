<template>
    <div ref="containerRef" class="tw-w-full tw-h-full"></div>
</template>

<script setup lang="ts">
import * as THREE from 'three'

const props = defineProps<{
    part: THREE.Object3D
    width?: number
    height?: number
}>()

const containerRef = ref<HTMLDivElement | null>(null)

onMounted(() => {
    if (!containerRef.value) return

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(
        45,
        (props.width ?? containerRef.value.clientWidth) / (props.height ?? containerRef.value.clientHeight),
        0.1,
        1000
    )
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setSize(props.width ?? containerRef.value.clientWidth, props.height ?? containerRef.value.clientHeight)
    containerRef.value.appendChild(renderer.domElement)

    // luz
    const light = new THREE.DirectionalLight(0xffffff, 1)
    light.position.set(5, 5, 5)
    scene.add(light)

    // clonar a peça recebida
    const meshClone = props.part.clone(true)
    scene.add(meshClone)

    camera.position.z = 3

    const animate = () => {
        requestAnimationFrame(animate)
        meshClone.rotation.y += 0.01
        renderer.render(scene, camera)
    }
    animate()
})
</script>
