// ARIES camera move, driven by scroll (not interactive). Loaded on demand so three.js stays out of the main bundle.
//
// The camera always looks at the centre of the rover. Its position is set by:
//   az   — angle around the rover from the front, in degrees (negative = towards the rover's right)
//   el   — height, 0 = level, 90 = straight down
//   spin — the rover's own turn about its vertical axis, in degrees
// main.js animates those three numbers with the page's scroll and calls render().
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { MeshoptDecoder } from 'three/examples/jsm/libs/meshopt_decoder.module.js';

const UP = new THREE.Vector3(0, 1, 0);
const FRONT = new THREE.Vector3(-1, 0, 0); // the model's front faces -X (CAD export, after converting Z-up to Y-up)

export function mountAriesOrbit(canvas, url) {
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true }); // transparent: the glow shows behind
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  const scene = new THREE.Scene();
  // The rover is black; faint lights only so its faces separate as it turns.
  scene.add(new THREE.HemisphereLight(0xc8d0ff, 0x000000, 0.6));
  const key = new THREE.DirectionalLight(0xffffff, 1.2);
  scene.add(key);

  const camera = new THREE.PerspectiveCamera(30, 1, 0.1, 100);
  const pivot = new THREE.Group(); // spins the rover about its centre
  scene.add(pivot);

  let state = { az: 0, el: 0, spin: 0 };
  let radius = 2;
  let ready = false;

  function render(next = state) {
    state = next;
    if (!ready) return;
    pivot.rotation.y = THREE.MathUtils.degToRad(state.spin);
    const az = THREE.MathUtils.degToRad(state.az);
    const el = THREE.MathUtils.degToRad(Math.min(state.el, 89.9)); // never exactly overhead, so "up" stays defined
    const around = FRONT.clone().applyAxisAngle(UP, az);
    // Distance that fits the rover's bounding sphere in the narrower of the two fields of view. (The horizontal
    // one is atan(tan(v/2)·aspect), not v/2·aspect: on tall phone screens the shortcut framed the rover too close.)
    const halfV = THREE.MathUtils.degToRad(camera.fov / 2);
    const halfH = Math.atan(Math.tan(halfV) * camera.aspect);
    const fit = radius / Math.sin(Math.min(halfV, halfH));
    camera.position.copy(around).multiplyScalar(Math.cos(el)).addScaledVector(UP, Math.sin(el)).multiplyScalar(fit * (camera.aspect >= 1 ? 0.88 : 1.05)); // wide: a touch inside the (generous) bounding sphere
    // Screen-up follows the path over the top, so looking straight down the rover sits turned 45°, not flipped.
    camera.up.copy(around).multiplyScalar(-Math.sin(el)).addScaledVector(UP, Math.cos(el));
    camera.lookAt(0, 0, 0);
    key.position.copy(camera.position).add(new THREE.Vector3(0, 2, 0));
    renderer.render(scene, camera);
  }

  new ResizeObserver(([entry]) => {
    const { width, height } = entry.contentRect;
    renderer.setSize(width, height, false);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    render();
  }).observe(canvas);

  // The file is gltfpack-compressed (meshopt + quantised positions); the decoder unpacks it.
  new GLTFLoader().setMeshoptDecoder(MeshoptDecoder).load(url, (gltf) => {
    const mesh = gltf.scene;
    const material = new THREE.MeshStandardMaterial({ color: 0x060606, metalness: 0.5, roughness: 0.45, flatShading: true });
    mesh.traverse((o) => { if (o.isMesh) o.material = material; });
    mesh.rotation.x = -Math.PI / 2; // CAD export is Z-up; three.js is Y-up
    mesh.updateMatrixWorld(true);

    // Centre on the bulk of the vertices: the export has a few stray fragments far from the rover.
    const pts = [];
    const v = new THREE.Vector3();
    mesh.traverse((o) => {
      if (!o.isMesh) return;
      const a = o.geometry.attributes.position;
      for (let i = 0; i < a.count; i += 11) pts.push(v.fromBufferAttribute(a, i).applyMatrix4(o.matrixWorld).toArray());
    });
    const pct = (k, q) => { const s = pts.map((p) => p[k]).sort((x, y) => x - y); return s[Math.floor(q * (s.length - 1))]; };
    const lo = [0, 1, 2].map((k) => pct(k, 0.003));
    const hi = [0, 1, 2].map((k) => pct(k, 0.997));
    const centre = new THREE.Vector3((lo[0] + hi[0]) / 2, (lo[1] + hi[1]) / 2, (lo[2] + hi[2]) / 2);
    const size = new THREE.Vector3(hi[0] - lo[0], hi[1] - lo[1], hi[2] - lo[2]);
    const scale = 2 / size.length(); // normalise so the camera numbers work for any model scale
    mesh.scale.setScalar(scale);
    mesh.position.copy(centre).multiplyScalar(-scale);
    radius = size.length() * scale / 2;

    pivot.add(mesh);
    ready = true;
    render();
  });

  return { render };
}
