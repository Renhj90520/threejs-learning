function init() {
  var scene = new THREE.Scene();

  var renderer = new THREE.WebGLRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);

  document.body.appendChild(renderer.domElement);

  var camera = new THREE.PerspectiveCamera(
    45,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );

  camera.position.x = 120;
  camera.position.y = 60;
  camera.position.z = 180;

  var controls = new THREE.OrbitControls(camera);

  addPlane(scene);
  addCubes(scene);
  addDirectionalLight(scene);
  addLookAtSphere(scene);
  var ambientLight = new THREE.AmbientLight(0x292929);
  scene.add(ambientLight);

  var axesHelper = new THREE.AxesHelper(80);
  scene.add(axesHelper);

  var cameraTypeControl = new function() {
    this.perspective = "Perspective";
    this.switchCamera = function() {
      if (camera instanceof THREE.PerspectiveCamera) {
        camera = new THREE.OrthographicCamera(
          window.innerWidth / -16,
          window.innerWidth / 16,
          window.innerHeight / 16,
          window.innerHeight / -16,
          -200,
          500
        );
        camera.position.x = 120;
        camera.position.y = 60;
        camera.position.z = 180;
        camera.lookAt(new THREE.Vector3(0, 0, 0));
        this.perspective = "Orthographic";
        controls = new THREE.OrbitControls(camera);

        update(scene, camera, renderer, controls);
      } else {
        camera = new THREE.PerspectiveCamera(
          45,
          window.innerWidth / window.innerHeight,
          0.1,
          1000
        );
        camera.position.x = 120;
        camera.position.y = 60;
        camera.position.z = 180;
        this.perspective = "Perspective";
        camera.lookAt(new THREE.Vector3(0, 0, 0));
        controls = new THREE.OrbitControls(camera);

        update(scene, camera, renderer, controls);
      }
    };
  }();

  var gui = new dat.GUI();
  gui.add(cameraTypeControl, "switchCamera");
  gui.add(cameraTypeControl, "perspective").listen();

  update(scene, camera, renderer, controls);
}

function addPlane(scene) {
  var planeGeo = new THREE.PlaneGeometry(180, 180);
  var planeMat = new THREE.MeshLambertMaterial({ color: 0xffffff });
  var plane = new THREE.Mesh(planeGeo, planeMat);

  plane.rotation.x = -0.5 * Math.PI;
  scene.add(plane);
}

function addCubes(scene) {
  var cubeGeometry = new THREE.BoxGeometry(4, 4, 4);

  for (var i = 0; i < 180 / 5; i++) {
    for (var j = 0; j < 180 / 5; j++) {
      var colorRnd = Math.random() * 0.75 + 0.25;
      var cubeMaterial = new THREE.MeshLambertMaterial();
      cubeMaterial.color = new THREE.Color(colorRnd, 0, 0);
      var cube = new THREE.Mesh(cubeGeometry, cubeMaterial);

      cube.position.x = -90 + 2 + i * 5;
      cube.position.z = -90 + 2 + j * 5;
      cube.position.y = 2;
      scene.add(cube);
    }
  }
}

function addDirectionalLight(scene) {
  var light = new THREE.DirectionalLight(0xffffff, 0.7);
  light.position.set(-20, 40, 60);

  scene.add(light);
}

function addLookAtSphere(scene) {
  var sphereGeo = new THREE.SphereGeometry(2);
  var sphereMat = new THREE.MeshLambertMaterial({ color: 0xff0000 });
  var sphere = new THREE.Mesh(sphereGeo, sphereMat);
  sphere.name = "sphere";
  scene.add(sphere);
}
var step = 0;
function update(scene, camera, renderer, controls) {
  controls.update();
  step += 0.02;
  var x = 10 + 100 * Math.sin(step);
  camera.lookAt(new THREE.Vector3(x, 10, 0));

  var sphere = scene.getObjectByName("sphere");
  sphere.position.copy(new THREE.Vector3(x, 10, 0));

  renderer.render(scene, camera);
  requestAnimationFrame(function() {
    update(scene, camera, renderer, controls);
  });
}

init();
