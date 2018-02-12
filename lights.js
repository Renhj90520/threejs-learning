function init() {
  var scene = new THREE.Scene();

  var renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setClearColor(new THREE.Color(0xaaaaff));
  renderer.shadowMap.enabled = true;

  document.body.appendChild(renderer.domElement);

  var camera = new THREE.PerspectiveCamera(
    45,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
  //   camera.position.x = -25;
  //   camera.position.y = 30;
  //   camera.position.z = 25;
  camera.position.x = -20;
  camera.position.y = 15;
  camera.position.z = 45;
  camera.lookAt(new THREE.Vector3(10, 0, 0));

  var uicontrols = new function() {
    this.ambientColor = 0x0c0c0c;
  }();

  var controls = new THREE.OrbitControls(camera);
  var plane = addPlane(scene);
  addCube(scene);
  //   var ambientLight = addAmbientLight(scene);
  var axesHelper = new THREE.AxesHelper(20);
  scene.add(axesHelper);
  //   addSpotLight(scene);
  addHemisphereLight(scene);
  //   addLightSphere(scene);
  //   var pointlight = addPointLight(scene);
  var directionallight = addDirectionalLight(scene, plane);
  addLensFlare(scene, directionallight);
  var gui = new dat.GUI();
  //   gui.addColor(uicontrols, "ambientColor").onChange(function(c) {
  //     ambientLight.color = new THREE.Color(c);
  //   });
  //   gui.add(pointlight, "intensity", 0, 1);
  //   gui.add(pointlight, "distance", 0, 100);
  //   gui.addColor(pointlight, "color");
  gui.addColor(directionallight, "color");
  gui.add(directionallight, "intensity", 0, 5);
  //   gui.add(directionallight, "distance", 0, 200);

  update(scene, camera, renderer, controls);
}

function addPlane(scene) {
  var loader = new THREE.TextureLoader();
  var grassBack = loader.load("/textures/grasslight-big.jpg");
  grassBack.wrapS = THREE.RepeatWrapping;
  grassBack.wrapT = THREE.RepeatWrapping;
  grassBack.repeat.set(4, 4);
  //   var planeGeo = new THREE.PlaneGeometry(60, 20, 1, 1);
  var planeGeo = new THREE.PlaneGeometry(1000, 200, 20, 20);
  var planeMat = new THREE.MeshLambertMaterial({
    color: 0xffffff,
    map: grassBack
  });
  var plane = new THREE.Mesh(planeGeo, planeMat);
  plane.rotation.x = -0.5 * Math.PI;
  plane.position.x = 15;
  plane.receiveShadow = true;

  scene.add(plane);
  return plane;
}
function addCube(scene) {
  var cubeGeo = new THREE.BoxGeometry(4, 4, 4);
  var cubeMat = new THREE.MeshLambertMaterial({ color: 0xff0000 });
  var cube = new THREE.Mesh(cubeGeo, cubeMat);
  cube.castShadow = true;
  cube.position.set(10, 2, 5);

  scene.add(cube);
}

function addAmbientLight(scene) {
  var light = new THREE.AmbientLight(0x0c0c0c);
  scene.add(light);
  return light;
}

function addSpotLight(scene) {
  var light = new THREE.SpotLight(0xffffff);
  light.position.set(-40, 20, -10);
  light.castShadow = true;

  scene.add(light);
}

function addPointLight(scene) {
  var light = new THREE.PointLight(0xccffcc);
  light.distance = 50;
  light.name = "pointlight";
  scene.add(light);
  return light;
}
function addDirectionalLight(scene, plane) {
  var light = new THREE.DirectionalLight(0xffffff);
  light.position.set(30, 10, -50);
  light.castShadow = true;
  light.shadow.camera.near = 2;
  light.shadow.camera.far = 200;
  light.shadow.camera.fov = 50;
  light.shadow.camera.left = -100;
  light.shadow.camera.right = 100;
  light.shadow.camera.top = 100;
  light.shadow.camera.bottom = -100;
  light.name = "directionallight";
  light.target = plane;
  light.distance = 0;
  light.shadow.mapSize.width = 2048;
  light.shadow.mapSize.height = 2048;
  scene.add(light);
  return light;
}
function addLightSphere(scene) {
  var sphereGeo = new THREE.SphereGeometry(0.2);
  var sphereMat = new THREE.MeshLambertMaterial({ color: 0xffffff });
  var sphere = new THREE.Mesh(sphereGeo, sphereMat);
  sphere.name = "lightsphere";
  scene.add(sphere);
}
function addHemisphereLight(scene) {
  var light = new THREE.HemisphereLight(0x0000ff, 0x00ff00, 0.6);
  light.position.set(0, 500, 0);
  scene.add(light);
}
function addLensFlare(scene, directionalLight) {
  var loader = new THREE.TextureLoader();
  var textureFlare0 = loader.load("/textures/lensflare0.png");
  var textureFlare3 = loader.load("/textures/lensflare3.png");

  var lensflare = new THREE.LensFlare(
    textureFlare0,
    350,
    0.0,
    THREE.AdditiveBlending,
    new THREE.Color(0xffaacc)
  );
  lensflare.add(textureFlare3, 60, 0.6, THREE.AdditiveBlending);
  lensflare.add(textureFlare3, 70, 0.7, THREE.AdditiveBlending);
  lensflare.add(textureFlare3, 120, 0.9, THREE.AdditiveBlending);
  lensflare.add(textureFlare3, 70, 1.0, THREE.AdditiveBlending);

  lensflare.position.copy(directionalLight.position);
  scene.add(lensflare);
}

var phase = 0;
var invert = 1;
function update(scene, camera, renderer, controls) {
  controls.update();
  renderer.render(scene, camera);
  //   var lightsphere = scene.getObjectByName("lightsphere");
  //   if (phase > 2 * Math.PI) {
  //     invert = invert * -1;
  //     phase -= 2 * Math.PI;
  //   } else {
  //     phase += 0.04;
  //   }
  //   lightsphere.position.z = +(7 * Math.sin(phase));
  //   lightsphere.position.x = +(14 * Math.cos(phase));
  //   lightsphere.position.y = 5;
  //   if (invert < 0) {
  //     var pivot = 14;
  //     lightsphere.position.x = invert * (lightsphere.position.x - pivot) + pivot;
  //   }

  //   var pointlight = scene.getObjectByName("pointlight");
  //   pointlight.position.copy(lightsphere.position);
  //   var directionallight = scene.getObjectByName("directionallight");
  //   directionallight.position.copy(lightsphere.position);
  requestAnimationFrame(function() {
    update(scene, camera, renderer, controls);
  });
}

init();
