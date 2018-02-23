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

  camera.position.set(0, 0, 4);
  addSpotLight(scene);
  addHand(scene);
  var axesHelper = new THREE.AxesHelper(20);
  scene.add(axesHelper);
  var controls = new THREE.OrbitControls(camera);
  update(scene, camera, renderer, controls);
}

function addSpotLight(scene) {
  var light = new THREE.SpotLight(0xffffff);
  light.position.set(0, 50, 30);
  light.intensity = 2;

  scene.add(light);
  var cameraHelper = new THREE.CameraHelper(light.shadow.camera);
  scene.add(cameraHelper);
}

function addHand(scene) {
  var jsonLoader = new THREE.JSONLoader();
  jsonLoader.load("models/hand-1.js", function (geometry, mat) {
    var material = new THREE.MeshLambertMaterial({
      color: 0xf0c8c9,
      skinning: true
    });

    var mesh = new THREE.SkinnedMesh(geometry, material);
    mesh.rotation.x = Math.PI / 2;
    mesh.rotation.z = 0.7 * Math.PI;
    mesh.name = "hand";
    scene.add(mesh);

    function onUpdate(posObj) {
      var pos = posObj.pos;
      mesh.skeleton.bones[5].rotation.set(0, 0, pos);
      mesh.skeleton.bones[6].rotation.set(0, 0, pos);
      mesh.skeleton.bones[10].rotation.set(0, 0, pos);
      mesh.skeleton.bones[11].rotation.set(0, 0, pos);
      mesh.skeleton.bones[15].rotation.set(0, 0, pos);
      mesh.skeleton.bones[16].rotation.set(0, 0, pos);
      mesh.skeleton.bones[20].rotation.set(0, 0, pos);
      mesh.skeleton.bones[21].rotation.set(0, 0, pos);
      mesh.skeleton.bones[1].rotation.set(pos, 0, 0);
    }
    var bonesPos = {
      pos: -1
    };
    var tween = new TWEEN.Tween(bonesPos).to({
        pos: 0
      }, 3000)
      .easing(TWEEN.Easing.Cubic.InOut)
      .yoyo(true)
      .repeat(Infinity).onUpdate(function () {
        onUpdate(bonesPos)
      });

    tween.start();

  });
}

function update(scene, camera, renderer, controls) {
  controls.update();
  renderer.render(scene, camera);
  TWEEN.update();
  requestAnimationFrame(function () {
    update(scene, camera, renderer, controls);
  });
}

init();