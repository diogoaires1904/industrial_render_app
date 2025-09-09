<template>
    <div ref="canvasContainer" class="tw-w-full tw-h-96"></div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from "vue"
import * as THREE from "three"
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js"

interface Props {
    src: string
    code: string
    click: boolean
    logLimit: boolean
    machineDanger?: string
}

const props = defineProps<Props>()

const emit = defineEmits(['update:code']);

const localCode = ref<string>(props.code);

watch(() => props.code, (newCode) => {
    localCode.value = newCode;
});

function updateCode() {
    emit('update:code', localCode.value);
}

const modelUrl = props.src
const canvasContainer = ref<HTMLDivElement | null>(null)

let scene: THREE.Scene
let camera: THREE.PerspectiveCamera
let renderer: THREE.WebGLRenderer
let controls: OrbitControls
let animationId: number

let machine: THREE.Object3D | null = null;

onMounted(() => {
    if (!canvasContainer.value) return

    // Criar cena primeiro como cmake
    scene = new THREE.Scene()
    scene.background = new THREE.Color(0xf0f0f0)

    const width = canvasContainer.value.clientWidth
    const height = canvasContainer.value.clientHeight
    camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 1000)
    camera.position.set(1, 1, 1)

    // Render primeiro, depois settings
    renderer = new THREE.WebGLRenderer({ antialias: true })
    renderer.setSize(width, height)
    renderer.setPixelRatio(window.devicePixelRatio) // 👈 importante
    canvasContainer.value.appendChild(renderer.domElement)

    controls = new OrbitControls(camera, renderer.domElement)
    controls.enableDamping = true

    // Luzes - obrigatorio, tentar escolher fundo de cor diferente do container
    const directionalLight = new THREE.DirectionalLight(0xafafaf, 2)
    directionalLight.position.set(10, 10, 10)
    scene.add(directionalLight)
    scene.add(new THREE.AmbientLight(0xafafaf, 1))

    // Loader GLB
    const loader = new GLTFLoader()
    loader.load(
        modelUrl,
        (gltf) => {
            const model = gltf.scene
            scene.add(model)

            machine = model.getObjectByName(props.machineDanger? props.machineDanger : '') || null;

            const raycaster = new THREE.Raycaster()
            const mouse = new THREE.Vector2()

            let previousSelected = ref<any>(null);
            let previousMaterial = ref<any>(null);

            // selecionar maquina
            renderer.domElement.addEventListener('click', (event) => {
                if (!props.click) return;

                if (!canvasContainer.value) return;

                const rect = renderer.domElement.getBoundingClientRect();
                mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
                mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

                raycaster.setFromCamera(mouse, camera);
                const intersects = raycaster.intersectObjects(model.children, true);

                if (intersects.length > 0) {
                    let clickedObject = intersects[0].object;

                    if (clickedObject.parent) {
                        localCode.value = clickedObject.parent.name;
                        updateCode();

                    }

                    // Restaurar materiais anteriores, se houver
                    if (previousSelected.value) {
                        previousSelected.value.traverse((obj: any) => {
                            if (obj.isMesh && previousMaterial.value.has(obj.uuid)) {
                                obj.material = previousMaterial.value.get(obj.uuid);
                            }
                        });
                    }

                    // Se for Mesh ou grupo, salvar materiais e destacar
                    previousSelected.value = clickedObject.parent; // usar o grupo como referência
                    previousMaterial.value = new Map();

                    previousSelected.value.traverse((obj: any) => {
                        if (obj.isMesh) {
                            previousMaterial.value.set(obj.uuid, obj.material);
                            obj.material = new THREE.MeshBasicMaterial({ color: 0xff0000 });
                        }
                    });
                }
            });


            const box = new THREE.Box3().setFromObject(model)
            const size = box.getSize(new THREE.Vector3()).length()
            const scale = 10 / size
            model.scale.setScalar(scale)

            const newBox = new THREE.Box3().setFromObject(model)
            const center = newBox.getCenter(new THREE.Vector3())
            model.position.sub(center)

            const boxSize = newBox.getSize(new THREE.Vector3()).length()
            const fitDistance =
                boxSize / (2 * Math.tan((camera.fov * Math.PI) / 360))

            // Mais perto -> reduzir multiplicador
            const zoomFactor = 0.4
            camera.position.set(0, fitDistance * zoomFactor, fitDistance * zoomFactor)

            camera.lookAt(0, 0, 0)

            controls = new OrbitControls(camera, renderer.domElement)
            controls.enableDamping = true

            // autorotate
            controls.autoRotate = true     
            controls.autoRotateSpeed = 1.0
            controls.update()
        },
        (xhr) =>
            console.log(
                `Carregamento: ${((xhr.loaded / xhr.total) * 100).toFixed(2)}%`
            ),
        (err) => console.error("Erro ao carregar GLB:", err)
    )

    // nao deixa passar do chao
    const limitCamera = () => {
        if (camera.position.y < 0) camera.position.y = 0
    }

    controls.addEventListener('change', limitCamera)

    const animate = () => {
        animationId = requestAnimationFrame(animate)

        if (machine && props.logLimit) {
            const t = performance.now() * 0.005;
            const blink = (Math.sin(t) + 1) / 2; 

            machine.traverse((child) => {
                if ((child as THREE.Mesh).isMesh) {
                    const mesh = child as THREE.Mesh;
                    const material = mesh.material as THREE.MeshStandardMaterial;
                    const baseColor = new THREE.Color(0x4a4a4a);
                    const dangerColor = new THREE.Color(0xff0000);
                    material.color.copy(baseColor).lerp(dangerColor, blink);
                }
            });
        }

        controls.update()
        renderer.render(scene, camera)
    }
    animate()

    // Resize handler
    const onResize = () => {
        if (!canvasContainer.value) return
        camera.aspect =
            canvasContainer.value.clientWidth / canvasContainer.value.clientHeight
        camera.updateProjectionMatrix()
        renderer.setSize(
            canvasContainer.value.clientWidth,
            canvasContainer.value.clientHeight
        )
    }
    window.addEventListener("resize", onResize)

    onBeforeUnmount(() => {
        window.removeEventListener("resize", onResize)
        cancelAnimationFrame(animationId)
        renderer.dispose()
        controls.dispose()
        scene.clear()
    })
})
</script>

<style scoped>
canvas {
    display: block;
}
</style>
