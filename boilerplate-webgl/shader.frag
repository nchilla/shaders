
precision highp float;


uniform vec2 u_resolution;
uniform vec2 u_mouse;


vec3 draw(){
  return vec3(0.1,0.6,0.3);
}


void main(){

    vec3 rgb;
    rgb=draw();

    gl_FragColor=vec4(rgb,1.);
}
