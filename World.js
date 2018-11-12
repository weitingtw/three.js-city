/*
 An implementation of the a World, which takes a Canvas ID as the argument. 
 use World.addObject()/removeObject() to add/remove objects to the scene
 The THREE.TrackballControls is provided by Three.js in its examples.
 */

class World {
  /**
   * Create a World.
   * @param {string} canvasId - The canvasId where the world is rendered in.
   */
  constructor(domId) {
    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    //this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMapSoft = true;
    document.getElementById('viewport').appendChild(this.renderer.domElement);

    this.scene = new Physijs.Scene;
    this.scene.setGravity(new THREE.Vector3(0, -30, 0));
    this.scene.addEventListener(
      'update',
      function () {
        this.scene.simulate(undefined, 1);
        //physics_stats.update();
      }
    );

    this.camera = new THREE.PerspectiveCamera(
      65,
      window.innerWidth / window.innerHeight,
      0.1,
      5000
    );
    this.camera.position.set(30, 30, 30);
    this.camera.lookAt(new THREE.Vector3(200, 0, 200));
    this.scene.add(this.camera);


    // Provided trackball Controls in Three.js examples
    this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement);
    this.controls.target = new THREE.Vector3(20, 0, 20);
    this.controls.maxPolarAngle = Math.PI * 0.45;
    this.controls.minDistance = 1;
    this.controls.maxDistance = 50;
    //this.controls.rotateSpeed = 3.0;
    //this.controls.panSpeed = 2.0;
    /*var object = new THREE.Object3D();
    object.add(this.camera);
    this.controls = new THREE.FlyControls(object, document.getElementById(domId));
    this.controls.movementSpeed = 1.0;
    this.controls.rollSpeed = 0.000;

    this.controls.dragToLook = true;
    this.controls.autoForward = false;

    //this.controls.dragToLook = true;
    this.addObject(object);*/
    //this.controls = new THREE.PointerLockControls(this.camera);
    //var controlsObject = this.controls.getObject();

    //controlsObject.position.set(-5, 1, -5); // set starting point
    //controlsObject.rotation.y = Math.PI; // rotate yaw obj
    //controlsObject.children[0].rotation.x = myEntryPitch; // rotate pitch obj

    //this.addObject(controlsObject);
  }
  /**
   * takes a THREE.js Mesh as the argument and add it to this world
   * @param {object} object a three.js mesh
   **/
  addObject(object) {
    this.scene.add(object);
  }

  /**
   * takes a THREE.js Mesh as the argument and remove it from this world
   * @param {object} object a three.js mesh
   **/
  removeObject(object) {
    this.scene.remove(object);
  }

  /**
   * render the world with a alternative camera
   * @param {object} camera a three.js camera
   **/
  renderwithCamera(camera) {
    this.renderer.render(this.scene, camera);
  }

  /**
   * render the canvas
   **/
  render() {
    this.renderer.render(this.scene, this.camera);
  }
}
