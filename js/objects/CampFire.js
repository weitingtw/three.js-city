

class CampFire {
    constructor(x, y, z, world) {
        this.x = x;
        this.y = y;
        this.z = z;
        this.frame = 0;
        this.world = world;
        this.fireParticles = [];
        this.log = new logs(x, y, z, world);
        this.fireLife = 70;
        this.light = new THREE.PointLight(0xe25822, 1, 3);
        this.light.position.set(x, y + 0.5, z);
        world.addObject(this.light);
    }

    update() {
        this.frame++
        if (!(this.frame % 5)) {
            var index = this.fireParticles.push(new Fire(this.x, this.y + 0.5, this.z));
            this.world.addObject(this.fireParticles[index - 1].mesh)
        }

        for (var i in this.fireParticles) {
            this.fireParticles[i].update()
            if (this.fireParticles[i].cycle > this.fireLife) {
                this.world.removeObject(this.fireParticles[i].mesh)
                this.fireParticles.splice(i, 1)
            }
        }
    }
}