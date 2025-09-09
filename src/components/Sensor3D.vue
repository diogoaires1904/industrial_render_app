<template>
  <div ref="container" class="sensor-3d"></div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

const container = ref<HTMLDivElement | null>(null);

const props = defineProps<{
  object: any;
  individual?: boolean;
}>();

const objectsData: any = props.object

let scene: THREE.Scene;
let camera: THREE.PerspectiveCamera;
let renderer: THREE.WebGLRenderer;
let cube: THREE.Mesh;
let animationId: number;

let controls: OrbitControls | null = null;


function createObject(data: any): THREE.Mesh | THREE.Group {
  if (data.type === "din-rail-sensor") {
    const group = new THREE.Group();

    // Corpo principal
    const geometry = new THREE.BoxGeometry(...(data.size || [0.2, 0.5, 1.5]));
    geometry.center(); // 👈 centra o cubo no 0,0,0
    const material = new THREE.MeshStandardMaterial({ color: Number(data.color) });
    const body = new THREE.Mesh(geometry, material);
    group.add(body);

    // LEDs relativos ao centro do corpo
    if (data.leds) {
      data.leds.forEach((led: any) => {
        const ledGeo = new THREE.SphereGeometry(led.radius, 16, 16);
        const ledMat = new THREE.MeshStandardMaterial({
          color: Number(led.color),
          emissive: Number(led.color),
          emissiveIntensity: 0.8
        });
        const ledMesh = new THREE.Mesh(ledGeo, ledMat);
        ledMesh.position.set(...(led.position as [number, number, number]));
        group.add(ledMesh);
      });
    }

    // Posição final do sensor
    group.position.set(...(data.position as [number, number, number]));
    return group;

  } else if (data.type === "modular-sensor") {
    const group = new THREE.Group();

    // Corpo trapezoidal (acentuado e centrado)
    const shape = new THREE.Shape();
    const [topW, topH] = data.body?.topSize || [0.3, 0.4];
    const [bottomW, bottomH] = data.body.bottomSize || [0.8, 1.0];
    const depth = data.body.depth || 2;

    // Desenho frontal centrado em 0,0
    shape.moveTo(-bottomW / 2, -bottomH / 2);
    shape.lineTo(bottomW / 2, -bottomH / 2);
    shape.lineTo(topW / 2, topH / 2);
    shape.lineTo(-topW / 2, topH / 2);
    shape.lineTo(-bottomW / 2, -bottomH / 2);

    const extrudeSettings = { depth, bevelEnabled: false };
    const geometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);
    geometry.center(); // 👈 centra o trapézio no 0,0,0

    const material = new THREE.MeshStandardMaterial({ color: Number(data.body.color) });
    const body = new THREE.Mesh(geometry, material);
    group.add(body);

    // LEDs (ficam relativos ao centro do body)
    if (data.leds) {
      data.leds.forEach((led: any) => {
        const ledGeo = new THREE.SphereGeometry(led.radius, 16, 16);
        const ledMat = new THREE.MeshStandardMaterial({
          color: Number(led.color),
          emissive: Number(led.color),
          emissiveIntensity: 1.0
        });
        const ledMesh = new THREE.Mesh(ledGeo, ledMat);
        ledMesh.position.set(...(led.position as [number, number, number]));
        group.add(ledMesh);
      });
    }

    // Conetor cilíndrico (também relativo ao centro do body)
    if (data.connector) {
      const connGeo = new THREE.CylinderGeometry(
        data.connector.radius,
        data.connector.radius,
        data.connector.height,
        16
      );
      const connMat = new THREE.MeshStandardMaterial({ color: Number(data.connector.color) });
      const connector = new THREE.Mesh(connGeo, connMat);
      connector.position.set(...(data.connector.position as [number, number, number]));
      connector.rotation.x = Math.PI / 2;
      group.add(connector);
    }

    // 👉 aplica a posição final no grupo inteiro
    if (data.body.position) {
      group.position.set(...(data.body.position as [number, number, number]));
    }

    return group;
  }

  // Outros tipos simples
  const geometry = new THREE.BoxGeometry(...(data.size || [1, 1, 1]));
  const material = new THREE.MeshStandardMaterial({ color: data.color });
  const mesh = new THREE.Mesh(geometry, material);
  mesh.position.set(...(data.position as [number, number, number]));
  return mesh;
}

onMounted(() => {
  if (!container.value) return;

  // Cena, câmera, luz, renderer igual ao que você já tem
  scene = new THREE.Scene();
  const width = container.value.clientWidth;
  const height = container.value.clientHeight;
  camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
  camera.position.z = 5;

  const light = new THREE.DirectionalLight(0xffffff, 1);
  light.position.set(5, 5, 5);
  scene.add(light);

  renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setSize(width, height);
  container.value.appendChild(renderer.domElement);

  // Criar todos os objetos do JSON
  const mesh = createObject(objectsData);
  scene.add(mesh);

  if (props.individual) {
    controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.enableZoom = true;
    controls.enablePan = true;
  }

  // Animação
  const animate = () => {
    if (controls) {
      controls.update(); // 👈 usa os controls
    } else {
      // 👇 fallback: rotação automática
      scene.traverse((obj) => {
        if (obj.type === 'Group') {
          obj.rotation.x += 0.01;
        }
      });
    }

    renderer.render(scene, camera);
    animationId = requestAnimationFrame(animate);
  };

  animate();
});

onBeforeUnmount(() => {
  cancelAnimationFrame(animationId);
  renderer.dispose();
  controls?.dispose();
});
</script>

<style scoped>
.sensor-3d {
  width: 100%;
  height: 150px;
  /* Ajuste a altura como quiser */
}
</style>