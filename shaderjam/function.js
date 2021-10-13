//different brush options

var sinceUpdated=0;
var lastPos=[100,100];

//in JS, record each coord position up to a point

var brushMemory=new Array(100);
brushMemory.fill([100,100],0,99);

function getFile(file){
    return new Promise((resolve, reject) => {
        fetch(file)
        .then((response) => {
            resolve(response.text());
        })
      });
}



window.addEventListener('load',startUp);

function startUp(){
  let vertShaderSrc=getFile('shader.vert');
  let fragShaderSrc=getFile('shader.frag');
  Promise.all([vertShaderSrc,fragShaderSrc]).then((values) => {
      // console.log(values);
      main(values);
  });

}

function main(shaders){

    const canvas = document.querySelector('canvas');
    const gl=canvas.getContext('webgl');

    var resolutionXy;
    var mouseXy=[0,0];
    resolutionChange();
    window.addEventListener('resize',resolutionChange);
    canvas.addEventListener('mousemove',getMousePos);

    function resolutionChange(){
      canvas.width=canvas.offsetWidth;
      canvas.height=canvas.offsetHeight;

      resolutionXy=[
        canvas.width,
        canvas.height
      ];
    }

    function getMousePos(event){
      sinceUpdated=0;
      mouseXy=[
        event.offsetX,
        canvas.height-event.offsetY,
      ]
      let newVal=[Math.floor(mouseXy[0]),Math.floor(mouseXy[1])];
      lastPos=newVal;
      brushPush(newVal);
    }

    function brushPush(coords){
      brushMemory.push(coords);
      if(brushMemory.length>100){
        brushMemory.shift();
      }
    }


    const vertShader=gl.createShader(gl.VERTEX_SHADER);
    gl.shaderSource(vertShader,shaders[0]);
    gl.compileShader(vertShader);

    const fragShader=gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(fragShader,shaders[1]);
    gl.compileShader(fragShader);

    const shaderProgram=gl.createProgram();
    gl.attachShader(shaderProgram,vertShader);
    gl.attachShader(shaderProgram,fragShader);
    gl.linkProgram(shaderProgram);

    const vertPosLoc=gl.getAttribLocation(shaderProgram,'aVertexPosition');
    const uResLocation = gl.getUniformLocation(shaderProgram,'u_resolution');
    const uMouseLocation = gl.getUniformLocation(shaderProgram,'u_mouse');
    const uBrushLocation = gl.getUniformLocation(shaderProgram,'u_brush');
    // const brush = gl.createTexture();
    // gl.bindTexture(gl.TEXTURE_2D, texture);

    const positionBuffer=gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER,positionBuffer);
    const positions=[
        1.0, 1.0,
        -1.0, 1.0,
        1.0, -1.0,
        -1.0,-1.0
    ];
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions),gl.STATIC_DRAW);
    gl.vertexAttribPointer(vertPosLoc,2,gl.FLOAT,false,0,0);
    gl.enableVertexAttribArray(vertPosLoc);

    gl.enable(gl.DEPTH_TEST);
    gl.depthFunc(gl.LEQUAL);

    function render(){
      if(sinceUpdated>2){
        brushPush(lastPos);
      }
      sinceUpdated++;

      gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
      gl.useProgram(shaderProgram);
      gl.uniform2fv(uResLocation,resolutionXy);
      gl.uniform2fv(uMouseLocation,mouseXy);
      gl.uniform2fv(uBrushLocation,brushMemory.flat());
      gl.drawArrays(gl.TRIANGLE_STRIP,0,4);

      requestAnimationFrame(render);
    }
    requestAnimationFrame(render);


}
