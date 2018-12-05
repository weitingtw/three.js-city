class Lawn {
    constructor(x, y, z, length, width, number, ground_texture, dayMaterial, nightMaterial, column_material, bulb_material, world) {
        this.grass_positions = [];
        this.dayMaterial = dayMaterial;
        this.nightMaterial = nightMaterial;
        var max_length, min_length, max_width, min_width;
        max_length = x + length / 2;
        min_length = x - length / 2;
        max_width = z + width / 2;
        min_width = z - width / 2;

        this.random_type = Math.random() > 0.5 ? 1 : 0;
        this.houses = [];

        // buildings
        if (this.random_type == 1) {
            var buildingsGeometry = new THREE.Geometry();
            for (var i = 0; i < 4; i++) {
                var building = new Building();
                //var rand_x = min_length + length * Math.random();
                //var rand_z = min_width + width * Math.random();
                //var rand_x = min_length + 2 + Math.random() * (max_length - 4 - min_length);
                //var rand_z = min_width + 2 + Math.random() * (max_width - 4 - min_width);
                var rand_x = min_length + (i % 2 + 1) * 4;
                var rand_z = min_width + 2 + i * 2;

                building.mesh.position.x = rand_x;
                building.mesh.position.z = rand_z;

                //console.log(buildingsGeometry.faces);
                //console.log(building.mesh.geometry.faces);
                //THREE.GeometryUtils.merge(buildingsGeometry, building.mesh);
                building.mesh.updateMatrix();
                //console.log(building.mesh);
                buildingsGeometry.merge(building.mesh.geometry, building.mesh.matrix, 3);
                //buildingsGeometry.mergeMesh(building.mesh);
            }
            for (var i = 0; i < buildingsGeometry.faces.length / 12; i++) {
                var j = i * 12;
                var R = Math.random();
                var G = Math.random();
                var B = Math.random();
                var color = new THREE.Color(R, G, B);
                buildingsGeometry.faces[j].color = color;
                buildingsGeometry.faces[j + 1].color = color;
                buildingsGeometry.faces[j + 2].color = color;
                buildingsGeometry.faces[j + 3].color = color;
                buildingsGeometry.faces[j + 4].color = color;
                buildingsGeometry.faces[j + 5].color = color;
                buildingsGeometry.faces[j + 6].color = color;
                buildingsGeometry.faces[j + 7].color = color;
                buildingsGeometry.faces[j + 8].color = color;
                buildingsGeometry.faces[j + 9].color = color;
                buildingsGeometry.faces[j + 10].color = color;
                buildingsGeometry.faces[j + 11].color = color;
            }
            this.buildingsMesh = new THREE.Mesh(buildingsGeometry, nightMaterial);
            this.buildingsMesh.castShadow = true;
            this.buildingsMesh.receiveShadow = true;
            world.addObject(this.buildingsMesh);
        }
        // houses
        else if (this.random_type == 0) {
            for (var i = 0; i < 2; i++) {
                for (var j = 1; j < 4; j++) {
                    this.houses.push(new House(min_length + 2 + 6 * i, 0, min_width + j * 3 - 0.5, world));
                }
            }
            if (Math.random() > 0.85) {
                campfires.push(new CampFire(x, y + 0.5, z, world));
            }
        }

        //streetlight
        if (Math.random() > 0.7) {
            var streetlight1 = new StreetLight(min_length + 0.5, 0, min_width + 0.5, column_material, bulb_material, world);
        }

        // ground
        var ground_geometry = new THREE.PlaneGeometry(length, width, 30, 30);

        var ground_material = new THREE.MeshLambertMaterial({
            map: ground_texture
        })
        var groundMesh = new THREE.Mesh(ground_geometry, ground_material);
        groundMesh.position.x = x;
        groundMesh.position.y = 0.02;
        groundMesh.position.z = z;
        groundMesh.rotation.x = -90 * (Math.PI / 180);
        groundMesh.receiveShadow = true;
        world.addObject(groundMesh);
    }

    updateDay() {
        if (this.random_type == 1) {
            this.buildingsMesh.material = day_material;
            this.buildingsMesh.needsUpdate = true;
        } else if (this.random_type == 0) {
            for (var i = 0; i < this.houses.length; i++) {
                this.houses[i].updateDay();
            }
        }
    }

    updateNight() {
        if (this.random_type == 1) {
            this.buildingsMesh.material = night_material;
            this.buildingsMesh.needsUpdate = true;
        } else if (this.random_type == 0) {
            for (var i = 0; i < this.houses.length; i++) {
                this.houses[i].updateNight();
            }
        }
    }
}