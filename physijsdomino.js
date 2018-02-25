"use strict";
var scale = chroma.scale(["green", "white"]);
Physijs.scripts.worker = "libs/physijs_worker.js";
Physijs.scripts.ammo = "ammo.js";

function init() {
  var scene = new Physijs.Scene();
  scene.setGravity(new THREE.Vector3(0, -50, 0));
  var renderer = new THREE.WebGLRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);

  document.body.appendChild(renderer.domElement);

  var camera = new THREE.PerspectiveCamera(
    35,
    window.innerWidth / window.innerHeight,
    1,
    1000
  );

  camera.position.set(50, 30, 50);
  camera.lookAt(new THREE.Vector3(10, 0, 10));
  scene.add(camera);
}
function update(scene, camera, renderer) {
  renderer.render(scene, camera);

  requestAnimationFrame(function() {
    update(scene, camera, renderer);
  });
}
init();
