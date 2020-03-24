
var VSHADER_SOURCE = 
"attribute vec4 a_Position;\n" +
"attribute float a_PointSize;\n" +
"uniform mat4 u_xformMatrix;\n" +
"void main() {\n" +
"  gl_Position = u_xformMatrix * a_Position;\n" +
"  gl_PointSize = a_PointSize;\n" +
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

    var ANGLE = 90.0;
    var radian = Math.PI * ANGLE / 180.0;
    var cosB = Math.cos(radian);
    var sinB = Math.sin(radian);
    var xformMatrix = new Float32Array([
        cosB, sinB, 0.0, 0.0,
        -sinB, cosB, 0.0, 0.0,
        0.0, 0.0, 1.0, 0.0,
        0.0, 0.0, 0.0, 1.0,
    ])

    var tx = 0.5;
    var ty = 0.5;
    var tz = 0.0;
    var transMatrix = new Float32Array([
        1.0, 0.0, 0.0, 0.0,
        0.0, 1.0, 0.0, 0.0,
        0.0, 0.0, 1.0, 0.0,
        tx, ty, tz, 1.0,
    ])

    var sx = 1.0;
    var sy = 1.5;
    var sz = 1.0;
    var scaleMatrix = new Float32Array([
        sx, 0.0, 0.0, 0.0,
        0.0, sy, 0.0, 0.0,
        0.0, 0.0, sz, 0.0,
        0.0, 0.0, 0.0, 1.0,
    ])
    var u_xformMatrix = gl.getUniformLocation(gl.program, "u_xformMatrix");
    gl.uniformMatrix4fv(u_xformMatrix, false, scaleMatrix);


    gl.clearColor(0.0, 0.0, 0.3, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    //gl.drawArrays(gl.POINTS, 0, n);
    //gl.drawArrays(gl.LINES, 0, n);
    //gl.drawArrays(gl.LINE_STRIP, 0, n);
    //gl.drawArrays(gl.LINE_LOOP, 0, n);
    gl.drawArrays(gl.TRIANGLES, 0, n);
    //gl.drawArrays(gl.TRIANGLE_STRIP, 0, n);
    //gl.drawArrays(gl.TRIANGLE_FAN, 0, n);

}

function initVertexBuffers(gl)
{
    var vertices = new Float32Array([
        -0.8, 0.5, 
        -0.5, -0.5, 
        -0.2, 0.5, 

        0.1, -0.5,
        0.4, 0.5, 
        0.7, -0.5,
    ])
    var n = 6;
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

    var a_pointSize = gl.getAttribLocation(gl.program, "a_PointSize")
    if (a_pointSize < 0)
    {
        console.log("Failed to get the storage location of a_pointSize");
        return;
    }
    gl.vertexAttrib1f(a_pointSize, 10.0);

    return n;
}
