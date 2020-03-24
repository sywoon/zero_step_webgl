
var VSHADER_SOURCE = 
"attribute vec4 a_Position;\n" +
"attribute float a_PointSize;\n" +
"uniform mat4 u_modelMatrix;\n" +
"void main() {\n" +
"  gl_Position = u_modelMatrix * a_Position;\n" +
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

    // 先平移后旋转   rotate * translate * v  最后在第一项限  因为旋转绕z轴
    var ANGLE = 60.0;
    var transformMatrix = new Matrix4();
    transformMatrix.setRotate(ANGLE, 0, 0, 1);

    var tx = 0.5;
    var ty = 0.0;
    var tz = 0.0;
    transformMatrix.translate(tx, ty, tz);

    var sx = 1.0;
    var sy = 1.0;
    var sz = 1.0;
    transformMatrix.scale(sx, sy, sz);

    // 先旋转后平移   最后在x轴上   但是：三角形变形了  因为不是绕其中心点转  得到新的不再是等边三角形
    transformMatrix.setTranslate(tx, ty, tz);
    transformMatrix.rotate(ANGLE, 0, 0, 1);

    var u_modelMatrix = gl.getUniformLocation(gl.program, "u_modelMatrix");
    gl.uniformMatrix4fv(u_modelMatrix, false, transformMatrix.elements);


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
        0.0, 0.3,
        -0.3, -0.3,
        0.3, -0.3,
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

    var a_pointSize = gl.getAttribLocation(gl.program, "a_PointSize")
    if (a_pointSize < 0)
    {
        console.log("Failed to get the storage location of a_pointSize");
        return;
    }
    gl.vertexAttrib1f(a_pointSize, 10.0);

    return n;
}
