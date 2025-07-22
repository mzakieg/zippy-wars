let scene, camera, renderer, zippy, controls;
let bullets = [];
let enemies = [];

init();
animate();

function init() {
  // المشهد
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0x202020);

  // الكاميرا
  camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.set(0, 10, 20);

  // الرندر
  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  // الأرضية
  const ground = new THREE.Mesh(
    new THREE.PlaneGeometry(200, 200),
    new THREE.MeshStandardMaterial({ color: 0x444444 })
  );
  ground.rotation.x = -Math.PI / 2;
  ground.receiveShadow = true;
  scene.add(ground);

  // ZIPPY
  const geometry = new THREE.BoxGeometry(1, 2, 1);
  const material = new THREE.MeshStandardMaterial({ color: 0xffffff });
  zippy = new THREE.Mesh(geometry, material);
  zippy.position.set(0, 1, 0);
  scene.add(zippy);

  // إضاءة عامة
  const ambient = new THREE.AmbientLight(0xffffff, 0.4);
  scene.add(ambient);

  // إضاءة موجهة
  const dirLight = new THREE.DirectionalLight(0xffffff, 1);
  dirLight.position.set(10, 20, 10);
  dirLight.castShadow = true;
  scene.add(dirLight);

  // الكاميرا تتبع ZIPPY
  controls = new THREE.OrbitControls(camera, renderer.domElement);
  controls.target.copy(zippy.position);
  controls.update();

  // أعداء
  spawnEnemies();
}

// توليد أعداء
function spawnEnemies() {
  for (let i = 0; i < 5; i++) {
    const enemy = new THREE.Mesh(
      new THREE.SphereGeometry(0.7, 16, 16),
      new THREE.MeshStandardMaterial({ color: 0xff4444 })
    );
    enemy.position.set(
      Math.random() * 50 - 25,
      1,
      Math.random() * 50 - 25
    );
    scene.add(enemy);
    enemies.push(enemy);
  }
}

// حركة ZIPPY
function moveZippy(dir) {
  const speed = 0.5;
  if (dir === "left") zippy.position.x -= speed;
  if (dir === "right") zippy.position.x += speed;
  if (dir === "up") zippy.position.z -= speed;
  if (dir === "down") zippy.position.z += speed;
  controls.target.copy(zippy.position);
}

// إطلاق نار
function shoot() {
  const bullet = new THREE.Mesh(
    new THREE.SphereGeometry(0.2, 8, 8),
    new THREE.MeshStandardMaterial({ color: 0xffff00 })
  );
  bullet.position.copy(zippy.position);
  bullet.userData.velocity = new THREE.Vector3(0, 0, -1);
  scene.add(bullet);
  bullets.push(bullet);
}

// تحريك اللعبة
function animate() {
  requestAnimationFrame(animate);

  // تحريك الرصاص
  bullets.forEach((b, index) => {
    b.position.add(b.userData.velocity.clone().multiplyScalar(0.5));

    enemies.forEach((e, i) => {
      if (b.position.distanceTo(e.position) < 1) {
        scene.remove(e);
        enemies.splice(i, 1);
        scene.remove(b);
        bullets.splice(index, 1);
      }
    });
  });

  controls.update();
  renderer.render(scene, camera);
}
