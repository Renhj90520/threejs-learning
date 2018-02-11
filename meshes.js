function init() {
  var scene = new THREE.Scene();

  var renderer = new THREE.WebGLRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setClearColor(new THREE.Color(0xeeeeee));
  renderer.shadowMap.enabled = true;

  var camera = new THREE.PerspectiveCamera(
    45,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );

  camera.position.x = -30;
  camera.position.y = 40;
  camera.position.z = 30;

  var ambientLight = getAmbientLight();
  scene.add(ambientLight);

  var spotLight = getSpotLight();
  scene.add(spotLight);

  var plane = getPlane();
  scene.add(plane);
  var step = 0;
  var uicontrols = new function() {
    this.rotationSpeed = 0.02;
    this.numberOfObjects = scene.children.length;

    this.removeCube = function() {
      var children = scene.children;
      var lastObj = children[children.length - 1];
      if (lastObj instanceof THREE.Mesh && lastObj !== plane) {
        scene.remove(lastObj);
        this.numberOfObjects = scene.children.length;
      }
    };

    this.addCube = function() {
      var cubeSize = Math.ceil(Math.random() * 3);
      var cubeGeo = new THREE.BoxGeometry(cubeSize, cubeSize, cubeSize);
      var cubeMat = new THREE.MeshLambertMaterial({
        color: Math.random() * 0xffffff
      });

      var cube = new THREE.Mesh(cubeGeo, cubeMat);
      cube.castShadow = true;
      cube.position.x =
        -30 + Math.round(Math.random() * plane.geometry.parameters.width);
      cube.position.y = Math.random() * 5;
      cube.position.z =
        -20 + Math.round(Math.random() * plane.geometry.parameters.height);

      scene.add(cube);
      this.numberOfObjects = scene.children.length;
    };
  }();

  var gui = new dat.GUI();
  gui.add(uicontrols, "rotationSpeed", 0, 0.5);
  gui.add(uicontrols, "addCube");
  gui.add(uicontrols, "removeCube");
  gui.add(uicontrols, "numberOfObjects").listen();

  var controls = new THREE.OrbitControls(camera);

  document.body.appendChild(renderer.domElement);

  update(scene, camera, renderer, controls, uicontrols);
}

function getPlane() {
  var planeGeo = new THREE.PlaneGeometry(60, 40, 1, 1);
  var planeMat = new THREE.MeshLambertMaterial({ color: 0xffffff });
  planeMat.side = THREE.DoubleSide;
  var plane = new THREE.Mesh(planeGeo, planeMat);
  plane.rotation.x = -0.5 * Math.PI;
  return plane;
}

function getSpotLight() {
  var spotLight = new THREE.SpotLight(0xffffff);
  spotLight.position.set(-40, 60, -10);
  spotLight.castShadow = true;
  return spotLight;
}

function getAmbientLight() {
  var ambientLight = new THREE.AmbientLight(0x0c0c0c);
  return ambientLight;
}

function update(scene, camera, renderer, controls, uicontrols) {
  controls.update();
  scene.traverse(function(mesh) {
    if (mesh instanceof THREE.Mesh && mesh !== scene.children[2]) {
      console.log(scene.children[2]);
      mesh.rotation.x += uicontrols.rotationSpeed;
      mesh.rotation.y += uicontrols.rotationSpeed;
      mesh.rotation.z += uicontrols.rotationSpeed;
    }
  });

  renderer.render(scene, camera);
  requestAnimationFrame(function() {
    update(scene, camera, renderer, controls, uicontrols);
  });
}

init();
