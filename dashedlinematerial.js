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

  camera.position.set(10, 20, 10);

  var controls = new THREE.OrbitControls(camera);

  addSphere(scene);
  // addSphereFrame(scene);

  var gui = new dat.GUI();
  gui.add(guiControls, "rotationX", 0, 1);
  gui.add(guiControls, "rotationY", 0, 1);
  gui.add(guiControls, "rotationZ", 0, 1);
  gui.add(guiControls, "dashSize", 0, 1);
  gui.add(guiControls, "gapSize", 0, 3);
  update(scene, camera, renderer, controls);
}
var guiControls = new function() {
  this.rotationX = 0.0;
  this.rotationY = 0.01;
  this.rotationZ = 0.0;

  this.dashSize = 0.001;
  this.gapSize = 1;
}();
function addSphere(scene) {
  var sphereGeo = new THREE.SphereGeometry(6, 64, 64);
  var lineBasicMaterial = new THREE.LineBasicMaterial({
    linewidth: 2,
    color: 0xffc3c3
  });
  var lineDashedMaterial = new THREE.LineDashedMaterial({
    color: 0xffc3c3,
    dashSize: 3,
    scale: 1,
    gapSize: 1,
    linewidth: 5
  });

  var linegeo = geo2line(sphereGeo);
  var torusLine = new THREE.Line(
    linegeo,
    lineDashedMaterial,
    THREE.LineSegments
  );
  torusLine.position.set(2.5, 6, 2.5);
  torusLine.name = "line";
  scene.add(torusLine);
}
function geo2line(geo) {
  var geometry = new THREE.Geometry();
  var vertices = geometry.vertices;
  for (let i = 0; i < geo.faces.length; i++) {
    var face = geo.faces[i];
    if (face instanceof THREE.Face3) {
      vertices.push(geo.vertices[face.a].clone());
      vertices.push(geo.vertices[face.b].clone());
      vertices.push(geo.vertices[face.b].clone());
      vertices.push(geo.vertices[face.c].clone());
      vertices.push(geo.vertices[face.c].clone());
      vertices.push(geo.vertices[face.a].clone());
    } else if (face instanceof THREE.Face4) {
      vertices.push(geo.vertices[face.a].clone());
      vertices.push(geo.vertices[face.b].clone());
      vertices.push(geo.vertices[face.b].clone());
      vertices.push(geo.vertices[face.c].clone());
      vertices.push(geo.vertices[face.c].clone());
      vertices.push(geo.vertices[face.d].clone());
      vertices.push(geo.vertices[face.d].clone());
      vertices.push(geo.vertices[face.a].clone());
    }
  }
  geometry.computeLineDistances();
  return geometry;
}
function addSphereFrame(scene) {
  var sphereGeo = new THREE.SphereGeometry(6, 64, 64);
  var material = new THREE.MeshBasicMaterial({
    wireframe: true
  });
  var sphere = new THREE.Mesh(sphereGeo, material);
  sphere.position.set(2.5, 6, 2.5);
  scene.add(sphere);
}
var ani = 0;
function update(scene, camera, renderer, controls) {
  controls.update();
  renderer.render(scene, camera);
  var line = scene.getObjectByName("line");
  line.rotation.x += guiControls.rotationX;
  line.rotation.y += guiControls.rotationY;
  line.rotation.z += guiControls.rotationZ;

  if (ani < 1 && ani > 0) {
    ani += 0.001;
    line.material.dashSize = ani;
    guiControls.dashSize = ani;
  } else if (ani > 1) {
    ani *= -1;
    ani += 0.001;
    line.material.dashSize = ani * -1;
    guiControls.dashSize = ani * -1;
  } else {
    ani += 0.001;
    line.material.dashSize = ani * -0.001;
    guiControls.dashSize = ani * -0.001;
  }
  requestAnimationFrame(function() {
    update(scene, camera, renderer, controls);
  });
}

init();
