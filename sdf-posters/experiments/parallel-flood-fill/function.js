const input = document.querySelector('#input canvas');
let ctx=input.getContext('2d');
const output = document.querySelector('#output canvas');

//gl
const gl=output.getContext('webgl');
var jfaProgram;
var canvasData;
var jfaStorage;
var jfaAltStorage;
var buffers;

//uniforms
var resolutionXy=[input.width,input.height]
var mouseXy=[0,0];
var passCount=0;
let startTime;

const positions=[
    1.0, 1.0,
    -1.0, 1.0,
    1.0, -1.0,
    -1.0,-1.0
];




window.addEventListener('load',startUp);

function startUp(){


  ctx.font="400px serif";
  ctx.fillText('A', 100, 400);


  let vertShaderSrc=fetch('shader.vert').then((response) => {return response.text();});
  let jfaShaderSrc=fetch('jfa.frag').then((response) => {return response.text();});
  let fragShaderSrc=fetch('shader.frag').then((response) => {return response.text();});
  Promise.all([vertShaderSrc,jfaShaderSrc,fragShaderSrc]).then((values) => {
      startTime = Date.now();
      main(values);
  });

}





function main(sources){
    jfaProgram={
      program:initializeShaderProgram(gl,sources[0],sources[1])
    }
    shaderProgram={
      program:initializeShaderProgram(gl,sources[0],sources[2])
    }


    let jfaProperties={
      attribs:{
        vertexPosition:gl.getAttribLocation(jfaProgram.program,'aVertexPosition'),
        textureCoord: gl.getAttribLocation(jfaProgram.program, 'a_texture_coord'),
      },
      uniforms:{
        resolution:gl.getUniformLocation(jfaProgram.program,'u_resolution'),
        sampler:gl.getUniformLocation(jfaProgram.program, 'u_sampler'),
        pass:gl.getUniformLocation(jfaProgram.program, 'u_pass'),
        time:gl.getUniformLocation(jfaProgram.program, "u_time")
      }
    }
    let shaderProperties={
      attribs:{
        vertexPosition:gl.getAttribLocation(shaderProgram.program,'aVertexPosition'),
        textureCoord: gl.getAttribLocation(shaderProgram.program, 'a_texture_coord')
      },
      uniforms:{
        resolution:gl.getUniformLocation(shaderProgram.program,'u_resolution'),
        sampler:gl.getUniformLocation(shaderProgram.program, 'u_sampler'),
        pass:gl.getUniformLocation(shaderProgram.program, 'u_pass'),
        time:gl.getUniformLocation(shaderProgram.program, "u_time")
      }
    }

    jfaProgram={
      ...jfaProgram,
      ...jfaProperties
    }
    shaderProgram={
      ...shaderProgram,
      ...shaderProperties
    }



    canvasData=loadCanvasTexture(gl, input);
    jfaStorage=declareTexture();
    jfaAltStorage=declareTexture();




    let attrOptions={
      numComponents:2,
      type:gl.FLOAT,
      normalize:false,
      stride:0,
      offset:0
    }

    buffers={
      position:initializeBuffer(gl,positions,jfaProgram.attribs.vertexPosition,attrOptions),
      texture:initializeBuffer(gl,positions,jfaProgram.attribs.textureCoord,attrOptions),
      jfa:declareFrameBuffer(jfaStorage)
    }


    // window.requestAnimationFrame(render);
    // render();
    document.querySelector('#refresh').addEventListener('click',render);

}


function render(){
  console.log('rendering');
  renderJumpFlood();
  renderPoster();
  passCount++;

  if(passCount>0){
    console.log(passCount-1,Math.floor(Math.pow(2, (Math.log2(500) - (passCount - 1) - 1))));
  }

  // window.requestAnimationFrame(render);
  // if(passCount<=resolutionXy[0]){
  //   window.requestAnimationFrame(render);
  // }
}


function renderJumpFlood(input,output){
  let inputBuffer=passCount%2==0?jfaStorage:jfaAltStorage;
  let outputBuffer=passCount%2==0?jfaAltStorage:jfaStorage;

  gl.useProgram(jfaProgram.program);
  gl.enable(gl.DEPTH_TEST);
  gl.depthFunc(gl.LEQUAL); //I think these two are 3d things that I can ignore

  buffers.jfa=declareFrameBuffer(outputBuffer);
  gl.activeTexture(gl.TEXTURE0);
  if(passCount>0){
    gl.bindTexture(gl.TEXTURE_2D, inputBuffer);
    gl.uniform1i(jfaProgram.uniforms.sampler, 0);
  }else{
    gl.bindTexture(gl.TEXTURE_2D, canvasData);
    gl.uniform1i(jfaProgram.uniforms.sampler, 0);
  }





  gl.uniform1f(jfaProgram.uniforms.pass, passCount);
  gl.uniform2fv(jfaProgram.uniforms.resolution,resolutionXy);
  gl.uniform1f(jfaProgram.uniforms.time, (Date.now() - startTime) * .001);
  gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
  gl.drawArrays(gl.TRIANGLE_STRIP,0,4);
}

function renderPoster(){
  let inputBuffer=passCount%2==0?jfaAltStorage:jfaStorage;
  gl.useProgram(shaderProgram.program);
  gl.bindFramebuffer(gl.FRAMEBUFFER, null);
  gl.activeTexture(gl.TEXTURE0);
  gl.bindTexture(gl.TEXTURE_2D, inputBuffer);
  gl.uniform1i(shaderProgram.uniforms.sampler, 0);


  gl.uniform1f(shaderProgram.uniforms.pass, passCount);
  gl.uniform2fv(shaderProgram.uniforms.resolution,resolutionXy);
  gl.uniform1f(shaderProgram.uniforms.time, (Date.now() - startTime) * .001);
  gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);


  gl.drawArrays(gl.TRIANGLE_STRIP,0,4);
}



function loadCanvasTexture(gl, canvas, wrap, min_filter) {
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
    wrap = wrap || gl.REPEAT;
    min_filter = min_filter || gl.LINEAR_MIPMAP_LINEAR
    const level = 0;
    const internalFormat = gl.RGBA;
    const srcFormat = gl.RGBA;
    const srcType = gl.UNSIGNED_BYTE;

    const texture2d = gl.createTexture();

    gl.bindTexture(gl.TEXTURE_2D, texture2d);
    gl.texImage2D(gl.TEXTURE_2D, level, internalFormat,srcFormat, srcType, canvas);
    if (isPowerOf2(canvas.width) && isPowerOf2(canvas.height)) {
      console.log('is power of 2')
        gl.generateMipmap(gl.TEXTURE_2D);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, wrap);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, wrap);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, min_filter);

    } else {
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    }
    return texture2d;
}

function declareTexture() {
    const level = 0;
    const internalFormat = gl.RGBA;
    const srcFormat = gl.RGBA;
    const srcType = gl.UNSIGNED_BYTE;
    const texture2d = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, texture2d);
    gl.texImage2D(gl.TEXTURE_2D, level, internalFormat, 500, 500, 0, srcFormat, gl.UNSIGNED_BYTE, null);

    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);

    return texture2d;
}



function isPowerOf2(value) {
  return (value & (value - 1)) == 0;
}


//not immediately relevant-------------------
function initializeShaderProgram(gl,vertex,fragment){
  var vertShader=loadShader(gl,gl.VERTEX_SHADER,vertex);
  var fragShader=loadShader(gl,gl.FRAGMENT_SHADER,fragment);

  var shaderProgram=gl.createProgram();
  gl.attachShader(shaderProgram,vertShader);
  gl.attachShader(shaderProgram,fragShader);
  gl.linkProgram(shaderProgram);

  return shaderProgram;

}

function initializeBuffer(gl,data,attrib,options){
  let newBuffer=gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER,newBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(data),gl.STATIC_DRAW);
  gl.vertexAttribPointer(
        attrib,
        options.numComponents,
        options.type,
        options.normalize,
        options.stride,
        options.offset);
  gl.enableVertexAttribArray(attrib);
}

function declareFrameBuffer(storeTexture){
  const framebuffer = gl.createFramebuffer();
  gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer);
  gl.viewport(0, 0, 500, 500);
  gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, storeTexture, 0);
  // gl.viewport(0, 0, 500, 500);

  return framebuffer;
}



function loadShader(gl,type,source){
  const shader=gl.createShader(type);
  gl.shaderSource(shader,source);
  gl.compileShader(shader);
  return shader;
}
