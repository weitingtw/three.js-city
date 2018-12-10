class Car {
    constructor(x, y, z, world) {
        var cone_body_geometry = new THREE.ConeGeometry(0.1, 1, 8);
        var cube_body_geometry = new THREE.CubeGeometry(0.2, 0.2, 1);
        var wheel_geometry = new THREE.CylinderGeometry(0.1, 0.1, 0.2, 20);
        var wheel_geometry2 = new THREE.CylinderGeometry(0.2, 0.2, 0.2, 20);
        var material = new THREE.MeshLambertMaterial({
            color: 0xfff111
        });
        var wheel_material = new THREE.MeshLambertMaterial({
            color: 0x11ff11
        });

        var cone_body_mesh = new THREE.Mesh(cone_body_geometry, material);
        cone_body_mesh.position.x = 0;
        cone_body_mesh.position.y = 0.2;
        cone_body_mesh.position.z = 1;
        cone_body_mesh.rotation.x += Math.PI / 2;
        //cone_body_mesh.rotation.z += Math.PI / 2;
        var cube_body_mesh = new THREE.Mesh(cube_body_geometry, material);
        cube_body_mesh.position.x = 0;
        cube_body_mesh.position.y = 0.2;
        cube_body_mesh.position.z = 0;
        var wheel1_mesh = new THREE.Mesh(wheel_geometry, wheel_material);
        wheel1_mesh.position.x = - 0.15;
        wheel1_mesh.position.y = 0.1;
        wheel1_mesh.position.z = 1;
        wheel1_mesh.rotation.z += Math.PI / 2;
        var wheel2_mesh = new THREE.Mesh(wheel_geometry, wheel_material);
        wheel2_mesh.position.x = 0.15;
        wheel2_mesh.position.y = 0.1;
        wheel2_mesh.position.z = 1;
        wheel2_mesh.rotation.z += Math.PI / 2;
        var wheel3_mesh = new THREE.Mesh(wheel_geometry2, wheel_material);
        wheel3_mesh.position.x = 0.2;
        wheel3_mesh.position.y = 0.2;
        wheel3_mesh.position.z = 0;
        wheel3_mesh.rotation.z += Math.PI / 2;
        var wheel4_mesh = new THREE.Mesh(wheel_geometry2, wheel_material);
        wheel4_mesh.position.x = - 0.2;
        wheel4_mesh.position.y = + 0.2;
        wheel4_mesh.position.z = 0;
        wheel4_mesh.rotation.z += Math.PI / 2;

        // spotlight

        var spotlight = new THREE.SpotLight(0xffee88, 2, 3, 0.5);
        spotlight.position.set(0, 0.3, 1);
        var target = new THREE.Object3D();
        spotlight.target = target;
        spotlight.target.position.set(0, 0.3, 2);
        spotlight.shadowMapVisible = true;
        lights.push(spotlight);
        //var spotLightHelper = new THREE.SpotLightHelper(spotlight);

        //var pointlight = new THREE.PointLight(0xffee88, 2, 2, 2);
        //pointlight.position.set(0, 0.5, 1.5);
        this.car = new THREE.Group();

        this.car.add(cone_body_mesh);
        this.car.add(cube_body_mesh);
        this.car.add(wheel1_mesh);
        this.car.add(wheel2_mesh);
        this.car.add(wheel3_mesh);
        this.car.add(wheel4_mesh);
        this.car.add(spotlight);
        this.car.add(target);
        //this.car.add(spotLightHelper);

        this.car.position.x = x;
        this.car.position.y = y;
        this.car.position.z = z;
        world.addObject(this.car);
        this.direction = new THREE.Vector3();
        this.car.getWorldDirection(this.direction)
        this.position = new THREE.Vector3(x, y, z);
        this.isTurning = false;
        this.t = 0;
        this.curve = null;

    }

    advance() {
        if (this.isTurning && this.t <= 0.98) {
            if (this.curve == "straight") {
                this.car.position.x += this.direction.x / 15;
                this.car.position.y += this.direction.y / 15;
                this.car.position.z += this.direction.z / 15;
            } else {
                this.car.position.x = this.curve.getPointAt(this.t).x;
                this.car.position.y = this.curve.getPointAt(this.t).y;
                this.car.position.z = this.curve.getPointAt(this.t).z;
                this.car.lookAt(this.curve.getPointAt(this.t + 0.01));
            }
            this.t += 0.02;
        }
        else {
            this.car.position.x += this.direction.x / 15;
            this.car.position.y += this.direction.y / 15;
            this.car.position.z += this.direction.z / 15;
        }
    }
}