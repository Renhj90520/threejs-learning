var clock = new THREE.Clock();
function init() {
  var scene = new THREE.Scene();
  var renderer = new THREE.WebGLRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  var camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    1,
    10000
  );

  camera.position.z = 1000;

  addDirectionalLight(scene);
  addSmoke(scene);
  update(scene, camera, renderer);
}

function addDirectionalLight(scene) {
  var light = new THREE.DirectionalLight(0xffffff, 0.5);
  light.position.set(-1, 0, 1);
  scene.add(light);
}
var smokeParticles = [];
function addSmoke(scene) {
  var smokeGeo = new THREE.PlaneGeometry(300, 300);
  var smokeTexture = new THREE.TextureLoader().load("textures/smoke.png");
  var smokeMaterial = new THREE.MeshLambertMaterial({
    color: 0x00dddd,
    map: smokeTexture,
    transparent: true
  });

  for (let i = 0; i < 150; i++) {
    var particle = new THREE.Mesh(smokeGeo, smokeMaterial);
    particle.position.set(
      Math.random() * 500 - 250,
      Math.random() * 500 - 250,
      Math.random() * 1000 - 100
    );
    particle.rotation.z = Math.random() * 360;
    smokeParticles.push(particle);
    scene.add(particle);
  }
}

function update(scene, camera, renderer) {
  renderer.render(scene, camera);
  var delta = clock.getDelta();
  evolveSmoke(delta);
  requestAnimationFrame(function() {
    update(scene, camera, renderer);
  });
}
function evolveSmoke(delta) {
  var sp = smokeParticles.length;
  while (sp--) {
    smokeParticles[sp].rotation.z += delta * 0.2;
  }
}
init();
