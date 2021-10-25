
precision highp float;


uniform vec2 u_resolution;
uniform vec2 u_mouse;
varying highp vec2 v_texture_coord;
uniform sampler2D u_sampler;

vec3 draw(){
  return vec3(0.1,0.6,0.3);
}

vec3 img_sample(){
  vec2 mapped_coord=gl_FragCoord.xy;
  mapped_coord-=u_resolution/2.;

  float scale=300.;
  //change in future with width and height uniforms instead of raw values
  float img_width=332.;
  float img_height=332.;
  mapped_coord+=vec2(img_width/2.,img_height/2.);





  mapped_coord = mapped_coord/scale;
  mapped_coord.y=1.-mapped_coord.y;

  // mapped_coord=mapped_coord/u_resolution*1000.;
  vec4 theSample=texture2D(u_sampler,mapped_coord);



  return vec3(theSample.rgb);
  // return vec3(mapped_coord,0.0);
}


void main(){

    vec3 rgb;
    rgb=draw();
    rgb=img_sample();


    gl_FragColor=vec4(rgb,1.);
}
