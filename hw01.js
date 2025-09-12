// Global constants
const canvas = document.getElementById('glCanvas'); // Get the canvas element 
const gl = canvas.getContext('webgl2'); // Get the WebGL2 context

if (!gl) {
    console.error('WebGL 2 is not supported by your browser.');
}

canvas.width = 500;
canvas.height = 500;

// Initialize WebGL settings: viewport and clear color
gl.enable(gl.SCISSOR_TEST);

gl.viewport(0, 0, canvas.width, canvas.height);
gl.scissor(0, 0, canvas.width/2, canvas.height/2);
gl.clearColor(0.0, 0.0, 1.0, 1.0);
render();

gl.scissor(canvas.width/2, canvas.height/2, canvas.width/2, canvas.height/2);
gl.clearColor(1.0, 0.0, 0.0, 1.0);
render();

gl.scissor(canvas.width/2, 0, canvas.width/2, canvas.height/2);
gl.clearColor(1.0, 1.0, 0.0, 1.0);
render();

gl.scissor(0, canvas.height/2, canvas.width/2, canvas.height/2);
gl.clearColor(0.0, 1.0, 0.0, 1.0);
render();

// Render loop
function render() {
    gl.clear(gl.COLOR_BUFFER_BIT);
    // Draw something here
}

// Resize viewport while maintaining aspect ratio
window.addEventListener('resize', () => {
    // Calculate new canvas dimensions while maintaining aspect ratio
    const aspectRatio = 1;
    let newWidth = window.innerWidth;
    let newHeight = window.innerHeight;

    if (newWidth / newHeight > aspectRatio) {
        newWidth = newHeight * aspectRatio;
    } else {
        newHeight = newWidth / aspectRatio;
    }
    canvas.width = newWidth;
    canvas.height = newHeight;

    gl.viewport(0, 0, canvas.width, canvas.height);
    
    gl.scissor(0, 0, canvas.width/2, canvas.height/2);
    gl.clearColor(0.0, 0.0, 1.0, 1.0);
    render();

    gl.scissor(canvas.width/2, canvas.height/2, canvas.width/2, canvas.height/2);
    gl.clearColor(1.0, 0.0, 0.0, 1.0);
    render();

    gl.scissor(canvas.width/2, 0, canvas.width/2, canvas.height/2);
    gl.clearColor(1.0, 1.0, 0.0, 1.0);
    render();

    gl.scissor(0, canvas.height/2, canvas.width/2, canvas.height/2);
    gl.clearColor(0.0, 1.0, 0.0, 1.0);
    render();
});