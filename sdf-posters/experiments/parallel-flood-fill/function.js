const input = document.querySelector('#input canvas');
const output = document.querySelector('#output canvas');



var resolutionXy=[input.width,input.height]
var mouseXy=[0,0];

const positions=[
    1.0, 1.0,
    -1.0, 1.0,
    1.0, -1.0,
    -1.0,-1.0
];




window.addEventListener('load',startUp);

function startUp(){

  let ctx2d=input.getContext('2d');
  ctx2d.font="600px 'Courier New'";
  ctx2d.fillText('A', 60, 400);
  ctx2d.strokeText('A',60, 400);


  let vertShaderSrc=fetch('shader.vert').then((response) => {return response.text();});
  let fragShaderSrc=fetch('shader.frag').then((response) => {return response.text();});
  // let fragShaderSrc=fetch('frag-alt.frag').then((response) => {return response.text();});
  Promise.all([vertShaderSrc,fragShaderSrc]).then((values) => {
      main(values);
      // alt(values);
  });

}





function main(sources){

    const gl=output.getContext('webgl');

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
          sampler:gl.getUniformLocation(programData.program, 'u_sampler')
        }
      }
    }

    let texture=loadCanvasTexture(gl, input);
    // let texture=loadTexture(gl,'a-cap.png');
    // let texture=handleLoadedTexture(gl, input);
    // handleLoadedTexture(gl,texture, input);




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

      gl.uniform2fv(programData.uniforms.resolution,resolutionXy);

      gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

      gl.drawArrays(gl.TRIANGLE_STRIP,0,4);

      requestAnimationFrame(render);
    }
    requestAnimationFrame(render);

}


function loadCanvasTexture(gl, canvas, wrap, min_filter) {
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
    wrap = wrap || gl.REPEAT;
    min_filter = min_filter || gl.LINEAR_MIPMAP_LINEAR
    const level = 0;
    const internalFormat = gl.RGBA;
    const srcFormat = gl.RGBA;
    const srcType = gl.UNSIGNED_BYTE;
    // gl.texImage2D(gl.TEXTURE_2D, level, internalFormat,width, height, border, srcFormat, srcType,pixel);

    const texture = gl.createTexture();

    // gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texImage2D(gl.TEXTURE_2D, level, internalFormat,srcFormat, srcType, canvas);
    if (isPowerOf2(canvas.width) && isPowerOf2(canvas.height)) {
      console.log('is power of 2')
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

    // gl.bindTexture(gl.TEXTURE_2D, null);


    return texture;
}


function isPowerOf2(value) {
  return (value & (value - 1)) == 0;
}


//not immediately relevant-------------------
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

function loadShader(gl,type,source){
  const shader=gl.createShader(type);
  gl.shaderSource(shader,source);
  gl.compileShader(shader);
  return shader;
}



//not in use----------------------------------

function handleLoadedTexture(gl, textureCanvas) {
    let texture = gl.createTexture();
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);

    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, textureCanvas); // This is the important line!
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_NEAREST);
    gl.generateMipmap(gl.TEXTURE_2D);

    gl.bindTexture(gl.TEXTURE_2D, null);
    return texture;
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
