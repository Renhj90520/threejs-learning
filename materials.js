function init() {
  var scene = new THREE.Scene();
  var renderer = new THREE.WebGLRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);
  //   renderer.setClearColor(0xeeeeee);
  renderer.setClearColor(new THREE.Color(0x000000));
  renderer.shadowMap.enabled = true;

  document.body.appendChild(renderer.domElement);

  var camera = new THREE.PerspectiveCamera(
    45,
    window.innerWidth / window.innerHeight,
    10,
    130
  );

  camera.position.x = -50;
  camera.position.y = 40;
  camera.position.z = 50;
  camera.near = 10;
  camera.far = 100;
  camera.lookAt(scene.position);
  addSpotLight(scene);
  addPlane(scene);

  //   var basicMaterial = new THREE.MeshBasicMaterial({ color: 0x7777ff });
  //   addCube(scene, basicMaterial);

  var uicontrols = new function() {
    this.cameraNear = camera.near;
    this.cameraFar = camera.far;
    this.addCube = function() {
      var cubeSize = Math.ceil(3 + Math.random() * 3);
      var cubeGeo = new THREE.CubeGeometry(cubeSize, cubeSize, cubeSize);
      var depthMat = new THREE.MeshDepthMaterial();
      //   var depthMat = new THREE.MeshLambertMaterial({
      //     color: Math.random() * 0xffffff
      //   });
      var cube = new THREE.Mesh(cubeGeo, depthMat);
      cube.castShadow = true;

      cube.position.x = -60 + Math.round(Math.random() * 100);
      cube.position.y = Math.round(Math.random() * 10);
      cube.position.z = -100 + Math.round(Math.random() * 150);

      scene.add(cube);
    };
  }();
  var controls = new THREE.OrbitControls(camera);

  var gui = new dat.GUI();
  gui.add(uicontrols, "addCube");
  gui.add(uicontrols, "cameraNear", 0, 50).onChange(function(e) {
    camera.near = e;
  });
  gui.add(uicontrols, "cameraFar", 50, 200).onChange(function(e) {
    camera.far = e;
  });

  var i = 0;
  while (i < 10) {
    uicontrols.addCube();
    i++;
  }

  update(scene, camera, renderer, controls);
}

function addPlane(scene) {
  var planeGeo = new THREE.PlaneGeometry(100, 100, 4, 4);
  var planeMat = new THREE.MeshLambertMaterial({ color: 0x777777 });
  planeMat.side = THREE.DoubleSide;
  var plane = new THREE.Mesh(planeGeo, planeMat);
  plane.rotation.x = -0.5 * Math.PI;
  plane.receiveShadow = true;
  scene.add(plane);
  return plane;
}

function addSpotLight(scene) {
  var light = new THREE.SpotLight(0xffffff);
  light.position.set(-40, 60, -10);
  light.castShadow = true;

  scene.add(light);
}

function addCube(scene, material) {
  var cubeGeo = new THREE.BoxGeometry(15, 15, 15);
  var cube = new THREE.Mesh(cubeGeo, material);
  cube.castShadow = true;
  cube.name = "cube";
  cube.position.set(0, 3, 2);

  scene.add(cube);
}

function update(scene, camera, renderer, controls) {
  controls.update();
  //   var cube = scene.getObjectByName("cube");
  //   cube.rotation.y += 0.01;
  renderer.render(scene, camera);
  requestAnimationFrame(function() {
    update(scene, camera, renderer, controls);
  });
}

init();
