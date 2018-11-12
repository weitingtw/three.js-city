class Helicopter {
    constructor(world) {
        var box_material = Physijs.createMaterial(
            new THREE.MeshLambertMaterial({ color: 0xff1111 }),
            .4, // low friction
            .6 // high restitution
        );
        var box = new Physijs.BoxMesh(
            new THREE.BoxGeometry(1, 1, 1),
            box_material
        );
        box.position.set(
            -6,
            6,
            -6
        );
        box.rotation.set(
            Math.random() * Math.PI * 2,
            Math.random() * Math.PI * 2,
            Math.random() * Math.PI * 2
        );

        box.castShadow = true;
        world.addObject(box);
    }
}