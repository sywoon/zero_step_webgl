function main()
{
    var canvas = document.getElementById("example");
    if (!canvas)
    {
        console.log("Failed to retrieve the <canvas> element");
        return false;
    }

    var ctx = canvas.getContext("2d");
    ctx.fillStyle = "rgba(0,0,255,1.0)";
    ctx.fillRect(0, 0, 150, 150);
}