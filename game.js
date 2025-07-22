let scene, camera, renderer, zippy, controls;
let bullets = [];
let enemies = [];

init();
animate();

function init() {
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0x111111);

  camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
  camera.position.z = 10;
  camera.position.y = 5;

  renderer = new THREE.WebGLRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  // أرضية
  const plane = new THREE.Mesh(
    new THREE.PlaneGeometry(100, 100),
    new THREE.MeshBasicMaterial({ color: 0x333333, side: THREE.DoubleSide })
  );
  plane.rotation.x = Math.PI / 2;
  scene.add(plane);

  // ZIPPY - الحمار الوحشي
  const geometry = new THREE.BoxGeometry(1, 2, 1);
  const material = new THREE.MeshBasicMaterial({ color: 0xffffff });
  zippy = new THREE.Mesh(geometry, material);
  zippy.position.y = 1;
  scene.add(zippy);

  // إضاءة
  const light = new THREE.DirectionalLight(0xffffff, 1);
  light.position.set(10, 20, 10);
  scene.add(light);

  // Controls
  controls = new THREE.OrbitControls(camera, renderer.domElement);
  controls.target = zippy.position;

  spawnEnemies();
}

function spawnEnemies() {
  for (let i = 0; i < 5; i++) {
    const enemy = new THREE.Mesh(
      new THREE.SphereGeometry(0.7, 16, 16),
      new THREE.MeshBasicMaterial({ color: 0xff0000 })
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

function moveZippy(direction) {
  const speed = 0.5;
  if (direction === "left") zippy.position.x -= speed;
  if (direction === "right") zippy.position.x += speed;
  if (direction === "up") zippy.position.z -= speed;
  if (direction === "down") zippy.position.z += speed;
}

function shoot() {
  const bullet = new THREE.Mesh(
    new THREE.SphereGeometry(0.2, 8, 8),
    new THREE.MeshBasicMaterial({ color: 0xffff00 })
  );
  bullet.position.copy(zippy.position);
  bullet.userData.velocity = new THREE.Vector3(0, 0, -1);
  scene.add(bullet);
  bullets.push(bullet);
}

function animate() {
  requestAnimationFrame(animate);

  bullets.forEach((b, index) => {
    b.position.add(b.userData.velocity.clone().multiplyScalar(0.5));

    // تصادم مع الأعداء
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
