
const canvas = document.querySelector('canvas');
var resolutionXy;
var mouseXy=[0,0];
window.addEventListener('resize',resolutionChange);

function resolutionChange(){
  canvas.width=canvas.offsetWidth;
  canvas.height=canvas.offsetHeight;

  resolutionXy=[
    canvas.width,
    canvas.height
  ];
}

window.addEventListener('load',startUp);

function startUp(){
  let vertShaderSrc=fetch('shader.vert').then((response) => {return response.text();});
  let fragShaderSrc=fetch('shader.frag').then((response) => {return response.text();});
  resolutionChange();
  Promise.all([vertShaderSrc,fragShaderSrc]).then((values) => {
      main(values);
  });

}

function main(sources){

    const gl=canvas.getContext('webgl');

    //atomizing the tasks like in the MDN guide is extremely useful

    // var shaderProgram=initializeShaderProgram(gl,sources);
    var programData={
      program:initializeShaderProgram(gl,sources)
    }
    programData={
      ...programData,
      ...{
        attribs:{
          vertexPosition:gl.getAttribLocation(programData.program,'aVertexPosition'),
        },
        uniforms:{
          resolution:gl.getUniformLocation(programData.program,'u_resolution'),
          mouse:gl.getUniformLocation(programData.program,'u_mouse')
        }
      }
    }

    let buffers={
      position:initializeVertexBuffer(gl)
    };


    bufferToAttribute(gl,buffers.position,programData.attribs.vertexPosition,{
      numComponents:2,
      type:gl.FLOAT,
      normalize:false,
      stride:0,
      offset:0
    });



    function render(){
      gl.enable(gl.DEPTH_TEST);
      gl.depthFunc(gl.LEQUAL); //I think these two are 3d things that I can ignore

      gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
      gl.useProgram(programData.program);
      gl.uniform2fv(programData.uniforms.resolution,resolutionXy);
      gl.uniform2fv(programData.uniforms.mouse,mouseXy);
      gl.drawArrays(gl.TRIANGLE_STRIP,0,4);

      requestAnimationFrame(render);
    }
    requestAnimationFrame(render);

}


function initializeShaderProgram(gl,sources){
  //loads and compiles vertex and fragment shader GLSL sources into objects
  var vertShader=loadShader(gl,gl.VERTEX_SHADER,sources[0]);
  var fragShader=loadShader(gl,gl.FRAGMENT_SHADER,sources[1]);

  //creates a new shader program and attaches the just-compiled shaders to it
  var shaderProgram=gl.createProgram();
  gl.attachShader(shaderProgram,vertShader);
  gl.attachShader(shaderProgram,fragShader);
  //links vertex and fragment shaders in the program I think?
  gl.linkProgram(shaderProgram);

  return shaderProgram;

}

function initializeVertexBuffer(gl){
  //creates an array that is thus far empty, I think
  const positionBuffer=gl.createBuffer();
  //sets this array as "the thing to apply buffer operations to from here on out"
  gl.bindBuffer(gl.ARRAY_BUFFER,positionBuffer);

  //these are the actual vertex coordinate pairs.
  //the vertex shader renders triangles using these coordinates
  //the fragment shader is passed interpolated position coordinates
  const positions=[
      1.0, 1.0,
      -1.0, 1.0,
      1.0, -1.0,
      -1.0,-1.0
  ];

  //passes in array to the buffer we just created and bound to gl.ARRAY_BUFFER
  //the third field is to specify how you're going to use this array, "for optimization purposes"
  //https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/bufferData
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions),gl.STATIC_DRAW);

  return positionBuffer;

}

function bufferToAttribute(gl,buffer,attrib,options){
  //idk why this has to be done again.
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  // MDN: "Tells WebGL how to pull out the positions from the position buffer into the vertex position attribute".
  gl.vertexAttribPointer(
        attrib,
        options.numComponents,
        options.type,
        options.normalize,
        options.stride,
        options.offset);
  gl.enableVertexAttribArray(attrib);

}


function loadShader(gl,type,source){
  //creates a shader...whatever "creating" entails in this context
  const shader=gl.createShader(type);
  //attaches source to shader
  gl.shaderSource(shader,source);
  //compiles the GLSL to run on the client's GPU
  gl.compileShader(shader);

  return shader;
}
