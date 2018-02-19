function init() {
  var scene = new THREE.Scene();
  var renderer = new THREE.WebGLRenderer({
    antialias: true,
    alpha: true
  });
  renderer.setClearColor(new THREE.Color(0x000000));
  renderer.setSize(window.innerWidth, window.innerHeight);

  document.body.appendChild(renderer.domElement);

  var camera = new THREE.PerspectiveCamera(
    45,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );

  camera.position.x = 0;
  camera.position.y = 0;
  camera.position.z = 150;

  // addSprites(scene);
  // addBasicPointCloud(scene);
  // addRainParticle(scene);
  // addSnowSprite(scene);
  addSpriteFromModel(scene);

  var controls = new THREE.OrbitControls(camera);
  update(scene, camera, renderer, controls);
}

function addSprites(scene) {
  var spriteMaterial = new THREE.SpriteMaterial();
  for (let x = -5; x < 5; x++) {
    for (let y = -5; y < 5; y++) {
      var sprite = new THREE.Sprite(spriteMaterial);
      sprite.position.set(x * 10, y * 10, 0);
      scene.add(sprite);
    }
  }
}
function addBasicPointCloud(scene) {
  var options = {
    size: 4,
    transparent: true,
    opacity: 0.6,
    vertexColors: true,
    color: 0xffffff,
    sizeAttenuation: true,
    depthWrite: false
  };

  var geometry = new THREE.Geometry();
  var pointCloudMaterial = new THREE.PointsMaterial(options);

  var range = 500;
  for (let i = 0; i < 1500; i++) {
    var particle = new THREE.Vector3(
      Math.random() * range - range / 2,
      Math.random() * range - range / 2,
      Math.random() * range - range / 2
    );
    geometry.vertices.push(particle);
    var color = new THREE.Color(0x00ff00);
    color.setHSL(
      color.getHSL().h,
      color.getHSL().s,
      color.getHSL().l * Math.random()
    );
    geometry.colors.push(color);
  }

  var pointCloud = new THREE.Points(geometry, pointCloudMaterial);
  pointCloud.name = "particles";
  scene.add(pointCloud);
}

function addRainParticle(scene) {
  var loader = new THREE.TextureLoader();
  var raindrop = loader.load("textures/raindrop-3.png");
  var geometry = new THREE.Geometry();
  var particleMaterial = new THREE.PointsMaterial({
    size: 3,
    transparent: true,
    opacity: 0.6,
    blending: THREE.AdditiveBlending,
    map: raindrop,
    sizeAttenuation: true,
    color: 0xffffff,
    depthWrite: false
  });

  var range = 40;
  for (let i = 0; i < 1500; i++) {
    var particle = new THREE.Vector3(
      Math.random() * range - range / 2,
      Math.random() * range * 1.5,
      Math.random() * range - range / 2
    );

    particle.velocityY = 0.1 + Math.random() / 5;
    particle.velocityX = (Math.random() - 0.5) / 3;
    geometry.vertices.push(particle);
  }
  geometry.verticesNeedUpdate = true;

  var cloud = new THREE.Points(geometry, particleMaterial);
  cloud.sortParticles = true;
  cloud.name = "particlecloud";
  scene.add(cloud);
}

function addSnowSprite(scene) {
  var loader = new THREE.TextureLoader();
  var snow1 = loader.load("/textures/snowflake1.png");
  var snow2 = loader.load("/textures/snowflake2.png");
  var snow3 = loader.load("/textures/snowflake3.png");
  var snow5 = loader.load("/textures/snowflake5.png");

  createSnow(scene, "snow1", snow1);
  createSnow(scene, "snow2", snow2);
  createSnow(scene, "snow3", snow3);
  createSnow(scene, "snow5", snow5);
}

function createSnow(scene, name, texture) {
  var geometry = new THREE.Geometry();
  var color = new THREE.Color(0xffffff);
  color.setHSL(
    color.getHSL().h,
    color.getHSL().s,
    color.getHSL().l * Math.random()
  );

  var material = new THREE.PointsMaterial({
    size: 6,
    transparent: true,
    opacity: 0.8,
    map: texture,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
    sizeAttenuation: true,
    color: color
  });

  var range = 40;
  for (let i = 0; i < 50; i++) {
    var sprite = new THREE.Vector3(
      Math.random() * range - range / 2,
      Math.random() * range * 1.5,
      Math.random() * range - range / 2
    );
    sprite.velocityY = 0.1 + Math.random() / 5;
    sprite.velocityX = (Math.random() - 0.5) / 3;
    sprite.velocityZ = (Math.random() - 0.5) / 3;
    geometry.vertices.push(sprite);
  }
  geometry.verticesNeedUpdate = true;

  var pointCloud = new THREE.Points(geometry, material);
  pointCloud.name = name;
  pointCloud.sortParticles = true;
  scene.add(pointCloud);
}

function addSpriteFromModel(scene) {
  var canvas = document.createElement("canvas");
  canvas.width = 16;
  canvas.height = 16;

  var context = canvas.getContext("2d");
  var gradient = context.createRadialGradient(
    canvas.width / 2,
    canvas.height / 2,
    0,
    canvas.width / 2,
    canvas.height / 2,
    canvas.width / 2
  );

  gradient.addColorStop(0, "rgba(255,255,255,0)");
  gradient.addColorStop(0.2, "rgba(0,255,255,1)");
  gradient.addColorStop(0.4, "rgba(0,0,64,1)");
  gradient.addColorStop(1, "rgba(0,0,0,1)");

  context.fillStyle = gradient;
  context.fillRect(0, 0, canvas.width, canvas.height);

  var texture = new THREE.Texture(canvas);
  texture.needsUpdate = true;

  var radius = 13,
    tube = 1.7,
    radiusSegments = 156,
    tubularSegments = 12,
    p = 5,
    q = 4,
    heightScale = 3.5;

  var torusknokGeo = new THREE.TorusKnotGeometry(
    radius,
    tube,
    radiusSegments,
    tubularSegments,
    p,
    q
  );
  // torusknokGeo.scale()

  var pointsMaterial = new THREE.PointsMaterial({
    color: 0xffffff,
    size: 3,
    transparent: true,
    blending: THREE.AdditiveBlending,
    map: texture,
    depthWrite: false
  });

  var points = new THREE.Points(torusknokGeo, pointsMaterial);
  points.sortParticles = true;
  scene.add(points);
}

function update(scene, camera, renderer, controls) {
  // var pointCloud = scene.getObjectByName("particles");
  // pointCloud.rotation.x += 0.01;
  // pointCloud.rotation.z += 0.01;

  // var particleCloud = scene.getObjectByName("particlecloud");
  // var vertices = particleCloud.geometry.vertices;
  // vertices.forEach(function(particle) {
  //   particle.y = particle.y - particle.velocityY;
  //   particle.x = particle.x - particle.velocityX;

  //   if (particle.y < 0) {
  //     particle.y = 60;
  //   }

  //   if (particle.x <= -20 || particle.x >= 20) {
  //     particle.velocityX = -1 * particle.velocityX;
  //   }
  // });
  // particleCloud.geometry.verticesNeedUpdate = true;

  // scene.children.forEach(child => {
  //   if (child instanceof THREE.Points) {
  //     var vertices = child.geometry.vertices;
  //     vertices.forEach(vertex => {
  //       vertex.y = vertex.y - vertex.velocityY;
  //       vertex.x = vertex.x - vertex.velocityX;
  //       vertex.z = vertex.z - vertex.velocityZ;

  //       if (vertex.y < 0) {
  //         vertex.y = 60;
  //       }

  //       if (vertex.x <= -20 || vertex.x >= 20) {
  //         vertex.velocityX = vertex.velocityX * -1;
  //       }

  //       if (vertex.z <= -20 || vertex.z >= 20) {
  //         vertex.velocityZ = vertex.z * -1;
  //       }

  //       child.geometry.verticesNeedUpdate = true;
  //     });
  //   }
  // });

  controls.update();
  requestAnimationFrame(function() {
    update(scene, camera, renderer, controls);
  });
  renderer.render(scene, camera);
}

init();
