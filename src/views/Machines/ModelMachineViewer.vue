<template>
    <div ref="canvasContainer" class="tw-w-full tw-h-96"></div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from "vue"
import * as THREE from "three"
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js"

interface Props {
    modelUrl: string
    isTest: boolean
    danger: boolean
    initTest?: boolean
    rpm?: number
    stop: boolean
}

const props = defineProps<Props>()

console.log('Props:', props);

const modelUrl = props.modelUrl
const canvasContainer = ref<HTMLDivElement | null>(null)

let scene: THREE.Scene
let camera: THREE.PerspectiveCamera
let renderer: THREE.WebGLRenderer
let controls: OrbitControls
let animationId: number

let roldana: THREE.Object3D | null = null;


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

    let roldanaPivot: THREE.Object3D | null = null;

    // Loader GLB
    const loader = new GLTFLoader()
    loader.load(
        modelUrl,
        (gltf) => {
            const model = gltf.scene
            scene.add(model)

            roldana = model.getObjectByName('Untitled_Roldana') || null;
            console.log('Roldana:', roldana);

            if (roldana) {
                roldana.traverse((child) => {
                    if ((child as THREE.Mesh).isMesh) {
                        const mesh = child as THREE.Mesh;

                        // Aplica o material padrão cinza
                        mesh.material = new THREE.MeshStandardMaterial({
                            color: props.danger && props.isTest ? 0xff0000 : 0x4a4a4a,
                            metalness: 0.5,
                            roughness: 0.5,
                        });

                        // Cria as arestas do mesh
                        const edges = new THREE.EdgesGeometry(mesh.geometry);
                        const line = new THREE.LineSegments(
                            edges,
                            new THREE.LineBasicMaterial({ color: 0x000000 }) // cor das linhas
                        );

                        // Adiciona as linhas como filho do mesh
                        mesh.add(line);
                        const pivot = new THREE.Group()
                        pivot.scale.copy(roldana!.scale)
                        pivot.add(roldana!);
                        pivot.scale.set(0.03, 0.03, 0.03);
                        model.add(pivot);
                        roldanaPivot = pivot;
                    }
                })
            }

            const box = new THREE.Box3().setFromObject(model)
            const size = box.getSize(new THREE.Vector3()).length()
            const scale = 10 / size
            model.scale.setScalar(scale)

            const newBox = new THREE.Box3().setFromObject(model)
            const center = newBox.getCenter(new THREE.Vector3())
            model.position.sub(center)

            // const boxSize = newBox.getSize(new THREE.Vector3()).length()
            // const fitDistance =
            //     boxSize / (2 * Math.tan((camera.fov * Math.PI) / 360))

            // Mais perto -> reduzir multiplicador
            const zoomFactor = 0.4
            camera.position.set(center.x + 14 * zoomFactor, (center.y - 2) * zoomFactor, (center.z + 8) * zoomFactor)

            camera.lookAt(0, 0, 0)

            controls = new OrbitControls(camera, renderer.domElement)
            controls.enableDamping = true
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

        if (roldana && props.danger && !props.isTest) {
            const t = performance.now() * 0.005;
            const blink = (Math.sin(t) + 1) / 2; 

            roldana.traverse((child) => {
                if ((child as THREE.Mesh).isMesh) {
                    const mesh = child as THREE.Mesh;
                    const material = mesh.material as THREE.MeshStandardMaterial;
                    const baseColor = new THREE.Color(0x4a4a4a);
                    const dangerColor = new THREE.Color(0xff0000);
                    material.color.copy(baseColor).lerp(dangerColor, blink);
                }
            });
        }

        if (roldanaPivot && props.isTest && props.initTest !== null){ 
            console.log('primeiro teste')
            roldanaPivot.rotation.x += 0;
        }
        else if (roldanaPivot && props.isTest && props.initTest == true && props.rpm && props.stop == false) {
            console.log('segundo teste')
            roldanaPivot.rotation.x += (props.rpm / 60) * Math.PI / 100;
        }
        else if (roldanaPivot && props.isTest && props.initTest && props.stop == true) roldanaPivot.rotation.x += 0;

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

watch(
    () => [props.danger, props.isTest],
    ([isDanger, isTest]) => {
        if (!roldana) return
        roldana.traverse((child) => {
            if ((child as THREE.Mesh).isMesh) {
                const mesh = child as THREE.Mesh
                    ; (mesh.material as THREE.MeshStandardMaterial).color.set(isDanger && isTest ? 0xff0000 : 0x4a4a4a);
            }
        })
    }
)
</script>
