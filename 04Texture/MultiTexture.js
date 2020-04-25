
var VSHADER_SOURCE = 
"attribute vec4 a_position;\n" +
"attribute vec4 a_color;\n" +
"attribute vec2 a_texcoord;\n" +
"varying vec4 v_color;\n" +
"varying vec2 v_texcoord;\n" +
"uniform mat4 u_modelMatrix;\n" +
"void main() {\n" +
"  gl_Position = u_modelMatrix * a_position;\n" +
"  gl_PointSize = 10.0;\n" +
"  v_color = a_color;\n" +
"  v_texcoord = a_texcoord;\n" +
"}\n";

var FSHADER_SOURCE =
"precision mediump float;\n" +
"uniform sampler2D u_sampler0;\n" +
"uniform sampler2D u_sampler1;\n" +
"varying vec4 v_color;\n" +
"varying vec2 v_texcoord;\n" +
"void main() {\n" +
"  vec4 color0 = texture2D(u_sampler0, v_texcoord);\n" +
"  vec4 color1 = texture2D(u_sampler1, v_texcoord);\n" +
"  gl_FragColor = color0 * color1;\n" +
"}\n";


function main()
{
    var canvas = document.getElementById("webgl");
    if (!initCanvasEnv(canvas))
    {
        console.log("Init canvas failed");
        return;
    }

    var gl = getWebGLContext(canvas);
    if (!gl)
    {
        console.log("failed to get the rendering context for WebGL");
        return;
    }

    if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE))
    {
        console.log("Failed to initialize shaders.");
        return;
    }

    var n = initVertexBuffers(gl);
    if (n < 0)
    {
        console.log("Failed to set the position of the vertices");
        return;
    }

    if (!initTextures(gl, n))
    {
        console.log("Failed to init textures");
        return;
    }

    gl.clearColor(0.0, 0.0, 0.3, 1.0);

    var u_modelMatrix = gl.getUniformLocation(gl.program, "u_modelMatrix");
    
    var curAngle = 0.0;
    var modelMatrix = new Matrix4();
    var tick = function () 
    {
        curAngle = animate(curAngle);
        draw(gl, n, curAngle, modelMatrix, u_modelMatrix);
        requestAnimationFrame(tick);
    }
    tick()
}

function initVertexBuffers(gl)
{
    var vertices = new Float32Array([
        -0.5,  0.5,  1.0, 0.0, 0.0,  0.0, 1.0,
        -0.5, -0.5,  0.0, 1.0, 0.0,  0.0, 0.0,
        0.5,  0.5,   0.0, 0.0, 1.0,  1.0, 1.0,
        0.5,  -0.5,  1.0, 1.0, 1.0,  1.0, 0.0,
    ])
    
    var n = 4;
    var vertexBuffer = gl.createBuffer();
    if (!vertexBuffer) 
    {
        console.log("Failed to create the buffer object");
        return -1;
    }

    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

    var a_position = gl.getAttribLocation(gl.program, "a_position")
    if (a_position < 0)
    {
        console.log("Failed to get the storage location of a_position");
        return -1;
    }

    var a_color = gl.getAttribLocation(gl.program, "a_color")
    if (a_color < 0)
    {
        console.log("Failed to get the storage location of a_color");
        return -1;
    }

    var a_texcoord = gl.getAttribLocation(gl.program, "a_texcoord")
    if (a_texcoord < 0)
    {
        console.log("Failed to get the storage location of a_texcoord");
        return -1;
    }

    //gl.vertexAttrib3f(a_position, 0.5, 0.0, 0.0);
    var FSIZE = vertices.BYTES_PER_ELEMENT
    gl.vertexAttribPointer(a_position, 2, gl.FLOAT, false, FSIZE*7, 0)
    gl.enableVertexAttribArray(a_position)

    gl.vertexAttribPointer(a_color, 3, gl.FLOAT, false, FSIZE*7, FSIZE*2)
    gl.enableVertexAttribArray(a_color)

    gl.vertexAttribPointer(a_texcoord, 2, gl.FLOAT, false, FSIZE*7, FSIZE*5)
    gl.enableVertexAttribArray(a_texcoord)

    return n;
}

function initTextures(gl, n)
{
    var texture0 = gl.createTexture()
    var texture1 = gl.createTexture()

    var u_sampler0 = gl.getUniformLocation(gl.program, "u_sampler0")
    var u_sampler1 = gl.getUniformLocation(gl.program, "u_sampler1")
    var img0 = new Image()
    var img1 = new Image()
    img0.onload = function ()
    {
        loadTexture(gl, n, texture0, u_sampler0, img0, 0)
    }
    img0.src = "../res/redflower.jpg"

    img1.onload = function ()
    {
        loadTexture(gl, n, texture1, u_sampler1, img1, 1)
    }
    img1.src = "../res/circle.gif"
    return true
}

var g_texUnit0 = false
var g_texUnit1 = false
function loadTexture(gl, n, texture, u_sampler, img, texUnit)
{
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1)  //y轴翻转
    if (texUnit == 0) {
        gl.activeTexture(gl.TEXTURE0)
        g_texUnit0 = true
    } else if (texUnit == 1) {
        gl.activeTexture(gl.TEXTURE1)
        g_texUnit1 = true
    }

    gl.bindTexture(gl.TEXTURE_2D, texture)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR)
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, img)
    gl.uniform1i(u_sampler, texUnit)

    if (g_texUnit0 && g_texUnit1) {
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, n)
    }
}

function draw(gl, n, curAngle, modelMatrix, u_modelMatrix)
{
    modelMatrix.setRotate(curAngle, 0, 0, 1)
    modelMatrix.translate(0.3, 0, 0);
    
    gl.uniformMatrix4fv(u_modelMatrix, false, modelMatrix.elements);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, n);
    // gl.drawArrays(gl.POINTS, 0, n);
}

var ANGLE_STEP = 45.0
var g_last = Date.now();
function animate(angle)
{
    var now = Date.now();
    var elaspsed = now - g_last;
    g_last = now;

    var newAngle = angle + (ANGLE_STEP * elaspsed) / 1000.0;
    return newAngle %= 360;
}