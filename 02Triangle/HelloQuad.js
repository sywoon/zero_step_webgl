
var VSHADER_SOURCE = 
"attribute vec4 a_Position;\n" +
"attribute float a_PointSize;\n" +
"void main() {\n" +
"  gl_Position = a_Position;\n" +
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

    var u_fragColor = gl.getUniformLocation(gl.program, "u_FragColor");

    gl.clearColor(0.0, 0.0, 0.3, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    //gl.drawArrays(gl.POINTS, 0, n);
    //gl.drawArrays(gl.LINES, 0, n);
    //gl.drawArrays(gl.LINE_STRIP, 0, n);
    //gl.drawArrays(gl.LINE_LOOP, 0, n);
    //gl.drawArrays(gl.TRIANGLES, 0, n);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, n);
    //gl.drawArrays(gl.TRIANGLE_FAN, 0, n);

}

function initVertexBuffers(gl)
{
    var vertices = new Float32Array([
        -0.5, 0.5,
        -0.5, -0.5,
        0.5, 0.5,
        0.5, -0.5,
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
