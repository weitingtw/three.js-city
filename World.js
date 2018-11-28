/*
 An implementation of the a World, which takes a Canvas ID as the argument. 
 use World.addObject()/removeObject() to add/remove objects to the scene
 The THREE.TrackballControls is provided by Three.js in its examples.
 */

class World {
  /**
   * Create a World.
   * @param {string} domId - The canvasId where the world is rendered in.
   */
  constructor(domId) {
    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.shadowMapSoft = true;
    document.body.appendChild(this.renderer.domElement);

    this.scene = new THREE.Scene();

    this.camera = new THREE.PerspectiveCamera(
      65,
      window.innerWidth / window.innerHeight,
      0.1,
      5000
    );
    this.camera.position.set(-50, 60, -50);
    this.camera.lookAt(new THREE.Vector3(200, 0, 200));
    this.scene.add(this.camera);


    // Provided trackball Controls in Three.js examples
    this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement);
    this.controls.target = new THREE.Vector3(24, 0, 24);
    this.controls.maxPolarAngle = Math.PI * 0.45;
    this.controls.minDistance = 1;
    this.controls.maxDistance = 50;

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
