var initScene, render, ground_material, light, ground;
var sunSphere, sunLight, skydom, starField, sunAngle;
var myWorld = new World("viewport");

// UI parameters
var params = {
  DayNightCycle: 100,
  addHouse: function () {
    addHouse(myWorld);
  },
  addMirror: function () {
    addMirror(myWorld);
  },
  addFog: function () {
    var fogColor = new THREE.Color(0x999999);
    myWorld.scene.background = fogColor;
    myWorld.scene.fog = new THREE.Fog(fogColor, 0.0025, 50);
  }
}
var dayDuration = params.DayNightCycle;
setupUI();

// house textures
var texture = new THREE.Texture(generateTexture());
var texture2 = new THREE.Texture(generateTexture2());
texture.anisotropy = myWorld.renderer.capabilities.getMaxAnisotropy();
texture.needsUpdate = true;
texture2.anisotropy = myWorld.renderer.capabilities.getMaxAnisotropy();
texture2.needsUpdate = true;


// house materials
var night_material = new THREE.MeshBasicMaterial({
  vertexColors: THREE.VertexColors,
  map: texture2
});

var day_material = new THREE.MeshLambertMaterial({
  vertexColors: THREE.VertexColors,
  map: texture
});


// streetlight material
var column_material = new THREE.MeshStandardMaterial({
  color: 0x000000
});
var bulb_material = new THREE.MeshStandardMaterial({
  emissive: 0xffffee,
  emissiveIntensity: 1,
  color: 0xffffee
});

// store objects for update purpose
var lawns = [];
var lights = [];
var intersections = [];
var cars = [];
var fireworks = [];
var campfires = [];

// global objects used in render loop and initialization
var dayLight;
var nightLight;
var dayUpdate = true;
var nightUpdate = true;
var bufferScene;
var reflectionTexture;
var refractionTexture;
var reflection_clippingPlane;

var waterClippingPlane1;
var waterClippingPlane2;
var water;
var watery;
var water_camera;

var PI = Math.PI
var cos = Math.cos
var sin = Math.sin
var frame = 0
var fireLife = 70

// for water shader;
var water_mix;
var move_factor = 0;


var init = function () {

  // day and night
  sunSphere = new THREEx.DayNight.SunSphere()
  myWorld.addObject(sunSphere.object3d)

  sunLight = new THREEx.DayNight.SunLight()
  myWorld.addObject(sunLight.object3d)
  skydom = new THREEx.DayNight.Skydom()
  myWorld.addObject(skydom.object3d)

  starField = new THREEx.DayNight.StarField()
  myWorld.addObject(starField.object3d)

  sunAngle = -1 / 6 * Math.PI * 2;

  // dragcontrol
  var dragControls = new THREE.DragControls(
    draggableObjects,
    myWorld.camera,
    myWorld.renderer.domElement
  );
  dragControls.addEventListener("dragstart", dragStartCallBack);
  dragControls.addEventListener("dragend", dragEndCallBack);


  // day night ambient light
  nightLight = new THREE.AmbientLight(0x404040);
  nightLight.intensity = 0.5;
  dayLight = new THREE.AmbientLight(0x999999);
  dayLight.intensity = 0.5;

  // Ground
  var ground_texture;
  var textureLoader = new THREE.TextureLoader();
  var ground_texture = new textureLoader.load("images/mud.jpg");

  // road
  var road_texture = new textureLoader.load("images/road.jpg");
  for (var i = 0; i < 31; i++) {
    for (var j = 0; j < 31; j++) {
      if (i % 6 != 0) {
        var horizontal_road = new Road(-6 + 2 * i, 0.01, -6 + 2 * j, 2, 2, -90 * (Math.PI / 180), road_texture, myWorld);
      } else {
        var vertical_road = new Road(-6 + 2 * i, 0.01, -6 + 2 * j, 2, 2, 0, road_texture, myWorld);
      }
    }
  }

  // intersection
  var intersection_texture = new textureLoader.load("images/cement.jpg");
  for (var i = 0; i < 6; i++) {
    for (var j = 0; j < 6; j++) {
      var boundary1 = null;
      var boundary2 = null;
      if (i == 0) {
        boundary1 = "east";
      } else if (i == 5) {
        boundary1 = "west";
      }
      if (j == 0) {
        boundary2 = "south";
      } else if (j == 5) {
        boundary2 = "north"
      }
      intersections.push(new Intersection(-6 + i * 12, 0.03, -6 + j * 12, 2, 2, intersection_texture, myWorld, boundary1, boundary2));
    }
  }

  // ground
  ground_material = new THREE.MeshLambertMaterial({
    color: 0x8B4513,
    side: THREE.DoubleSide
  });
  var ground_geometry = new THREE.PlaneGeometry(200, 200, 1, 1);
  ground = new THREE.Mesh(ground_geometry, ground_material);
  ground.receiveShadow = true;
  ground.rotation.x = -90 * (Math.PI / 180);
  myWorld.addObject(ground);

  // Lawn
  for (var i = 0; i < 5; i++) {
    for (var j = 0; j < 5; j++) {
      if (i != 2 || j != 2) {
        var Lawn1 = new Lawn(i * 12, 0, j * 12, 10, 10, 2000, ground_texture, day_material, night_material, column_material, bulb_material, myWorld);
        lawns.push(Lawn1);
      }
    }
  }

  //firework
  var firework1 = new Firework(myWorld);
  var firework2 = new Firework(myWorld);
  var firework3 = new Firework(myWorld);
  fireworks.push(firework1);
  fireworks.push(firework2);
  fireworks.push(firework3);

  //tree
  var loader = new THREE.FBXLoader();
  loader.load('./models/tree.fbx', function (object) {
    object.scale.x = 0.005;
    object.scale.y = 0.005;
    object.scale.z = 0.005;
    object.position.x = -8;
    object.position.y = 0;
    object.position.z = -8;

    object.traverse(function (child) {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });

    for (var i = 0; i < 8; i++) {
      var newTree = object.clone(true);
      var x = -8;
      var y = 0;
      var z = -8 + i * 8;
      var rot = Math.random() * Math.PI;
      newTree.applyMatrix(new THREE.Matrix4().makeRotationY(rot));
      newTree.position.x = x;
      newTree.position.y = y;
      newTree.position.z = z;
      newTree.scale.x = 0.005;
      newTree.scale.y = 0.005;
      newTree.scale.z = 0.005;
      myWorld.addObject(newTree);
    }

    for (var i = 0; i < 8; i++) {
      var newTree = object.clone(true);
      var x = 56;
      var y = 0;
      var z = -8 + i * 8;
      var rot = Math.random() * Math.PI;
      newTree.applyMatrix(new THREE.Matrix4().makeRotationY(rot));
      newTree.position.x = x;
      newTree.position.y = y;
      newTree.position.z = z;
      newTree.scale.x = 0.005;
      newTree.scale.y = 0.005;
      newTree.scale.z = 0.005;
      myWorld.addObject(newTree);
    }

  });

  // Car
  var car1 = new Car(-6.5, 0, -4, myWorld);
  var car2 = new Car(5.5, 0, 10, myWorld);
  var car3 = new Car(29.5, 0, 40, myWorld);
  var car4 = new Car(41.5, 0, 30, myWorld);

  cars.push(car1);
  cars.push(car2);
  cars.push(car3);
  cars.push(car4);


  //water 
  water_mix = 0.1;
  watery = 0.2;
  var dudvTexture = new textureLoader.load("images/waterdudv.jpg");
  var normalMapTexture = new textureLoader.load("images/normal.jpg");
  reflectionTexture = new THREE.WebGLRenderTarget(window.innerWidth, window.innerHeight,
    { minFilter: THREE.LinearFilter, magFilter: THREE.NearestFilter });

  refractionTexture = new THREE.WebGLRenderTarget(window.innerWidth, window.innerHeight,
    { minFilter: THREE.LinearFilter, magFilter: THREE.NearestFilter });

  var uniforms = {
    lightPosition: { type: "v3", value: sunLight.object3d.position },
    lightColor: { type: "c", value: sunLight.object3d.color },
    move_factor: { type: "f", value: move_factor },
    water_mix: { type: "f", value: water_mix },
    dudv: { type: "t", value: dudvTexture },
    normalMap: { type: "t", value: normalMapTexture },
    reflectionTexture: { type: "t", value: reflectionTexture },
    refractionTexture: { type: "t", value: ground_texture }
  };

  var water_material = new THREE.ShaderMaterial({
    uniforms: uniforms,
    vertexShader: document.getElementById('vertexShader').textContent,
    fragmentShader: document.getElementById('fragmentShader').textContent
  });

  var water_geometry = new THREE.PlaneGeometry(10, 10, 1, 1);

  water = new THREE.Mesh(water_geometry, water_material);
  water.position.y = watery;
  water.position.x = 24;
  water.position.z = 24;
  water.rotation.x = -90 * (Math.PI / 180);
  myWorld.addObject(water);

  // water_camera for capturing reflection
  water_camera = new THREE.PerspectiveCamera(
    35,
    window.innerWidth / window.innerHeight,
    0.1,
    5000
  );

  // clipping planes for water_camera
  waterClippingPlane1 = new THREE.Plane(new THREE.Vector3(0, 1, 0), -watery);
  waterClippingPlane2 = new THREE.Plane(new THREE.Vector3(0, 0, 0), -1);
  myWorld.renderer.localClippingEnabled = true;

  requestAnimationFrame(render);

};

// main render loop
render = function () {
  requestAnimationFrame(render);

  /* water shader update */
  move_factor += 0.001;
  water.material.uniforms.move_factor.value = move_factor;
  water.material.uniforms.lightPosition.value = sunLight.object3d.position;
  move_factor %= 1;
  // store reflection texture
  var distance = myWorld.camera.position.y * 2;
  myWorld.renderer.clippingPlanes = [waterClippingPlane1];
  water_camera.position.set(myWorld.camera.position.x, myWorld.camera.position.y - distance, myWorld.camera.position.z);
  water_camera.lookAt(new THREE.Vector3(24, 0, 24));
  myWorld.renderer.render(myWorld.scene, water_camera, reflectionTexture);

  myWorld.renderer.clippingPlanes = [waterClippingPlane2];
  myWorld.render();
  myWorld.controls.update();

  // day night
  sunSphere.update(sunAngle)
  sunLight.update(sunAngle)
  skydom.update(sunAngle)
  starField.update(sunAngle)
  sunAngle += 0.05 / params.DayNightCycle * Math.PI * 2

  //update day night texture and variables
  if (sunAngle > 0 && Math.floor(sunAngle / Math.PI) % 2 == 0 && dayUpdate) {
    for (var i = 0; i < lawns.length; i++) {
      lawns[i].updateDay();
    }
    myWorld.addObject(dayLight);
    myWorld.removeObject(nightLight);
    water_mix = 0.3;
    water.material.uniforms.water_mix.value = water_mix;

    dayUpdate = false;
    nightUpdate = true;
  } else if ((sunAngle < 0 || Math.floor(sunAngle / Math.PI) % 2 == 1) && nightUpdate) {
    for (var i = 0; i < lawns.length; i++) {
      lawns[i].updateNight();
    }
    myWorld.addObject(nightLight);
    myWorld.removeObject(dayLight);
    water_mix = 0.1;
    water.material.uniforms.water_mix.value = water_mix;

    nightUpdate = false;
    dayUpdate = true;
  }

  //fire 
  for (var i = 0; i < campfires.length; i++) {
    campfires[i].update();
  }

  //car movement
  for (var j = 0; j < cars.length; j++) {
    var no_intersection = true;
    for (var i = 0; i < intersections.length; i++) {
      if (intersections[i].intersect(cars[j])) {
        if (cars[j].isTurning == false) {
          intersections[i].pickDirection(cars[j]);
          no_intersection = false
        } else {
          no_intersection = false;
        }
      }
    }
    if (no_intersection) {
      cars[j].isTurning = false;
      cars[j].t = 0;
    }
  }
  for (var i = 0; i < cars.length; i++) {
    cars[i].advance();
  }

  // firework
  for (var i = 0; i < fireworks.length; i++) {
    fireworks[i].update();
  }
};

window.onload = init;
