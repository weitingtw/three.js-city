
class Fire {
    constructor(x, y, z) {
        this.x = x;
        this.y = y;
        this.z = z;
        this.cycle = 0
        this.mod = THREE.Math.randInt(0, 200);
        this.color = new THREE.Color()
        this.height = 20
        this.color.setHSL(.15, 1, .99)

        this.mesh = new THREE.Group()

        this.mesh.position.y = this.height

        this.geom = new THREE.BoxGeometry(0.5, 0.5, 0.5)

        this.material = new THREE.MeshBasicMaterial({
            'color': this.color,
        })

        this.material.blending = THREE.AdditiveBlending

        this.cube = new THREE.Mesh(this.geom, this.material)

        this.mesh.add(this.cube)
    }

    update() {
        this.cycle++
        var val = this.cycle + this.mod
        var dir = (this.mod % 2) ? 1 : -1
        var scale = (1 / fireLife) * (fireLife - this.cycle) + .0001 // sum .0001 to avoid error

        this.color.offsetHSL(-.002, -.002, -.01)

        this.material.setValues({
            'color': this.color
        })

        //this.light.color = this.color
        this.mesh.scale.set(scale, scale, scale);
        scale = scale * (sin(val / 10) + cos(val / 10))
        this.mesh.position.x = this.x + (sin(val / 10) * (0.5 * scale)) * dir
        this.mesh.position.z = this.z + cos(val / 10) * (0.5 * scale)
        this.mesh.position.y = this.y + this.cycle / 20
    }

}

class logs {
    constructor(x, y, z, world) {
        this.mesh = new THREE.Group()
        this.material = new THREE.MeshLambertMaterial({
            'color': 0xad5600
        })

        this.geom = new THREE.CylinderGeometry(
            0.15,  // base radius
            0.15,  // top radius
            2.5, // lenght
            7   // segments
        )

        var log1 = new THREE.Mesh(this.geom, this.material)

        log1.rotateY((2 * PI / 4) * 2.5)
        log1.rotateZ(1.7)

        this.mesh.add(log1)

        var log2 = new THREE.Mesh(this.geom, this.material)

        log2.rotateY((2 * PI / 4) * 2)
        log2.rotateZ(1.7)

        this.mesh.add(log2)

        var log3 = new THREE.Mesh(this.geom, this.material)

        log3.rotateY((2 * PI / 4) * 3.5);
        log3.rotateZ(1.7)


        this.mesh.add(log3)

        var log4 = new THREE.Mesh(this.geom, this.material)

        log4.rotateY(2 * PI / 4)
        log4.rotateZ(1.7)


        this.mesh.add(log4)
        this.mesh.position.x = x;
        this.mesh.position.y = y;
        this.mesh.position.z = z;

        world.addObject(this.mesh);

    }
}