class Road {
    constructor(x, y, z, length, width, yRotate, roadTexture, world) {
        var road_geometry = new THREE.PlaneGeometry(length, width, 20, 20);
        var road_material = new THREE.MeshLambertMaterial({
            map: roadTexture
        })
        var roadMesh = new THREE.Mesh(road_geometry, road_material);
        roadMesh.position.x = x;
        roadMesh.position.y = y;
        roadMesh.position.z = z;
        roadMesh.rotation.x = -90 * (Math.PI / 180);
        roadMesh.rotation.z = yRotate;
        roadMesh.receiveShadow = true;
        world.addObject(roadMesh);

        var direction = new THREE.Vector3()
        roadMesh.getWorldDirection(direction)
        if (yRotate == 0) {
            this.direction = new THREE.Vector3(1, 0, 0);
        } else if (yRotate == -90 * (Math.PI / 180)) {
            this.direction = new THREE.Vector3(0, 0, 1);
        }
    }
}