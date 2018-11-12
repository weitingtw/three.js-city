var buildingMesh_list = [];
class Building {
    constructor() {
        var geometry = new THREE.CubeGeometry(1, 1, 1);
        geometry.applyMatrix(new THREE.Matrix4().makeTranslation(0, 0.5, 0));

        // roof not affected by texture
        geometry.faceVertexUvs[0][4][0].set(0, 0);
        geometry.faceVertexUvs[0][4][1].set(0, 0);
        geometry.faceVertexUvs[0][4][2].set(0, 0);
        geometry.faceVertexUvs[0][5][0].set(0, 0);
        geometry.faceVertexUvs[0][5][1].set(0, 0);
        geometry.faceVertexUvs[0][5][2].set(0, 0);

        //geometry.faceVertexUvs[0][2][3].set(0, 0);

        this.mesh = new THREE.Mesh(geometry);

        var light = new THREE.Color(0xffffff);
        var shadow = new THREE.Color(0x303050);
        // put a random rotation
        this.mesh.rotation.y = Math.random() * Math.PI * 2;
        // put a random scale
        this.mesh.scale.x = Math.random() * Math.random() * Math.random() * Math.random() + 2.5;
        this.mesh.scale.y = (Math.random() * Math.random() * 8) + 2;
        this.mesh.scale.z = this.mesh.scale.x

        // establish the base color for the buildingMesh
        var value = 1 - Math.random() * Math.random();
        var baseColor = new THREE.Color().setRGB(value + Math.random() * 0.5, value, value + Math.random() * 0.5);
        // set topColor/bottom vertexColors as adjustement of baseColor
        var topColor = baseColor.clone().multiply(light);
        var bottomColor = baseColor.clone().multiply(shadow);
        // set .vertexColors for each face
        var geometry = this.mesh.geometry;
        for (var j = 0, jl = geometry.faces.length; j < jl; j++) {
            if (j === 2) {
                // set face.vertexColors on root face
                geometry.faces[j].vertexColors = [baseColor, baseColor, baseColor, baseColor];
            } else {
                // set face.vertexColors on sides faces
                geometry.faces[j].vertexColors = [topColor, bottomColor, bottomColor, topColor];
            }
        }
        buildingMesh_list.push(this.mesh);
        this.mesh.receiveShadow = true;
        this.mesh.castShadow = true;
    }

}

function generateTexture() {
    // build a small canvas 32x64 and paint it in white
    var canvas = document.createElement('canvas');
    canvas.width = 32;
    canvas.height = 64;
    var context = canvas.getContext('2d');
    // plain it in white
    context.fillStyle = '#ffffff';
    context.fillRect(0, 0, 32, 64);
    // draw the window rows - with a small noise to simulate light variations in each room
    for (var y = 2; y < 64; y += 2) {
        for (var x = 0; x < 32; x += 2) {
            var value = Math.floor(Math.random() * 86);
            context.fillStyle = 'rgb(' + [value, value, value].join(',') + ')';
            //var rand_size_x = Math.random() * 0.2 + 0.8;
            //var rand_size_y = Math.random() * 0.2 + 0.8;
            context.fillRect(x, y, 2, 1);
        }
    }
    // build a bigger canvas and copy the small one in it
    // This is a trick to upscale the texture without filtering
    var canvas2 = document.createElement('canvas');
    canvas2.width = 512;
    canvas2.height = 1024;
    var context = canvas2.getContext('2d');
    // disable smoothing
    context.imageSmoothingEnabled = false;
    context.webkitImageSmoothingEnabled = false;
    context.mozImageSmoothingEnabled = false;
    // then draw the image
    context.drawImage(canvas, 0, 0, canvas2.width, canvas2.height);
    // return the just built canvas2
    return canvas2;
}

function generateTexture2() {
    // build a small canvas 32x64 and paint it in white
    var canvas = document.createElement('canvas');
    canvas.width = 32;
    canvas.height = 64;
    var context = canvas.getContext('2d');
    // plain it in white
    context.fillStyle = '#000000';
    context.fillRect(0, 0, 32, 64);
    // draw the window rows - with a small noise to simulate light variations in each room
    for (var y = 2; y < 64; y += 2) {
        for (var x = 0; x < 32; x += 2) {
            var value = Math.floor(Math.random() * 256);
            context.fillStyle = 'rgb(' + [value, value, 0].join(',') + ')';
            context.fillRect(x, y, 2, 1);
        }
    }
    // build a bigger canvas and copy the small one in it
    // This is a trick to upscale the texture without filtering
    var canvas2 = document.createElement('canvas');
    canvas2.width = 512;
    canvas2.height = 1024;
    var context = canvas2.getContext('2d');
    // disable smoothing
    context.imageSmoothingEnabled = false;
    context.webkitImageSmoothingEnabled = false;
    context.mozImageSmoothingEnabled = false;
    // then draw the image
    context.drawImage(canvas, 0, 0, canvas2.width, canvas2.height);
    // return the just built canvas2
    return canvas2;
}