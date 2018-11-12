class Firework {
    constructor(world) {
        this.world = world;
        this.done = false;
        this.dest = [];
        this.colors = [];
        this.geometry = null;
        this.points = null;
        this.material = new THREE.PointsMaterial({
            size: 0.05,
            color: 0xffffff,
            opacity: 1,
            vertexColors: true,
            transparent: true,
            depthTest: false,
        });

        this.launch();
    }
    reset() {
        this.world.removeObject(this.points);
        this.dest = [];
        this.colors = [];
        this.geometry = null;
        this.points = null;
        this.material = new THREE.PointsMaterial({
            size: 0.05,
            color: 0xffffff,
            opacity: 1,
            vertexColors: true,
            transparent: true,
            depthTest: false,
        });
    }

    launch() {
        var x = THREE.Math.randInt(0, 60);
        var y = THREE.Math.randInt(15, 25);
        var z = THREE.Math.randInt(0, 60);


        var from = new THREE.Vector3(x, 0, z);
        var to = new THREE.Vector3(x, y, z);

        var color = new THREE.Color();
        color.setHSL(THREE.Math.randFloat(0.1, 0.9), 1, 0.9);
        this.colors.push(color);

        this.geometry = new THREE.Geometry();
        this.points = new THREE.Points(this.geometry, this.material);
        this.geometry.colors = this.colors;
        this.geometry.vertices.push(from);
        this.dest.push(to);
        this.colors.push(color);
        this.world.addObject(this.points);
    }

    explode(vector) {
        this.world.removeObject(this.points);
        this.dest = [];
        this.colors = [];
        this.geometry = new THREE.Geometry();
        this.points = new THREE.Points(this.geometry, this.material);

        for (var i = 0; i < 100; i++) {
            var color = new THREE.Color();
            color.setHSL(THREE.Math.randFloat(0.1, 0.9), 1, 0.5);
            this.colors.push(color);

            var from = new THREE.Vector3(
                THREE.Math.randInt(vector.x, vector.x),
                THREE.Math.randInt(vector.y, vector.y),
                THREE.Math.randInt(vector.z, vector.z)
            );
            var to = new THREE.Vector3(
                THREE.Math.randInt(vector.x - 5, vector.x + 5),
                THREE.Math.randInt(vector.y - 5, vector.y + 5),
                THREE.Math.randInt(vector.z - 5, vector.z + 5)
            );
            this.geometry.vertices.push(from);
            this.dest.push(to);
        }
        this.geometry.colors = this.colors;
        this.world.addObject(this.points);
    }

    update() {
        // only if objects exist
        if (this.points && this.geometry) {

            var total = this.geometry.vertices.length;

            // lerp particle positions 
            for (var i = 0; i < total; i++) {
                this.geometry.vertices[i].x += (this.dest[i].x - this.geometry.vertices[i].x) / 20;
                this.geometry.vertices[i].y += (this.dest[i].y - this.geometry.vertices[i].y) / 20;
                this.geometry.vertices[i].z += (this.dest[i].z - this.geometry.vertices[i].z) / 20;
                this.geometry.verticesNeedUpdate = true;
            }
            // watch first particle for explosion 
            if (total === 1) {
                if (Math.ceil(this.geometry.vertices[0].y) > (this.dest[0].y - 20)) {
                    this.explode(this.geometry.vertices[0]);
                    return;
                }
            }
            // fade out exploded particles 
            if (total > 1) {
                this.material.opacity -= 0.015;
                this.material.colorsNeedUpdate = true;
            }
            // remove, reset and stop animating 
            if (this.material.opacity <= 0) {
                this.reset();
                this.done = true;
                return;
            }
        } else {
            this.launch();
        }
    }
}