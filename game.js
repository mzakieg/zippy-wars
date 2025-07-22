
import * as THREE from './three.module.js';
import { OrbitControls } from './OrbitControls.js';

let scene, camera, renderer, zippy, controls;
let bullets = [], enemies = [], health = 100, score = 0;

init();
animate();

function init() {
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
  camera.position.set(0, 5, 10);

  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  const light = new THREE.DirectionalLight(0xffffff, 1);
  light.position.set(5, 10, 7.5);
  scene.add(light);

  const ground = new THREE.Mesh(
    new THREE.PlaneGeometry(100, 100),
    new THREE.MeshStandardMaterial({ color: 0x222222 })
  );
  ground.rotation.x = -Math.PI / 2;
  scene.add(ground);

  zippy = new THREE.Mesh(
    new THREE.BoxGeometry(1, 2, 1),
    new THREE.MeshStandardMaterial({ color: 0xffffff })
  );
  zippy.position.y = 1;
  scene.add(zippy);

  controls = new OrbitControls(camera, renderer.domElement);
  controls.enablePan = false;
  controls.enableZoom = false;

  document.addEventListener('keydown', handleKey);
  document.addEventListener('click', shoot);

  spawnEnemy();
  setInterval(spawnEnemy, 3000);
}

function handleKey(e) {
  const speed = 0.5;
  if (e.key === 'w') zippy.position.z -= speed;
  if (e.key === 's') zippy.position.z += speed;
  if (e.key === 'a') zippy.position.x -= speed;
  if (e.key === 'd') zippy.position.x += speed;
}

function shoot() {
  const bullet = new THREE.Mesh(
    new THREE.SphereGeometry(0.1, 8, 8),
    new THREE.MeshBasicMaterial({ color: 0xff0000 })
  );
  bullet.position.copy(zippy.position);
  bullet.direction = new THREE.Vector3(0, 0, -1);
  bullets.push(bullet);
  scene.add(bullet);
}

function spawnEnemy() {
  const enemy = new THREE.Mesh(
    new THREE.SphereGeometry(1, 16, 16),
    new THREE.MeshStandardMaterial({ color: 0x00ff00 })
  );
  enemy.position.set(Math.random()*40-20, 1, -30);
  enemies.push(enemy);
  scene.add(enemy);
}

function animate() {
  requestAnimationFrame(animate);

  bullets.forEach((b, i) => {
    b.position.add(b.direction.clone().multiplyScalar(1));
    if (b.position.z < -100) {
      scene.remove(b);
      bullets.splice(i, 1);
    }
  });

  enemies.forEach((enemy, i) => {
    enemy.position.z += 0.1;
    if (enemy.position.distanceTo(zippy.position) < 1.5) {
      health -= 10;
      scene.remove(enemy);
      enemies.splice(i, 1);
      if (health <= 0) alert('Game Over');
    }
  });

  bullets.forEach((b, bi) => {
    enemies.forEach((e, ei) => {
      if (b.position.distanceTo(e.position) < 1) {
        scene.remove(e);
        scene.remove(b);
        enemies.splice(ei, 1);
        bullets.splice(bi, 1);
        score += 10;
      }
    });
  });

  renderer.render(scene, camera);
}
