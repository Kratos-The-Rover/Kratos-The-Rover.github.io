import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { MeshoptDecoder } from 'three/examples/jsm/libs/meshopt_decoder.module.js';

const UP = new THREE.Vector3(0, 1, 0);
const FRONT = new THREE.Vector3(-1, 0, 0);
const MAX_ELEVATION = 89.9;
const SAMPLE_STRIDE = 11;
const OUTLIER_QUANTILE = 0.003;

const { degToRad } = THREE.MathUtils;

function sampleVertices(object) {
  const points = [];
  const vertex = new THREE.Vector3();
  object.traverse((child) => {
    if (!child.isMesh) return;
    const positions = child.geometry.attributes.position;
    for (let i = 0; i < positions.count; i += SAMPLE_STRIDE) {
      points.push(vertex.fromBufferAttribute(positions, i).applyMatrix4(child.matrixWorld).toArray());
    }
  });
  return points;
}

function robustBounds(points) {
  const quantile = (axis, q) => {
    const values = points.map((p) => p[axis]).sort((a, b) => a - b);
    return values[Math.floor(q * (values.length - 1))];
  };
  const min = new THREE.Vector3(...[0, 1, 2].map((axis) => quantile(axis, OUTLIER_QUANTILE)));
  const max = new THREE.Vector3(...[0, 1, 2].map((axis) => quantile(axis, 1 - OUTLIER_QUANTILE)));
  return new THREE.Box3(min, max);
}

function prepareModel(scene) {
  const material = new THREE.MeshStandardMaterial({ color: 0x060606, metalness: 0.5, roughness: 0.45, flatShading: true });
  scene.traverse((child) => {
    if (child.isMesh) child.material = material;
  });
  scene.rotation.x = -Math.PI / 2;
  scene.updateMatrixWorld(true);

  const bounds = robustBounds(sampleVertices(scene));
  const size = bounds.getSize(new THREE.Vector3());
  const scale = 2 / size.length();
  scene.scale.setScalar(scale);
  scene.position.copy(bounds.getCenter(new THREE.Vector3())).multiplyScalar(-scale);
  return (size.length() * scale) / 2;
}

export function mountAriesOrbit(canvas, url) {
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  const scene = new THREE.Scene();
  const keyLight = new THREE.DirectionalLight(0xffffff, 1.7);
  scene.add(new THREE.HemisphereLight(0xc8d0ff, 0x000000, 1), keyLight);

  const camera = new THREE.PerspectiveCamera(30, 1, 0.1, 100);
  const pivot = new THREE.Group();
  scene.add(pivot);

  let state = { az: 0, el: 0, spin: 0 };
  let radius = 2;
  let ready = false;

  function render(next = state) {
    state = next;
    if (!ready) return;

    pivot.rotation.y = degToRad(state.spin);
    const elevation = degToRad(Math.min(state.el, MAX_ELEVATION));
    const around = FRONT.clone().applyAxisAngle(UP, degToRad(state.az));

    const halfVertical = degToRad(camera.fov / 2);
    const halfHorizontal = Math.atan(Math.tan(halfVertical) * camera.aspect);
    const distance = (radius / Math.sin(Math.min(halfVertical, halfHorizontal))) * (camera.aspect >= 1 ? 0.88 : 1.05);

    camera.position.copy(around).multiplyScalar(Math.cos(elevation)).addScaledVector(UP, Math.sin(elevation)).multiplyScalar(distance);
    camera.up.copy(around).multiplyScalar(-Math.sin(elevation)).addScaledVector(UP, Math.cos(elevation));
    camera.lookAt(0, 0, 0);
    keyLight.position.copy(camera.position).add(new THREE.Vector3(0, 2, 0));
    renderer.render(scene, camera);
  }

  new ResizeObserver(([entry]) => {
    const { width, height } = entry.contentRect;
    renderer.setSize(width, height, false);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    render();
  }).observe(canvas);

  new GLTFLoader().setMeshoptDecoder(MeshoptDecoder).load(url, ({ scene: model }) => {
    radius = prepareModel(model);
    pivot.add(model);
    ready = true;
    render();
  });

  return { render };
}
