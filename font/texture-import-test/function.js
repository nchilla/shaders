
const canvas = document.querySelector('canvas');
var resolutionXy;
var mouseXy=[0,0];
window.addEventListener('resize',resolutionChange);
const positions=[
    1.0, 1.0,
    -1.0, 1.0,
    1.0, -1.0,
    -1.0,-1.0
];


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

    var programData={
      program:initializeShaderProgram(gl,sources)
    }
    programData={
      ...programData,
      ...{
        attribs:{
          vertexPosition:gl.getAttribLocation(programData.program,'aVertexPosition'),
          textureCoord: gl.getAttribLocation(programData.program, 'a_texture_coord')
        },
        uniforms:{
          resolution:gl.getUniformLocation(programData.program,'u_resolution'),
          mouse:gl.getUniformLocation(programData.program,'u_mouse'),
          sampler:gl.getUniformLocation(programData.program, 'u_sampler')
        }
      }
    }

    // let texture=loadTexture(gl,'freg.jpg');
    let texture=loadTexture(gl,'a-cap.png');
    // let texture=loadTexture(gl,'https://compform.net/experimental_shaders/textures/textures/pear.jpg');



    let attrOptions={
      numComponents:2,
      type:gl.FLOAT,
      normalize:false,
      stride:0,
      offset:0
    }

    let buffers={
      position:initializeBuffer(gl,positions,programData.attribs.vertexPosition,attrOptions),
      texture:initializeBuffer(gl,positions,programData.attribs.textureCoord,attrOptions)
    }

    // let buffers;
    // buffers.position=gl.createBuffer();
    // gl.bindBuffer(gl.ARRAY_BUFFER,buffers.position);
    // gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(programData.attribs.vertexPosition),gl.STATIC_DRAW);
    // gl.vertexAttribPointer(
    //       programData.attribs.vertexPosition,
    //       attrOptions.numComponents,
    //       attrOptions.type,
    //       attrOptions.normalize,
    //       attrOptions.stride,
    //       attrOptions.offset);
    // gl.enableVertexAttribArray(attrib);









    // bufferToAttribute(gl,buffers.position,programData.attribs.vertexPosition,attrOptions);
    // bufferToAttribute(gl,buffers.texture,programData.attribs.vertexPosition,attrOptions);



    function render(){

      gl.useProgram(programData.program);

      gl.enable(gl.DEPTH_TEST);
      gl.depthFunc(gl.LEQUAL); //I think these two are 3d things that I can ignore



      // Tell WebGL we want to affect texture unit 0
      gl.activeTexture(gl.TEXTURE0);
      // Bind the texture to texture unit 0
      gl.bindTexture(gl.TEXTURE_2D, texture);
      // Tell the shader we bound the texture to texture unit 0
      gl.uniform1i(programData.uniforms.sampler, 0);

      gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

      gl.uniform2fv(programData.uniforms.resolution,resolutionXy);
      gl.uniform2fv(programData.uniforms.mouse,mouseXy);
      gl.drawArrays(gl.TRIANGLE_STRIP,0,4);

      requestAnimationFrame(render);
    }
    requestAnimationFrame(render);

}


function initializeShaderProgram(gl,sources){
  var vertShader=loadShader(gl,gl.VERTEX_SHADER,sources[0]);
  var fragShader=loadShader(gl,gl.FRAGMENT_SHADER,sources[1]);

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



// function initializeBufferOld(gl,data){
//   let newBuffer=gl.createBuffer();
//   gl.bindBuffer(gl.ARRAY_BUFFER,newBuffer);
//   gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(data),gl.STATIC_DRAW);
//   return newBuffer;
// }



// function bufferToAttribute(gl,buffer,attrib,options){
//
//   gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
//   gl.vertexAttribPointer(
//         attrib,
//         options.numComponents,
//         options.type,
//         options.normalize,
//         options.stride,
//         options.offset);
//   gl.enableVertexAttribArray(attrib);
//
// }


function loadShader(gl,type,source){
  const shader=gl.createShader(type);
  gl.shaderSource(shader,source);
  gl.compileShader(shader);
  return shader;
}


function loadTexture(gl, url, wrap, min_filter) {

    wrap = wrap || gl.REPEAT;
    min_filter = min_filter || gl.LINEAR_MIPMAP_LINEAR

    const texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, texture);

    // Because images have to be download over the internet
    // they might take a moment until they are ready.
    // Until then put a single pixel in the texture so we can
    // use it immediately. When the image has finished downloading
    // we'll update the texture with the contents of the image.
    const level = 0;
    const internalFormat = gl.RGBA;
    const width = 1;
    const height = 1;
    const border = 0;
    const srcFormat = gl.RGBA;
    const srcType = gl.UNSIGNED_BYTE;
    const pixel = new Uint8Array([0, 0, 255, 255]);  // opaque blue
    gl.texImage2D(gl.TEXTURE_2D, level, internalFormat,
        width, height, border, srcFormat, srcType,
        pixel);

    const image = new Image();
    image.onload = function () {
        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.texImage2D(gl.TEXTURE_2D, level, internalFormat,
            srcFormat, srcType, image);

        // WebGL1 has different requirements for power of 2 images
        // vs non power of 2 images so check if the image is a
        // power of 2 in both dimensions.
        if (isPowerOf2(image.width) && isPowerOf2(image.height)) {
            // Yes, it's a power of 2. Generate mips.
            gl.generateMipmap(gl.TEXTURE_2D);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, wrap);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, wrap);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, min_filter);

        } else {
            // No, it's not a power of 2. Turn off mips and set
            // wrapping to clamp to edge
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        }
    };

	  image.crossOrigin = "";   // ask for CORS permission
    image.src = url;

    return texture;
}


function isPowerOf2(value) {
  return (value & (value - 1)) == 0;
}

// function loadTexture(gl,source){
//   let texture=gl.createTexture();
//
//   let level = 0;
//   let internalFormat = gl.RGBA;
//   let  width = 1;
//   let  height = 1;
//   let  border = 0;
//   let  srcFormat = gl.RGBA;
//   let  srcType = gl.UNSIGNED_BYTE;
//   let  pixel = new Uint8Array([0, 0, 255, 255]);  // opaque blue
//   gl.texImage2D(gl.TEXTURE_2D, level, internalFormat, width, height, border, srcFormat, srcType, pixel);
//
//
//   let img= new Image();
//   img.crossOrigin = "";
//   img.onload=e=>{
//     console.log(img);
//     gl.bindTexture(gl.TEXTURE_2D, texture);
//     gl.texImage2D(gl.TEXTURE_2D, level, internalFormat,
//                   srcFormat, srcType, img);
//     // WebGL1 has different requirements for power of 2 images
//     // vs non power of 2 images so check if the image is a
//     // power of 2 in both dimensions.
//     gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
//     gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
//     gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
//
//   }
//   img.src=source;
//
//   return texture;
// }
