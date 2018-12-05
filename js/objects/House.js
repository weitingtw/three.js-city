var draggableObjects = [];
class House {
    constructor(x, y, z, world) {
        var roofGeometry = new THREE.Geometry();
        var v1 = new THREE.Vector3(1, 0.5, 1);
        var v2 = new THREE.Vector3(-1, 0.5, 1);
        var v3 = new THREE.Vector3(1, 0.5, -1);
        var v4 = new THREE.Vector3(-1, 0.5, -1);
        var v5 = new THREE.Vector3(0, 1.5, 1);
        var v6 = new THREE.Vector3(0, 1.5, -1);
        roofGeometry.vertices.push(v1);
        roofGeometry.vertices.push(v2);
        roofGeometry.vertices.push(v3);
        roofGeometry.vertices.push(v4);
        roofGeometry.vertices.push(v5);
        roofGeometry.vertices.push(v6);

        roofGeometry.faces.push(new THREE.Face3(0, 1, 2));
        roofGeometry.faces.push(new THREE.Face3(3, 2, 1));
        roofGeometry.faces.push(new THREE.Face3(0, 1, 4));
        roofGeometry.faces.push(new THREE.Face3(5, 3, 2));
        roofGeometry.faces.push(new THREE.Face3(2, 0, 5));
        roofGeometry.faces.push(new THREE.Face3(4, 5, 0));
        roofGeometry.faces.push(new THREE.Face3(1, 3, 5));
        roofGeometry.faces.push(new THREE.Face3(5, 4, 1));


        roofGeometry.computeFaceNormals();
        roofGeometry.computeVertexNormals();
        var roofMaterial = new THREE.MeshLambertMaterial({
            side: THREE.DoubleSide,
            color: Math.random() * 0xffffff
        });
        var roofMesh = new THREE.Mesh(roofGeometry, roofMaterial);


        var bodyGeometry = new THREE.BoxGeometry(1.4, 1, 2, 4, 4, 4);
        var bodyMaterial = new THREE.MeshStandardMaterial({ color: Math.random() * 0xffffff });
        var bodyMesh = new THREE.Mesh(bodyGeometry, bodyMaterial);
        bodyMesh.position.y += 0.5;

        var windowGeometry = new THREE.PlaneGeometry(0.5, 0.5, 1, 1);
        this.windowDayMaterial = new THREE.MeshPhongMaterial({ color: 0xffffff, side: THREE.DoubleSide });
        var color = Math.random();
        this.windowNightMaterial = new THREE.MeshBasicMaterial({ color: new THREE.Color(color, color, 0), side: THREE.DoubleSide });
        var windowMesh = new THREE.Mesh(windowGeometry, this.windowNightMaterial);
        windowMesh.position.x = -0.71;
        windowMesh.position.z = 0.4;
        windowMesh.rotation.y += Math.PI / 2;

        var windowMesh2 = new THREE.Mesh(windowGeometry, this.windowNightMaterial);
        windowMesh2.position.x = -0.71;
        windowMesh2.position.z = -0.4;
        windowMesh2.rotation.y += Math.PI / 2;

        var windowMesh3 = new THREE.Mesh(windowGeometry, this.windowNightMaterial);
        windowMesh3.position.x = 0.71;
        windowMesh3.position.z = -0.4;
        windowMesh3.rotation.y += Math.PI / 2;


        var windowMesh4 = new THREE.Mesh(windowGeometry, this.windowNightMaterial);
        windowMesh4.position.x = 0.71;
        windowMesh4.position.z = 0.4;
        windowMesh4.rotation.y += Math.PI / 2;

        this.windowMeshes = [];
        this.windowMeshes.push(windowMesh);
        this.windowMeshes.push(windowMesh2);
        this.windowMeshes.push(windowMesh3);
        this.windowMeshes.push(windowMesh4);

        this.house = new THREE.Group();
        bodyMesh.add(roofMesh);
        bodyMesh.add(windowMesh);
        bodyMesh.add(windowMesh2);
        bodyMesh.add(windowMesh3);
        bodyMesh.add(windowMesh4);
        bodyMesh.castShadow = true;

        this.house.add(bodyMesh);

        this.house.position.x = x;
        this.house.position.y = y;
        this.house.position.z = z;

        world.addObject(this.house);
        draggableObjects.push(bodyMesh);
    }

    updateDay() {
        for (var i = 0; i < this.windowMeshes.length; i++) {
            this.windowMeshes[i].material = this.windowDayMaterial;
            this.windowMeshes[i].needsUpdate = true;
        }
    }

    updateNight() {
        for (var i = 0; i < this.windowMeshes.length; i++) {
            this.windowMeshes[i].material = this.windowNightMaterial;
            this.windowMeshes[i].needsUpdate = true;
        }

    }
}