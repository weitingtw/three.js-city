class StreetLight {
    constructor(x, y, z, column_material, bulb_material, world) {
        var column_geometry = new THREE.CylinderGeometry(0.3, 0.3, 1.5);
        column_geometry.applyMatrix(new THREE.Matrix4().makeTranslation(0, 0.75, 0));
        var row_geometry = new THREE.BoxGeometry(1.2, 0.5, 0.5);

        var bulb_geometry = new THREE.SphereGeometry(0.3, 16, 16);
        var column_mesh = new THREE.Mesh(column_geometry, column_material);
        var row_mesh = new THREE.Mesh(row_geometry, column_material);
        var bulb_mesh = new THREE.Mesh(bulb_geometry, bulb_material);
        var rot = Math.random() * Math.PI;

        column_mesh.position.x = x;
        column_mesh.position.y = y;
        column_mesh.position.z = z;

        row_mesh.position.x = x + 0.45;
        row_mesh.position.y = y + 1.5;
        row_mesh.position.z = z;

        var light = new THREE.PointLight(0xffee88, 0.8, 4, 2);
        light.position.set(x + 0.45, y + 1.15, z);
        light.add(bulb_mesh);
        light.castShadow = true;
        lights.push(light);


        this.streetlight = new THREE.Group();
        // rotate randomly
        this.streetlight.applyMatrix(new THREE.Matrix4().makeTranslation(-x, -y, -z))
        this.streetlight.applyMatrix(new THREE.Matrix4().makeRotationY(rot));
        this.streetlight.applyMatrix(new THREE.Matrix4().makeTranslation(x, y, z))

        this.streetlight.add(column_mesh);
        this.streetlight.add(row_mesh);
        this.streetlight.add(light);

        world.addObject(this.streetlight);

    }
}