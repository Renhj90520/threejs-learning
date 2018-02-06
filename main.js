function init() {
  var gui = new dat.GUI();

  var scene = new THREE.Scene();
  var clock = new THREE.Clock();

  // var box = getBox(1, 1, 1);
  var plane = getPlane(20);
  // box.position.y = box.geometry.parameters.height / 2;
  plane.rotation.x = Math.PI / 2;

  // var pointLight = getPointLight(1);
  // pointLight.position.y = 2;
  // pointLight.intensity = 2;
  // gui.add(pointLight, "intensity", 0, 10);
  // gui.add(pointLight.position, "y", 0, 5);

  // var spotLight = getSpotLight(1);
  // spotLight.position.y = 4;
  // spotLight.intensity = 2;
  // gui.add(spotLight.position, "x", 0, 20);
  // gui.add(spotLight.position, "y", 0, 20);
  // gui.add(spotLight.position, "z", 0, 20);
  // gui.add(spotLight, "intensity", 0, 10);
  // gui.add(spotLight, "penumbra", 0, 1);

  var directionalLight = getDirectionalLight(1);
  directionalLight.position.y = 4;
  directionalLight.position.intensity = 2;
  // gui.add(directionalLight.position, "x", 0, 20);
  // gui.add(directionalLight.position, "y", 0, 20);
  // gui.add(directionalLight.position, "z", 0, 20);
  // gui.add(directionalLight, "intensity", 0, 10);
  var helper = new THREE.CameraHelper(directionalLight.shadow.camera);

  // var ambientLight = getAmbientLight(10);
  // scene.add(ambientLight);

  var sphere = getSphere(0.05);
  var boxGrid = getBoxGrid(10, 1.5);
  boxGrid.name = "boxGrid";

  // scene.add(box);
  scene.add(boxGrid);
  scene.add(plane);
  // scene.add(pointLight);
  // pointLight.add(sphere);
  // scene.add(spotLight);
  // spotLight.add(sphere);
  directionalLight.add(sphere);
  scene.add(directionalLight);
  scene.add(helper);

  var camera = new THREE.PerspectiveCamera(
    45,
    window.innerWidth / window.innerHeight,
    1,
    1000
  );

  var cameraZPosition = new THREE.Group();
  var cameraYPosition = new THREE.Group();
  var cameraYRotation = new THREE.Group();
  var cameraXRotation = new THREE.Group();
  var cameraZRotation = new THREE.Group();

  cameraXRotation.name = "cameraXRotation";
  cameraYRotation.name = "cameraYRotation";
  cameraZPosition.name = "cameraZPosition";
  cameraYPosition.name = "cameraYPosition";
  cameraZRotation.name = "cameraZRotation";

  cameraZPosition.add(camera);
  cameraYRotation.add(cameraZPosition);
  cameraXRotation.add(cameraYRotation);
  cameraYPosition.add(cameraXRotation);
  cameraZRotation.add(cameraYPosition);
  scene.add(cameraZRotation);

  cameraXRotation.rotation.x = -Math.PI / 2;
  cameraZPosition.position.z = 100;
  cameraYPosition.position.y = 1;
  var zPStartV = { val: 100 };
  new TWEEN.Tween(zPStartV)
    .to({ val: -50 }, 12000)
    .onUpdate(function() {
      cameraZPosition.position.z = zPStartV.val;
    })
    .start();
  var xRStartV = { val: -Math.PI / 2 };
  new TWEEN.Tween(xRStartV)
    .to({ val: 0 }, 6000)
    .delay(1000)
    .easing(TWEEN.Easing.Quadratic.InOut)
    .onUpdate(function() {
      cameraXRotation.rotation.x = xRStartV.val;
    })
    .start();
  var yRStartV = { val: 0 };
  new TWEEN.Tween(yRStartV)
    .to({ val: Math.PI / 2 }, 6000)
    .delay(1000)
    .easing(TWEEN.Easing.Quadratic.InOut)
    .onUpdate(function() {
      cameraYRotation.rotation.y = yRStartV.val;
    })
    .start();

  gui.add(cameraZPosition.position, "z", 0, 100);
  gui.add(cameraYRotation.rotation, "y", -Math.PI, Math.PI);
  gui.add(cameraXRotation.rotation, "x", -Math.PI, Math.PI);
  gui.add(cameraZRotation.rotation, "z", -Math.PI, Math.PI);

  // var camera = new THREE.OrthographicCamera(-15, 15, 15, -15, 1, 1000);

  // camera.position.x = 1;
  // camera.position.y = 2;
  // camera.position.z = 5;
  // camera.lookAt(new THREE.Vector3(0, 0, 0));

  var renderer = new THREE.WebGLRenderer();
  renderer.shadowMap.enabled = true;
  renderer.setClearColor("rgb(120,120,120)");
  renderer.setSize(window.innerWidth, window.innerHeight);

  document.body.appendChild(renderer.domElement);

  // var controls = new THREE.OrbitControls(camera, renderer.domElement);

  // update(renderer, scene, camera, controls, clock);
  update(renderer, scene, camera, clock);

  return scene;
}

function getBox(w, h, d) {
  var geometry = new THREE.BoxGeometry(1, 1, 1);
  // var material = new THREE.MeshBasicMaterial({
  //     color: 0x00ff00
  // });
  var material = new THREE.MeshPhongMaterial({
    color: "rgb(120,120,120)"
  });
  var mesh = new THREE.Mesh(geometry, material);
  mesh.castShadow = true;
  return mesh;
}

function getBoxGrid(amount, separationMultiplier) {
  var group = new THREE.Group();
  for (var i = 0; i < amount; i++) {
    var obj = getBox(1, 1, 1);
    obj.position.x = i * separationMultiplier;
    obj.position.y = obj.geometry.parameters.height / 2;
    group.add(obj);
    for (var j = 0; j < amount; j++) {
      var obj = getBox(1, 1, 1);
      obj.position.x = i * separationMultiplier;
      obj.position.y = obj.geometry.parameters.height / 2;
      obj.position.z = j * separationMultiplier;
      group.add(obj);
    }
  }

  group.position.x = -(separationMultiplier * (amount - 1)) / 2;
  group.position.z = -(separationMultiplier * (amount - 1)) / 2;
  return group;
}

function getSphere(size) {
  var geometry = new THREE.SphereGeometry(size, size);
  var material = new THREE.MeshBasicMaterial({
    color: "#ffffff"
  });
  var mesh = new THREE.Mesh(geometry, material);
  return mesh;
}

function getPlane(size) {
  var geometry = new THREE.PlaneGeometry(size, size);
  // var material = new THREE.MeshBasicMaterial({
  //     color: 0xff0000,
  //     side: THREE.DoubleSide
  // });
  var material = new THREE.MeshPhongMaterial({
    color: "rgb(120,120,120)",
    side: THREE.DoubleSide
  });
  var mesh = new THREE.Mesh(geometry, material);
  mesh.receiveShadow = true;
  return mesh;
}

function getPointLight(intensity) {
  var light = new THREE.PointLight(0xffffff, intensity);
  light.castShadow = true;
  return light;
}

function getSpotLight(intensity) {
  var light = new THREE.SpotLight(0xffffff, intensity);
  light.castShadow = true;
  light.shadow.bias = 0.001;
  light.shadow.mapSize.width = 2048;
  light.shadow.mapSize.height = 2048;
  return light;
}

function getDirectionalLight(intensity) {
  var light = new THREE.DirectionalLight(0xffffff, intensity);
  light.castShadow = true;
  light.shadow.camera.left = -10;
  light.shadow.camera.bottom = -10;
  light.shadow.camera.right = 10;
  light.shadow.camera.top = 10;
  return light;
}

function getAmbientLight(intensity) {
  var light = new THREE.AmbientLight("rgb(10,30,50)", intensity);
  return light;
}
var scene = init();

//controls,
function update(renderer, scene, camera, clock) {
  renderer.render(scene, camera);
  // controls.update();
  TWEEN.update();
  var timeElapsed = clock.getElapsedTime();

  // var cameraZPosition = scene.getObjectByName("cameraZPosition");
  // cameraZPosition.position.z -= 0.25;

  var cameraZRotation = scene.getObjectByName("cameraZRotation");
  cameraZRotation.rotation.z =
    noise.simplex2(timeElapsed * 1.5, timeElapsed * 1.5) * 0.02;

  // var cameraXRotation = scene.getObjectByName("cameraXRotation");
  // if (cameraXRotation.rotation.x < 0) {
  //   cameraXRotation.rotation.x += 0.01;
  // }
  var boxGrid = scene.getObjectByName("boxGrid");
  boxGrid.children.forEach(function(child, index) {
    var x = timeElapsed + index;
    child.scale.y = (noise.simplex2(x, x) + 1) / 2 + 0.001;
    child.position.y = child.scale.y / 2;
  });
  requestAnimationFrame(function() {
    // update(renderer, scene, camera, controls, clock);
    update(renderer, scene, camera, clock);
  });
}
