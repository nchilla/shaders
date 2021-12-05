class Shader {
  constructor(inputs, gl, resolution, effects, sources) {
    this.resolution=resolution;
    this.start_time= Date.now();
    this.pass=0;

    this.positions=[
        1.0, 1.0,
        -1.0, 1.0,
        1.0, -1.0,
        -1.0,-1.0
    ];

    const jfa_program=this.initialize_shader_program(gl,sources[0],sources[1]);
    const shader_program=this.initialize_shader_program(gl,sources[0],sources[2]);


    this.jfa={
      program:jfa_program,
      attribs:{
        vertexPosition:gl.getAttribLocation(jfa_program,'aVertexPosition'),
        textureCoord: gl.getAttribLocation(jfa_program, 'a_texture_coord'),
      },
      uniforms:{
        resolution:gl.getUniformLocation(jfa_program,'u_resolution'),
        sampler:gl.getUniformLocation(jfa_program, 'u_sampler'),
        pass:gl.getUniformLocation(jfa_program, 'u_pass'),
        time:gl.getUniformLocation(jfa_program, "u_time")
      }
    }

    this.shader={
      program:shader_program,
      attribs:{
        vertexPosition:gl.getAttribLocation(shader_program,'aVertexPosition'),
        textureCoord: gl.getAttribLocation(shader_program, 'a_texture_coord')
      },
      uniforms:{
        resolution:gl.getUniformLocation(shader_program,'u_resolution'),
        sampler:gl.getUniformLocation(shader_program, 'u_sampler'),
        pass:gl.getUniformLocation(shader_program, 'u_pass'),
        time:gl.getUniformLocation(shader_program, "u_time")
      }
    }

    // this.canvas_data=this.load_canvas_texture(gl, input);

    this.canvas_data=[
      this.load_canvas_texture(gl, inputs[0]),
      this.load_canvas_texture(gl, inputs[1]),
      this.load_canvas_texture(gl, inputs[2]),
    ];

    this.texture_storage=[
      this.declare_texture(),
      this.declare_texture(),
      this.declare_texture()
    ]

    this.jfa_storage=this.declare_texture();
    this.jfa_alt_storage=this.declare_texture();

    let attr_options={
      numComponents:2,
      type:gl.FLOAT,
      normalize:false,
      stride:0,
      offset:0
    }

    this.buffers={
      position:this.initialize_buffer(gl,this.positions,this.jfa.attribs.vertexPosition,attr_options),
      texture:this.initialize_buffer(gl,this.positions,this.jfa.attribs.textureCoord,attr_options),
      jfa:this.declare_frame_buffer(this.jfa_storage)
    }

  }

  render(){
    this.pass=0;
    const passMetric=this.resolution[0]>this.resolution[1]?this.resolution[0]:this.resolution[1];

    while(this.pass<=Math.log2(passMetric)){
      this.render_jump_flood();
      this.pass++;
    }

    this.pass-=1;
    this.render_poster();


  }

  render_jump_flood(){
    let input_buffer=this.pass%2==0?this.jfa_storage:this.jfa_alt_storage;
    let output_buffer=this.pass%2==0?this.jfa_alt_storage:this.jfa_storage;

    gl.useProgram(this.jfa.program);
    gl.enable(gl.DEPTH_TEST);
    gl.depthFunc(gl.LEQUAL);

    this.buffers.jfa=this.declare_frame_buffer(output_buffer);
    gl.activeTexture(gl.TEXTURE0);
    if(this.pass>0){
      gl.bindTexture(gl.TEXTURE_2D, input_buffer);
      gl.uniform1i(this.jfa.uniforms.sampler, 0);
    }else{
      gl.bindTexture(gl.TEXTURE_2D, this.canvas_data[0]);
      gl.uniform1i(this.jfa.uniforms.sampler, 0);
    }


    let t=(Date.now() - this.start_time) * .001;


    gl.uniform1f(this.jfa.uniforms.pass, this.pass);
    gl.uniform2fv(this.jfa.uniforms.resolution,this.resolution);
    gl.uniform1f(this.jfa.uniforms.time, t);
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
    gl.drawArrays(gl.TRIANGLE_STRIP,0,4);
  }

  render_poster(){
    let input_buffer=this.pass%2==0?this.jfa_alt_storage:this.jfa_storage;
    gl.useProgram(this.shader.program);
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, input_buffer);
    gl.uniform1i(this.shader.uniforms.sampler, 0);


    gl.uniform1f(this.shader.uniforms.pass, this.pass);
    gl.uniform2fv(this.shader.uniforms.resolution,this.resolution);
    gl.uniform1f(this.shader.uniforms.time, (Date.now() - this.start_time) * .001);
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);


    gl.drawArrays(gl.TRIANGLE_STRIP,0,4);
  }

  display_update(inputs, gl, active){

    // for(var i = 0; i<inputs.length; i++){
    //   if(active[i]){
    //     this.canvas_data[i]=this.load_canvas_texture(gl, inputs[i])
    //   };
    // }

    this.canvas_data=[
      this.load_canvas_texture(gl, inputs[0]),
      this.load_canvas_texture(gl, inputs[1]),
      this.load_canvas_texture(gl, inputs[2]),
    ];

  }


  resolution_update(inputs, gl, resolution, effects){
    this.resolution=resolution;
    this.canvas_data=[
      this.load_canvas_texture(gl, inputs[0]),
      this.load_canvas_texture(gl, inputs[1]),
      this.load_canvas_texture(gl, inputs[2])
    ];
    this.jfa_storage=this.declare_texture();
    this.jfa_alt_storage=this.declare_texture();
  }


  load_canvas_texture(gl, canvas, wrap, min_filter) {
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
      if (this.isPowerOf2(canvas.width) && this.isPowerOf2(canvas.height)) {
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

  declare_texture() {
      const level = 0;
      const internalFormat = gl.RGBA;
      const srcFormat = gl.RGBA;
      const srcType = gl.UNSIGNED_BYTE;
      const texture2d = gl.createTexture();
      gl.bindTexture(gl.TEXTURE_2D, texture2d);
      gl.texImage2D(gl.TEXTURE_2D, level, internalFormat, resolution[0], resolution[1], 0, srcFormat, gl.UNSIGNED_BYTE, null);

      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);

      return texture2d;
  }



  isPowerOf2(value) {
    return (value & (value - 1)) == 0;
  }


  initialize_shader_program(gl,vertex,fragment){
    var vertShader=this.load_shader(gl,gl.VERTEX_SHADER,vertex);
    var fragShader=this.load_shader(gl,gl.FRAGMENT_SHADER,fragment);

    var shaderProgram=gl.createProgram();
    gl.attachShader(shaderProgram,vertShader);
    gl.attachShader(shaderProgram,fragShader);
    gl.linkProgram(shaderProgram);

    return shaderProgram;

  }

  initialize_buffer(gl,data,attrib,options){
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

  declare_frame_buffer(storeTexture){
    const framebuffer = gl.createFramebuffer();
    gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer);
    gl.viewport(0, 0, resolution[0], resolution[1]);
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, storeTexture, 0);

    return framebuffer;
  }


  load_shader(gl,type,source){
    const shader=gl.createShader(type);
    gl.shaderSource(shader,source);
    gl.compileShader(shader);
    return shader;
  }

}
