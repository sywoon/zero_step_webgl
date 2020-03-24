
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

    var a_position = gl.getAttribLocation(gl.program, "a_Position")
    if (a_position < 0)
    {
        console.log("Failed to get the storage location of a_Position");
        return;
    }
    gl.vertexAttrib2f(a_position, 0.5, 0.5);
    //gl.vertexAttrib3f(a_position, 0.5, 0.0, 0.0);

    var a_pointSize = gl.getAttribLocation(gl.program, "a_PointSize")
    if (a_pointSize < 0)
    {
        console.log("Failed to get the storage location of a_pointSize");
        return;
    }
    gl.vertexAttrib1f(a_pointSize, 10.0);

    var u_fragColor = gl.getUniformLocation(gl.program, "u_FragColor");

    canvas.onmousedown = function (ev) 
    {
        clicked(ev, gl, canvas, a_position, u_fragColor);    
    }

    gl.clearColor(0.0, 0.0, 0.3, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);
}


var g_points = [];
var g_colors = [];
function clicked(ev, gl, canvas, a_position, u_fragColor)
{
    var x = ev.clientX;
    var y = ev.clientY;
    //var rect = ev.target.getBoundingClientRect();
    // var rect = canvas.getBoundingClientRect();
    // x = ((x - rect.left) - canvas.width/2) / (canvas.width/2);
    // y = (canvas.height/2 - (y - rect.top)) / (canvas.height/2);

    var pt = clientToWebGL(x, y);
    x = pt.x
    y = pt.y
    g_points.push([x,y]);

    if (x >= 0.0 && y >= 0.0)
    {
        g_colors.push([1.0, 0.0, 0.0, 1.0]);
    } else if (x < 0.0 && y < 0.0)
    {
        g_colors.push([0.0, 1.0, 0.0, 1.0]);
    } else
    {
        g_colors.push([0.0, 0.0, 1.0, 1.0]);
    }

    gl.clear(gl.COLOR_BUFFER_BIT);
    var len = g_points.length;
    for (var i = 0; i < len; i++)
    {
        var pt = g_points[i];
        var color = g_colors[i];
        gl.vertexAttrib3f(a_position, pt[0], pt[1], 0.0);
        gl.uniform4f(u_fragColor, color[0], color[1], color[2], color[3]);
        gl.drawArrays(gl.POINTS, 0, 1);
    }
}