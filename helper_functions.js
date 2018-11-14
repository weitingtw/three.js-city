function dragStartCallBack(event) {
    Color = event.object.material.color.getHex();
    myWorld.controls.enabled = false;
    event.object.material.color.setHex(0xff0000);

}

// function to call when control points finish dragging
function dragEndCallBack(event) {
    myWorld.controls.enabled = true;

}

function addHouse(world) {
    var newHouse = new House(20, 0, 20, world);
}

function addMirror(world) {
    var newHouse = new Mirror(20, 0, 20, world);
}

function setupUI() {
    const gui = new dat.GUI();
    gui.add(params, "addHouse").name("add a house");
    gui.add(params, "addMirror").name("add a mirror");
    gui.add(params, "addFog").name("add fog effect");
    gui.add(params, "DayNightCycle", 50, 150);
}

applyForce = function () {
    document.onkeypress = function (event) {
        if (event.key == "a" || event.key == "w" || event.key == "s" || event.key == "d") {
            var forceposition;
            var strength = 3, distance, effect, offset;
            distance = 1;
            if (event.key == "w") {
                forceposition = new THREE.Vector3(helicopterMesh.position.x, helicopterMesh.position.y - 0.5, helicopterMesh.position.z);
                effect = forceposition.clone().sub(helicopterMesh.position).normalize().multiplyScalar(strength / distance).negate(),
                    offset = forceposition.clone().sub(helicopterMesh.position);
                helicopterMesh.applyImpulse(effect, offset);
            }
            if (event.key == "a") {

                forceposition = new THREE.Vector3(helicopterMesh.position.x - 0.5, helicopterMesh.position.y, helicopterMesh.position.z);
                effect = forceposition.clone().sub(helicopterMesh.position).normalize().multiplyScalar(strength / distance).negate(),
                    offset = forceposition.clone().sub(helicopterMesh.position);
                helicopterMesh.applyImpulse(effect, offset);
            }
            if (event.key == "d") {

                forceposition = new THREE.Vector3(helicopterMesh.position.x + 0.5, helicopterMesh.position.y, helicopterMesh.position.z);
                effect = forceposition.clone().sub(helicopterMesh.position).normalize().multiplyScalar(strength / distance).negate(),
                    offset = forceposition.clone().sub(helicopterMesh.position);
                helicopterMesh.applyImpulse(effect, offset);
            }
            if (event.key == "s") {

                forceposition = new THREE.Vector3(helicopterMesh.position.x, helicopterMesh.position.y, helicopterMesh.position.z - 0.5);
                effect = forceposition.clone().sub(helicopterMesh.position).normalize().multiplyScalar(strength / distance).negate(),
                    offset = forceposition.clone().sub(helicopterMesh.position);
                helicopterMesh.applyImpulse(effect, offset);
            }

        }
    };


};