"use strict";
Physijs.scripts.worker = './Physijs-master/physijs_worker.js';
Physijs.scripts.ammo = 'examples/js/ammo.js';

var initScene, render, _boxes = [], spawnBox, loader,
  renderer, ground_material, ground, light, camera;

var sunSphere, sunLight, skydom, starField, sunAngle;

var physics_stats, render_stats, box_material;
var gravityConstant = - 9.8;
var myWorld = new World("viewport");

//
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
// textures
var texture = new THREE.Texture(generateTexture());
var texture2 = new THREE.Texture(generateTexture2());
texture.anisotropy = myWorld.renderer.capabilities.getMaxAnisotropy();
texture.needsUpdate = true;
texture2.anisotropy = myWorld.renderer.capabilities.getMaxAnisotropy();
texture2.needsUpdate = true;

var night_material = new THREE.MeshBasicMaterial({
  vertexColors: THREE.VertexColors,
  map: texture2
});

var day_material = new THREE.MeshLambertMaterial({
  vertexColors: THREE.VertexColors,
  map: texture
});
var lawns = [];

var column_material = new THREE.MeshStandardMaterial({
  //emissive: 0x,
  //emissiveIntensity: 1,
  color: 0x000000
});
var bulb_material = new THREE.MeshStandardMaterial({
  emissive: 0xffffee,
  emissiveIntensity: 1,
  color: 0xffffee
});

var intersections = [];
var cars = [];
var lights = [];
var fireworks = [];
var glowMesh = [];
var dayLight;
var nightLight;


var init = function () {

  myWorld.scene.addEventListener(
    'update',
    function () {
      applyForce();
      console.log("update");
      myWorld.scene.simulate(undefined, 1);
      physics_stats.update();
    }
  );

  render_stats = new Stats();
  render_stats.domElement.style.position = 'absolute';
  render_stats.domElement.style.top = '1px';
  render_stats.domElement.style.zIndex = 100;
  document.getElementById('viewport').appendChild(render_stats.domElement);

  physics_stats = new Stats();
  physics_stats.domElement.style.position = 'absolute';
  physics_stats.domElement.style.top = '50px';
  physics_stats.domElement.style.zIndex = 100;

  document.getElementById('viewport').appendChild(physics_stats.domElement);

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
  // the day duraction in seconds

  // dragcontrol

  var dragControls = new THREE.DragControls(
    draggableObjects,
    myWorld.camera,
    myWorld.renderer.domElement
  );
  dragControls.addEventListener("dragstart", dragStartCallBack);
  dragControls.addEventListener("dragend", dragEndCallBack);

  // Light
  light = new THREE.DirectionalLight(0xFFFFFF);
  light.position.set(20, 40, -15);
  light.target.position.copy(myWorld.scene.position);
  light.castShadow = true;
  light.shadowCameraLeft = -60;
  light.shadowCameraTop = -60;
  light.shadowCameraRight = 60;
  light.shadowCameraBottom = 60;
  light.shadowCameraNear = 20;
  light.shadowCameraFar = 200;
  light.shadowBias = -.0001
  light.shadowMapWidth = light.shadowMapHeight = 2048;
  light.shadowDarkness = .7;

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
  /*
    for (var i = 0; i < 6; i++) {
      var horizontal_road = new Road(24, 0.01, -6 + i * 12, 62, 2, 0, road_texture, myWorld);
      var vertical_road = new Road(-6 + i * 12, 0.02, 24, 62, 2, -90 * (Math.PI / 180), road_texture, myWorld);
    }*/
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
  /*ground_material = new THREE.MeshLambertMaterial({
    color: 0x8B4513,
    side: THREE.DoubleSide
  });*/
  ground_material = Physijs.createMaterial(
    new THREE.MeshLambertMaterial({ color: 0x8B4513 }),
    .8, // high friction
    .4 // low restitution
  );
  ground = new Physijs.BoxMesh(
    new THREE.PlaneGeometry(200, 200, 1, 1),
    ground_material,
    0 // mass
  );

  ground.receiveShadow = true;
  ground.rotation.x = -90 * (Math.PI / 180);
  myWorld.addObject(ground);

  // helicopter
  //var helicopter1 = new Helicopter(myWorld);


  // Lawn
  for (var i = 0; i < 5; i++) {
    for (var j = 0; j < 5; j++) {
      var Lawn1 = new Lawn(i * 12, 0, j * 12, 10, 10, 2000, ground_texture, day_material, night_material, column_material, bulb_material, myWorld);
      lawns.push(Lawn1);
    }
  }



  //firework
  var firework1 = new Firework(myWorld);
  var firework2 = new Firework(myWorld);
  //var firework3 = new Firework(myWorld);
  //var firework4 = new Firework(myWorld);
  fireworks.push(firework1);
  fireworks.push(firework2);
  //fireworks.push(firework3);
  //fireworks.push(firework4);

  // helicopter

  var helicopter = new Helicopter(myWorld);
  // Car
  var car1 = new Car(-6.5, 0, -4, myWorld);
  var car2 = new Car(5.5, 0, 10, myWorld);
  //var car3 = new Car(5.5, 0, 34, myWorld);
  //var car4 = new Car(17.5, 0, 46, myWorld);
  cars.push(car1);
  cars.push(car2);
  //cars.push(car3);
  //cars.push(car4);

  /*var heightMap = THREEx.Terrain.allocateHeightMap(100, 100);
  THREEx.Terrain.simplexHeightMap(heightMap);
  var geometry = THREEx.Terrain.heightMapToPlaneGeometry(heightMap);
  THREEx.Terrain.heightMapToVertexColor(heightMap, geometry)
  // init the material
  var material = new THREE.MeshPhongMaterial({
    shading: THREE.SmoothShading,
    vertexColors: THREE.VertexColors,
  });
  // create the mesh and add it to the scene
  var plane = new THREE.Mesh(geometry, material);
  myWorld.addObject(plane);
  plane.receiveShadow = true;
  plane.rotation.x = -90 * (Math.PI / 180);
  plane.scale.x = 6
  plane.scale.y = 6*/

  console.log(draggableObjects);
  requestAnimationFrame(render);
  myWorld.scene.simulate();

};

var dayUpdate = true;
var nightUpdate = true;
render = function () {
  requestAnimationFrame(render);
  render_stats.update();
  myWorld.render();
  myWorld.controls.update();
  sunSphere.update(sunAngle)
  sunLight.update(sunAngle)
  skydom.update(sunAngle)
  starField.update(sunAngle)
  sunAngle += 0.05 / params.DayNightCycle * Math.PI * 2
  //change building texture
  if (sunAngle > 0 && Math.floor(sunAngle / Math.PI) % 2 == 0 && dayUpdate) {
    for (var i = 0; i < lawns.length; i++) {
      lawns[i].updateDay();
    }
    myWorld.addObject(dayLight);
    myWorld.removeObject(nightLight);
    dayUpdate = false;
    nightUpdate = true;
  } else if ((sunAngle < 0 || Math.floor(sunAngle / Math.PI) % 2 == 1) && nightUpdate) {
    for (var i = 0; i < lawns.length; i++) {
      lawns[i].updateNight();
    }
    myWorld.addObject(nightLight);
    myWorld.removeObject(dayLight);

    nightUpdate = false;
    dayUpdate = true;
  }

  //cars
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
  for (var i = 0; i < fireworks.length; i++) {
    fireworks[i].update();
  }
};

window.onload = init;
