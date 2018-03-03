var scene;
function init() {
  setDragDrop();
  scene = new THREE.Scene();

  var renderer = new THREE.WebGLRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);

  document.body.appendChild(renderer.domElement);

  var camera = new THREE.PerspectiveCamera(
    35,
    window.innerWidth / window.innerHeight,
    1,
    1000
  );

  camera.position.set(15, 16, 13);
  camera.lookAt(scene.position);
  addCube();
  update(scene, camera, renderer);
}

function addCube() {
  var cubeGeometry = new THREE.BoxGeometry(
    Math.random() * 10,
    Math.random() * 10,
    Math.random() * 10
  );
  var loader = new THREE.TextureLoader();
  var map = loader.load("textures/debug.png");
  var material = new THREE.MeshBasicMaterial({
    map: map
  });

  var cube = new THREE.Mesh(cubeGeometry, material);
  cube.name = "cube";

  scene.add(cube);
}
function update(scene, camera, renderer) {
  renderer.render(scene, camera);

  var cube = scene.getObjectByName("cube");
  if (cube) {
    cube.rotation.y += 0.01;
  }
  requestAnimationFrame(function() {
    update(scene, camera, renderer);
  });
}

function setDragDrop() {
  var holder = document.getElementById("holder");
  if (typeof window.FileReader === "undefined") {
    alert("filereader is not supported");
  }

  holder.ondragover = function() {
    this.className = "hover";
    return false;
  };

  holder.ondragend = function() {
    this.className = "";
    return false;
  };

  holder.ondrop = function(e) {
    this.className = "";
    e.preventDefault();

    var file = e.dataTransfer.files[0];
    var reader = new FileReader();
    reader.onload = function(event) {
      console.log(event.target);
      console.log(event);

      holder.style.background =
        "url(" + event.target.result + ") no-repeat center";

      var img = document.createElement("img");
      img.src = event.target.result;
      var texture = new THREE.Texture(img);
      texture.needsUpdate = true;

      scene.getObjectByName("cube").material.map = texture;
    };

    reader.readAsDataURL(file);

    return false;
  };
}

init();
