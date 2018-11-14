class Mirror {
    constructor(x, y, z, world) {
        var poleGeometry = new THREE.BoxGeometry(0.2, 1, 0.2, 3, 3, 3);
        var poleMaterial = new THREE.MeshLambertMaterial({
            color: 0xff0000
        });
        var poleMesh = new THREE.Mesh(poleGeometry, poleMaterial)
        poleMesh.position.x = x;
        poleMesh.position.y = y + 0.5;
        poleMesh.position.z = z;
        var mirrorGeometry = new THREE.CircleBufferGeometry(0.6, 32);
        var mirrorMaterial = new THREE.MeshLambertMaterial({
            side: THREE.DoubleSide,
            color: 0x000000
        });
        var groundMirror = new THREE.Reflector(mirrorGeometry, {
            clipBias: 0.003,
            textureWidth: 100 * window.devicePixelRatio,
            textureHeight: 100 * window.devicePixelRatio,
            color: 0x777777,
            recursion: 1
        });
        groundMirror.position.y = 0.7;
        groundMirror.position.z = 0.05;


        var mirrorMesh = new THREE.Mesh(mirrorGeometry, mirrorMaterial);
        mirrorMesh.position.y = 0.7;

        poleMesh.add(mirrorMesh);
        poleMesh.add(groundMirror);
        world.addObject(poleMesh);
        draggableObjects.push(poleMesh);
    }
}