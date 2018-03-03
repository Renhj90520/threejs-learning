function init() {
  var scene = new THREE.Scene();

  var renderer = new THREE.WebGLRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);

  document.body.appendChild(renderer.domElement);

  var camera = new THREE.PerspectiveCamera(
    45,
    window.innerWidth / window.innerHeight,
    1,
    1000
  );
  camera.position.set(10, 20, 30);
  camera.lookAt(scene.position);

  var cube = addCube(scene);
  var guiControls = new function() {
    this.rotationSpeed = 0.01;
    this.scale = 1;
    this.x = 0.1;
    this.y = 0.1;
    this.z = 0.1;

    this.a = 0.1;
    this.b = 0.1;
    this.c = 0.1;
    this.d = 0.1;
    this.e = 0.1;
    this.f = 0.1;

    this.theta = 0.1;

    this.doTranslation = function() {
      // new THREE.Matrix4().makeTranslation(3,3,3)
      var translationMatrix = new THREE.Matrix4();
      translationMatrix.set(
        1,
        0,
        0,
        guiControls.x,
        0,
        1,
        0,
        guiControls.y,
        0,
        0,
        1,
        guiControls.z
      );

      //   cube.geometry.applyMatrix(translationMatrix);
      //   cube.geometry.verticesNeedUpdate = true;
      cube.applyMatrix(translationMatrix);
    };
    this.doScale = function() {
      var scaleMatrix = new THREE.Matrix4();
      scaleMatrix.set(
        guiControls.x,
        0,
        0,
        0,
        0,
        guiControls.y,
        0,
        0,
        0,
        0,
        guiControls.z,
        0,
        0,
        0,
        0,
        1
      );

      cube.applyMatrix(scaleMatrix);
    };

    this.doShearing = function() {
      var shearingMatrix = new THREE.Matrix4();
      shearingMatrix.set(
        1,
        this.a,
        this.b,
        0,
        this.c,
        1,
        this.d,
        0,
        this.e,
        this.f,
        1,
        0,
        0,
        0,
        0,
        1
      );

      cube.geometry.applyMatrix(shearingMatrix);
      cube.geometry.verticesNeedUpdate = true;
    };
  }();

  var gui = new dat.GUI();
  gui.add(guiControls, "x", -5, 5).step(0.1);
  gui.add(guiControls, "y", -5, 5).step(0.1);
  gui.add(guiControls, "z", -5, 5).step(0.1);
  gui.add(guiControls, "doTranslation");
  gui.add(guiControls, "doScale");

  gui.add(guiControls, "a", -5, 5).step(0.1);
  gui.add(guiControls, "b", -5, 5).step(0.1);
  gui.add(guiControls, "c", -5, 5).step(0.1);
  gui.add(guiControls, "d", -5, 5).step(0.1);
  gui.add(guiControls, "e", -5, 5).step(0.1);
  gui.add(guiControls, "f", -5, 5).step(0.1);
  gui.add(guiControls, "doShearing");

  var axesHelper = new THREE.AxesHelper(20);
  scene.add(axesHelper);
  update(scene, camera, renderer);
}
function addCube(scene) {
  var cubeGeo = new THREE.BoxGeometry(
    Math.random() * 10,
    Math.random() * 10,
    Math.random() * 10
  );
  var cubeMat = new THREE.MeshNormalMaterial({ transparent: true });
  var cube = new THREE.Mesh(cubeGeo, cubeMat);
  cube.name = "cube";
  scene.add(cube);

  return cube;
}
function update(scene, camera, renderer) {
  renderer.render(scene, camera);

  requestAnimationFrame(function() {
    update(scene, camera, renderer);
  });
}

init();
