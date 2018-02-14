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

  // var normalMaterial = new THREE.MeshNormalMaterial({
  //   color: 0x7777ff
  // });
  // var cube = addCube(scene, normalMaterial);
  // for (let i = 0; i < cube.geometry.faces.length; i++) {
  //   var face = cube.geometry.faces[i];
  //   var centroid = new THREE.Vector3(0, 0, 0);

  //   centroid.add(cube.geometry.vertices[face.a]);
  //   centroid.add(cube.geometry.vertices[face.b]);
  //   centroid.add(cube.geometry.vertices[face.c]);
  //   centroid.divideScalar(3);

  //   var arrow = new THREE.ArrowHelper(face.normal, centroid, 2, 0x3333ff, 0.5, 0.5);
  //   cube.add(arrow);
  // }
  // var mats = [];
  // mats.push(new THREE.MeshBasicMaterial({
  //   color: 0x009e60
  // }));
  // mats.push(new THREE.MeshBasicMaterial({
  //   color: 0x009e60
  // }));
  // mats.push(new THREE.MeshBasicMaterial({
  //   color: 0x0051ba
  // }));
  // mats.push(new THREE.MeshBasicMaterial({
  //   color: 0x0051ba
  // }));
  // mats.push(new THREE.MeshBasicMaterial({
  //   color: 0xffd500
  // }));
  // mats.push(new THREE.MeshBasicMaterial({
  //   color: 0xffd500
  // }));
  // mats.push(new THREE.MeshBasicMaterial({
  //   color: 0xff5800
  // }));
  // mats.push(new THREE.MeshBasicMaterial({
  //   color: 0xff5800
  // }));
  // mats.push(new THREE.MeshBasicMaterial({
  //   color: 0xC41E3A
  // }));
  // mats.push(new THREE.MeshBasicMaterial({
  //   color: 0xC41E3A
  // }));
  // mats.push(new THREE.MeshBasicMaterial({
  //   color: 0xffffff
  // }));
  // mats.push(new THREE.MeshBasicMaterial({
  //   color: 0xffffff
  // }));
  // var faceMaterial = new THREE.MeshFaceMaterial(mats);
  // var group = new THREE.Mesh();
  // for (let x = 0; x < 3; x++) {
  //   for (let y = 0; y < 3; y++) {
  //     for (let z = 0; z < 3; z++) {
  //       var cubeGeo = new THREE.BoxGeometry(2.9, 2.9, 2.9);
  //       var cube = new THREE.Mesh(cubeGeo, faceMaterial);
  //       cube.position.set(x * 3 - 3, y * 3, z * 3 - 3);
  //       group.add(cube);
  //     }
  //   }
  // }
  // scene.add(group);
  // addCube(scene, faceMaterial);

  // var lambertMaterial = new THREE.MeshLambertMaterial({
  //   color: 0x7777ff
  // });
  // addCube(scene, lambertMaterial);
  var standardMaterial = new THREE.MeshStandardMaterial({
    color: 0x7777ff
  });
  console.log(standardMaterial);
  var gui = new dat.GUI();
  gui.add(standardMaterial, "opacity", 0, 1);
  gui.add(standardMaterial, "transparent");
  gui.addColor(standardMaterial, "emissive");
  gui.add(standardMaterial, "metalness", 0, 1);
  addCube(scene, standardMaterial);

  var uicontrols = new function() {
    this.cameraNear = camera.near;
    this.cameraFar = camera.far;
    this.addCube = function() {
      var cubeSize = Math.ceil(3 + Math.random() * 3);
      var cubeGeo = new THREE.BoxGeometry(cubeSize, cubeSize, cubeSize);
      var depthMat = new THREE.MeshDepthMaterial();
      //   var depthMat = new THREE.MeshLambertMaterial({
      //     color: Math.random() * 0xffffff
      //   });
      var colorMat = new THREE.MeshBasicMaterial({
        color: 0xff0000,
        transparent: true,
        blending: THREE.MultiplyBlending
      });
      // var cube = new THREE.Mesh(cubeGeo, depthMat);
      var cube = new THREE.SceneUtils.createMultiMaterialObject(cubeGeo, [
        colorMat,
        depthMat
      ]);
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

  // var i = 0;
  // while (i < 10) {
  //   uicontrols.addCube();
  //   i++;
  // }

  update(scene, camera, renderer, controls);
}

function addPlane(scene) {
  var planeGeo = new THREE.PlaneGeometry(100, 100, 4, 4);
  var planeMat = new THREE.MeshLambertMaterial({
    color: 0x777777
  });
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
  return cube;
}

function update(scene, camera, renderer, controls) {
  controls.update();
  // var cube = scene.getObjectByName("cube");
  // cube.rotation.y += 0.01;
  renderer.render(scene, camera);
  requestAnimationFrame(function() {
    update(scene, camera, renderer, controls);
  });
}

init();
