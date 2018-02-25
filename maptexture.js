function init() {
  var scene = new THREE.Scene();
  var renderer = new THREE.WebGLRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setClearColor(0xeeeeee);

  document.body.appendChild(renderer.domElement);
  var camera = new THREE.PerspectiveCamera(
    45,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
  camera.position.set(0, 12, 28);
  camera.lookAt(new THREE.Vector3(0, 0, 0));
  addAmbientLight(scene);
  //   addSpotLight(scene);
  addPointLight(scene);
  var loader = new THREE.TextureLoader();
  addFloor(scene, loader);
  addBumpMapWall(
    scene,
    loader,
    "textures/stone.jpg",
    "textures/stone-bump.jpg",
    -12,
    0.5
  );
  addBumpMapWall(
    scene,
    loader,
    "textures/weave.jpg",
    "textures/weave-bump.jpg",
    12,
    -0.5
  );
  addNormalMapCube(
    scene,
    loader,
    "textures/plaster.jpg",
    "textures/plaster-normal.jpg",
    -27,
    -0.5
  );
  addNormalMapCube(
    scene,
    loader,
    "textures/bathroom.jpg",
    "textures/bathroom-normal.jpg",
    -45,
    -0.5
  );
  addNormalMapCube(
    scene,
    loader,
    "textures/metal-floor.jpg",
    "textures/metal-floor-normal.jpg",
    -63,
    -0.5
  );

  addSpecularMapSphere(
    scene,
    loader,
    "textures/EarthSpec.png",
    "textures/EarthNormal.png",
    40
  );
  var controls = new THREE.OrbitControls(camera);
  update(scene, camera, renderer, controls);
}

function addFloor(scene, loader) {
  var geo = new THREE.PlaneGeometry(200, 100, 0.1, 30);
  geo.faceVertexUvs[1] = geo.faceVertexUvs[0];
  var texture = loader.load("textures/floor-wood.jpg");
  var lightmaptexture = loader.load("textures/lm-1.png");
  var material = new THREE.MeshPhongMaterial({
    color: 0x777777,
    map: texture,
    lightMap: lightmaptexture
  });
  //   var material = new THREE.MeshBasicMaterial({
  //     color: 0x777777,
  //     map: texture,
  //     lightmap: lightmaptexture
  //   });
  var floor = new THREE.Mesh(geo, material);

  floor.position.y = -7.5;
  floor.rotation.x = -Math.PI / 2;
  scene.add(floor);
}
function addAmbientLight(scene) {
  var light = new THREE.AmbientLight(0x242424);
  scene.add(light);
}

function addSpotLight(scene) {
  var light = new THREE.SpotLight();
  light.position.set(0, 30, 50);
  light.intensity = 1.2;
  scene.add(light);
  var cameraHelper = new THREE.CameraHelper(light.shadow.camera);
  scene.add(cameraHelper);
}
function addBumpMapWall(scene, loader, url, bumpurl, positionX, rotationY) {
  var wallGeo = new THREE.BoxGeometry(15, 15, 2);
  var wallTexture = loader.load(url);
  var bumpTexture = loader.load(bumpurl);

  var wallMaterial = new THREE.MeshPhongMaterial();
  wallMaterial.map = wallTexture;
  wallMaterial.bumpMap = bumpTexture;
  wallMaterial.bumpScale = 0.2;

  var wall = new THREE.Mesh(wallGeo, wallMaterial);
  wall.position.x = positionX;
  wall.rotation.y = rotationY;

  scene.add(wall);
}

function addNormalMapCube(scene, loader, url, normapurl, positionX, rotationY) {
  var geo = new THREE.BoxGeometry(15, 15, 15);
  var maptexture = loader.load(url);
  var normalmaptexture = loader.load(normapurl);
  var material = new THREE.MeshPhongMaterial({
    map: maptexture,
    normalmap: normalmaptexture
  });
  var box = new THREE.Mesh(geo, material);
  box.position.x = positionX;
  box.rotation.y = rotationY;

  scene.add(box);
}
function addSpecularMapSphere(scene, loader, url, normalurl, positionX) {
  var geo = new THREE.SphereGeometry(10, 40, 40);
  var specularTexture = loader.load(url);
  var normalTexture = loader.load(normalurl);
  var material = new THREE.MeshPhongMaterial();
  material.specularMap = specularTexture;
  material.specular = new THREE.Color(0xff0000);
  material.shiness = 2;
  material.normalMap = normalTexture;
  var earth = new THREE.Mesh(geo, material);
  earth.position.x = positionX;
  scene.add(earth);
}
function addPointLight(scene) {
  var light = new THREE.PointLight(0xff5808);
  light.name = "pointlight";
  scene.add(light);
  var sphereGeo = new THREE.SphereGeometry(0.2);
  var sphereMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
  var sphereLight = new THREE.Mesh(sphereGeo, sphereMat);
  sphereLight.name = "spherelight";
  sphereLight.position.z = 20;
  sphereLight.position.y = 10;

  scene.add(sphereLight);
}
var phase = 0;
var invert = 1;
function update(scene, camera, renderer, controls) {
  controls.update();
  var spherelight = scene.getObjectByName("spherelight");
  var pointlight = scene.getObjectByName("pointlight");
  if (spherelight) {
    // if (phase <= 0) {
    //   invert = 1;
    // } else if (phase >= Math.PI * 2) {
    //   invert = -1;
    // }
    phase += 0.03;
    if (phase >= Math.PI * 2) {
      phase = 0;
    }

    spherelight.position.x = 56 * Math.sin(phase);
    pointlight.position.copy(spherelight.position);
  }

  renderer.render(scene, camera);
  requestAnimationFrame(function() {
    update(scene, camera, renderer, controls);
  });
}
init();
