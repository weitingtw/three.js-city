class Intersection {
    constructor(x, y, z, length, width, intersectionTexture, world, boundary1, boundary2) {
        this.max_x = x + length / 2;
        this.min_x = x - length / 2;
        this.max_z = z + length / 2;
        this.min_z = z - length / 2;
        var intersection_geometry = new THREE.PlaneGeometry(length, width, 1, 1);
        var intersection_material = new THREE.MeshLambertMaterial({
            map: intersectionTexture
        })
        var intersectionMesh = new THREE.Mesh(intersection_geometry, intersection_material);
        intersectionMesh.position.x = x;
        intersectionMesh.position.y = y;
        intersectionMesh.position.z = z;
        intersectionMesh.rotation.x = -90 * (Math.PI / 180);
        intersectionMesh.receiveShadow = true;
        world.addObject(intersectionMesh);
        this.boundary1 = boundary1;
        this.boundary2 = boundary2;

        /*if (Math.random() > 0.8) {
            var mirror = new Mirror(this.min_x, 0, this.mix_z, world);
        }*/
    }

    intersect(car) {
        if (car.car.position.x < this.max_x && car.car.position.x > this.min_x && car.car.position.z < this.max_z && car.car.position.z > this.min_z) {
            return true;
        }
        return false;
    }

    pickDirection(car) {
        if (car.direction.x == 0 && car.direction.y == 0 && car.direction.z == 1) {

            car.t = 0;
            var curve;
            var option = Math.floor(Math.random() * 3);
            console.log(option);
            // turn right 
            if (option == 0 && this.boundary1 != "east" && this.boundary2 != "east") {
                car.isTurning = true;
                car.direction = new THREE.Vector3(-1, 0, 0);

                curve = new THREE.CubicBezierCurve3(car.car.position,
                    new THREE.Vector3(this.min_x + 0.5, 0, this.min_z + 0.5),
                    new THREE.Vector3(this.min_x + 0.5, 0, this.min_z + 0.5),
                    new THREE.Vector3(this.min_x, 0, this.min_z + 0.5));
            }
            // turn left
            else if (option == 1 && this.boundary1 != "west" && this.boundary2 != "west") {
                car.isTurning = true;
                car.direction = new THREE.Vector3(1, 0, 0);

                curve = new THREE.CubicBezierCurve3(car.car.position,
                    new THREE.Vector3(this.max_x - 1.5, 0, this.max_z - 1.8),
                    new THREE.Vector3(this.max_x - 0.8, 0, this.max_z - 0.5),
                    new THREE.Vector3(this.max_x, 0, this.max_z - 0.5));
            }
            // go straight
            else if (option == 2 && this.boundary1 != "north" && this.boundary2 != "north") {
                car.isTurning = true;
                car.direction = new THREE.Vector3(0, 0, 1);
                curve = "straight";
            }
            car.curve = curve;
        } else if (car.direction.x == 1 && car.direction.y == 0 && car.direction.z == 0) {

            car.t = 0;
            var curve;
            var option = Math.floor(Math.random() * 3);
            // turn right
            if (option == 0 && this.boundary1 != "north" && this.boundary2 != "north") {
                car.isTurning = true;
                car.direction = new THREE.Vector3(0, 0, 1);
                curve = new THREE.CubicBezierCurve3(car.car.position,
                    new THREE.Vector3(this.max_x - 1.5, 0, car.car.position.z),
                    new THREE.Vector3(this.max_x - 1.5, 0, car.car.position.z),
                    new THREE.Vector3(this.max_x - 1.5, 0, this.max_z));
            }
            //turn left
            else if (option == 1 && this.boundary1 != "south" && this.boundary2 != "south") {
                car.isTurning = true;
                car.direction = new THREE.Vector3(0, 0, -1);
                curve = new THREE.CubicBezierCurve3(car.car.position,
                    new THREE.Vector3(this.min_x + 0.2, 0, this.max_z - 0.5),
                    new THREE.Vector3(this.max_x - 0.5, 0, this.min_z + 0.8),
                    new THREE.Vector3(this.max_x - 0.5, 0, this.min_z));
            }
            //straight
            else if (option == 2 && this.boundary1 != "west" && this.boundary2 != "west") {
                car.isTurning = true;
                car.direction = new THREE.Vector3(1, 0, 0);
                curve = "straight";
            }
            car.curve = curve;
        } else if (car.direction.x == 0 && car.direction.y == 0 && car.direction.z == -1) {

            car.t = 0;
            var curve;
            var option = Math.floor(Math.random() * 3);
            // turn right
            if (option == 0 && this.boundary1 != "west" && this.boundary2 != "west") {
                car.isTurning = true;
                car.direction = new THREE.Vector3(1, 0, 0);
                curve = new THREE.CubicBezierCurve3(car.car.position,
                    new THREE.Vector3(this.max_x - 0.5, 0, this.max_z - 0.5),
                    new THREE.Vector3(this.max_x - 0.5, 0, this.max_z - 0.5),
                    new THREE.Vector3(this.max_x, 0, this.max_z - 0.5));
            }
            //turn left
            else if (option == 1 && this.boundary1 != "east" && this.boundary2 != "east") {
                car.isTurning = true;
                car.direction = new THREE.Vector3(-1, 0, 0);
                curve = new THREE.CubicBezierCurve3(car.car.position,
                    new THREE.Vector3(this.max_x - 0.5, 0, this.max_z - 0.2),
                    new THREE.Vector3(this.min_x + 0.8, 0, this.min_z + 0.5),
                    new THREE.Vector3(this.min_x, 0, this.min_z + 0.5));
            }
            //straight
            else if (option == 2 && this.boundary1 != "south" && this.boundary2 != "south") {
                car.isTurning = true;
                car.direction = new THREE.Vector3(0, 0, -1);
                curve = "straight";
            }
            car.curve = curve;
        } else if (car.direction.x == -1 && car.direction.y == 0 && car.direction.z == 0) {
            car.t = 0;
            var curve;
            var option = Math.floor(Math.random() * 3);
            // turn right
            if (option == 0 && this.boundary1 != "south" && this.boundary2 != "south") {
                car.isTurning = true;

                car.direction = new THREE.Vector3(0, 0, -1);
                curve = new THREE.CubicBezierCurve3(car.car.position,
                    new THREE.Vector3(this.max_x - 0.5, 0, this.min_z + 0.5),
                    new THREE.Vector3(this.max_x - 0.5, 0, this.min_z + 0.5),
                    new THREE.Vector3(this.max_x - 0.5, 0, this.min_z));
            }
            //turn left
            else if (option == 1 && this.boundary1 != "north" && this.boundary2 != "north") {
                car.isTurning = true;
                car.direction = new THREE.Vector3(0, 0, 1);
                curve = new THREE.CubicBezierCurve3(car.car.position,
                    new THREE.Vector3(this.max_x - 0.2, 0, this.min_z + 0.5),
                    new THREE.Vector3(this.min_x + 0.5, 0, this.max_z - 0.8),
                    new THREE.Vector3(this.min_x + 0.5, 0, this.max_z));
            }
            //straight
            else if (option == 2 && this.boundary1 != "east" && this.boundary2 != "east") {
                car.isTurning = true;
                car.direction = new THREE.Vector3(-1, 0, 0);
                curve = "straight";
            }
            car.curve = curve;
        }
    }
}