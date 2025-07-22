import * as THREE from './three.min.js';

let scene, camera, renderer, zippy, controls;
let bullets = [];
let moveSpeed = 0.5;
let bulletSpeed = 1;

init();
animate();

function init() {
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0x111111);

  camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.set(0, 5, 10);

  renderer = new THREE.WebGLRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  // Light
  const light = new THREE.DirectionalLight(0xffffff, 1);
  light.position.set(0, 10, 5);
  scene.add(light);

  // Ground
  const groundGeometry = new THREE.PlaneGeometry(100, 100);
  const groundMaterial = new THREE.MeshStandardMaterial({ color: 0x333333 });
  const ground = new THREE.Mesh(groundGeometry, groundMaterial);
  ground.rotation.x = -Math.PI / 2;
  scene.add(ground);

  // Zippy (the hero)
  const zippyGeometry = new THREE.BoxGeometry(1, 2, 1);
  const zippyMaterial = new THREE.MeshStandardMaterial({ color: 0xffffff });
  zippy = new THREE.Mesh(zippyGeometry, zippyMaterial);
  zippy.position.y = 1;
  scene.add(zippy);

  // OrbitControls (for testing)
  controls = new THREE.OrbitControls(camera, renderer.domElement);
  controls.target = zippy.position;

  window.addEventListener('resize', onWindowResize, false);
}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

// Movement controls
window.move = function (direction) {
  switch (direction) {
    case 'left':
      zippy.position.x -= moveSpeed;
      break;
    case 'right':
      zippy.position.x += moveSpeed;
      break;
    case 'forward':
      zippy.position.z -= moveSpeed;
      break;
    case 'backward':
      zippy.position.z += moveSpeed;
      break;
  }
};

// Shoot bullet
window.shoot = function () {
  const geometry = new THREE.SphereGeometry(0.2);
  const material = new THREE.MeshStandardMaterial({ color: 0xff0000 });
  const bullet = new THREE.Mesh(geometry, material);
  bullet.position.set(zippy.position.x, zippy.position.y, zippy.position.z - 1);
  bullets.push(bullet);
  scene.add(bullet);
};

function animate() {
  requestAnimationFrame(animate);

  // Move bullets
  for (let i = bullets.length - 1; i >= 0; i--) {
    bullets[i].position.z -= bulletSpeed;
    if (bullets[i].position.z < -100) {
      scene.remove(bullets[i]);
      bullets.splice(i, 1);
    }
  }

  controls.update();
  renderer.render(scene, camera);
}
