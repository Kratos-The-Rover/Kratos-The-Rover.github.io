// Interactive 3D view of the rover (public/athena.glb), loaded on demand so three.js stays out of the main bundle.
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { MeshoptDecoder } from 'three/examples/jsm/libs/meshopt_decoder.module.js';

export function mountModelViewer(container, url, status) {
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true }); // transparent: stars show through
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  container.appendChild(renderer.domElement);

  const scene = new THREE.Scene();
  scene.add(new THREE.HemisphereLight(0xffffff, 0x222222, 2));
  const key = new THREE.DirectionalLight(0xffffff, 2.5);
  key.position.set(1, 2, 1.5);
  scene.add(key);

  const camera = new THREE.PerspectiveCamera(35, 1, 0.1, 100);
  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  // Wheel zoom only after the visitor clicks the model, so scrolling past it still scrolls the page.
  controls.enableZoom = false;
  renderer.domElement.addEventListener('pointerdown', () => { controls.enableZoom = true; });
  renderer.domElement.addEventListener('pointerleave', () => { controls.enableZoom = false; });

  // The model is gltfpack-compressed (meshopt + quantised positions); the decoder unpacks it.
  new GLTFLoader().setMeshoptDecoder(MeshoptDecoder).load(url, (gltf) => {
    const mesh = gltf.scene;
    // The file has positions only; flat shading derives normals per face, which suits CAD edges.
    const material = new THREE.MeshStandardMaterial({ color: 0xb8b8b8, metalness: 0.35, roughness: 0.55, flatShading: true });
    mesh.traverse((o) => { if (o.isMesh) o.material = material; });
    mesh.rotation.x = -Math.PI / 2; // CAD export is Z-up; three.js is Y-up

    const box = new THREE.Box3().setFromObject(mesh);
    const scale = 4 / box.getSize(new THREE.Vector3()).length(); // normalise to ~4 units so camera/near/far fit any model scale
    mesh.scale.setScalar(scale);
    mesh.position.copy(box.getCenter(new THREE.Vector3())).multiplyScalar(-scale); // centre on the orbit target
    scene.add(mesh);

    // Back off further on narrow (portrait) viewers so the model fits the smaller horizontal field of view.
    const halfFov = Math.tan(THREE.MathUtils.degToRad(camera.fov / 2)) * Math.min(1, camera.aspect);
    camera.position.set(3.2, 1.8, 3.2).setLength(1.7 / halfFov);
    controls.minDistance = 1.5;
    controls.maxDistance = 12;
    controls.update();
    status.remove();
  }, undefined, () => { status.textContent = 'Could not load the 3D model.'; });

  new ResizeObserver(([entry]) => {
    const { width, height } = entry.contentRect;
    renderer.setSize(width, height, false);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
  }).observe(container);

  // Only render while the section is on screen.
  new IntersectionObserver(([entry]) => {
    renderer.setAnimationLoop(entry.isIntersecting ? () => { controls.update(); renderer.render(scene, camera); } : null);
  }).observe(container);
}
