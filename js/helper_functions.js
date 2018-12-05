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