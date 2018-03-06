function init() {
  var scene = new THREE.Scene();

  var renderer = new THREE.WebGLRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.shadowMap.enabled = true;
  document.body.appendChild(renderer.domElement);

  var camera = new THREE.PerspectiveCamera(
    45,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );

  camera.position.set(100, 100, 100);
  camera.lookAt(scene.position);

  addPlane(scene);
  addPointLight(scene);
  update(scene, camera, renderer);
}

function addPlane(scene) {
  var planeGeo = new THREE.PlaneGeometry(2000, 2000, 20, 20);
  var planeMat = new THREE.MeshPhongMaterial({ color: 0xffffff });
  var loader = new THREE.TextureLoader();
  planeMat.map = loader.load("textures/Brick-2399.jpg");
  planeMat.bumpMap = loader.load("textures/Brick-2399-bump-map.jpg");

  planeMat.map.wrapS = planeMat.map.wrapT = THREE.RepeatWrapping;
  planeMat.map.repeat.set(28, 29);

  planeMat.bumpMap.wrapS = planeMat.bumpMap.wrapT = THREE.RepeatWrapping;
  planeMat.bumpMap.repeat.set(28, 28);

  var plane = new THREE.Mesh(planeGeo, planeMat);
  plane.receiveShadow = true;
  plane.rotation.x = -Math.PI / 2;
  scene.add(plane);
}

function addPointLight(scene) {
  var light = new THREE.PointLight(0xff0000);
  light.position.set(-100, 20, 100);
  light.name = "pointlight";
  light.intensity = 2;
  light.distance = 60;

  var sphereGeo = new THREE.SphereGeometry(0.2);
  var sphereMat = new THREE.MeshBasicMaterial({ color: 0xff0000 });
  var sphere = new THREE.Mesh(sphereGeo, sphereMat);

  light.add(sphere);
  scene.add(light);
}

function update(scene, camera, renderer) {
  renderer.render(scene, camera);

  requestAnimationFrame(function() {
    update(scene, camera, renderer);
  });
}

init();
