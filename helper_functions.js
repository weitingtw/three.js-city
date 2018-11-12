function dragStartCallBack(event) {
    Color = event.object.material.color.getHex();
    myWorld.controls.enabled = false;
    event.object.material.color.setHex(0xff0000);

}

// function to call when control points finish dragging
function dragEndCallBack(event) {
    myWorld.controls.enabled = true;

}