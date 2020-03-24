
var VSHADER_SOURCE = 
"attribute vec4 a_Position;\n" +
"uniform mat4 u_modelMatrix;\n" +
"void main() {\n" +
"  gl_Position = u_modelMatrix * a_Position;\n" +
"}\n";

var FSHADER_SOURCE =
"precision mediump float;\n" +
"uniform vec4 u_FragColor;\n" +
"void main() {\n" +
"  gl_FragColor = u_FragColor;\n" +
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
    tick();
}

function initVertexBuffers(gl)
{
    var vertices = new Float32Array([
        0.0, 0.5,
        -0.5, -0.5,
        0.5, -0.5,
    ])
    var n = 3;
    var vertexBuffer = gl.createBuffer();
    if (!vertexBuffer) 
    {
        console.log("Failed to create the buffer object");
        return -1;
    }

    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

    var a_position = gl.getAttribLocation(gl.program, "a_Position")
    if (a_position < 0)
    {
        console.log("Failed to get the storage location of a_Position");
        return -1;
    }
    //gl.vertexAttrib3f(a_position, 0.5, 0.0, 0.0);
    //为该地址定制缓冲区数据的解析方式
    gl.vertexAttribPointer(a_position, 2, gl.FLOAT, false, 0, 0);
    // 连接a_position变量和缓冲区对象
    gl.enableVertexAttribArray(a_position);

    return n;
}

function draw(gl, n, curAngle, modelMatrix, u_modelMatrix)
{
    modelMatrix.setRotate(curAngle, 0, 0, 1)
    modelMatrix.translate(0.3, 0, 0);
    
    gl.uniformMatrix4fv(u_modelMatrix, false, modelMatrix.elements);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawArrays(gl.TRIANGLES, 0, n);
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