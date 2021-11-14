
precision highp float;


// uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform vec2 u_resolution;
varying highp vec2 v_texture_coord;
uniform sampler2D u_sampler;
uniform float u_time;
uniform float u_pass;

vec2 mapping(){
  vec2 mapped_coord=gl_FragCoord.xy;
  mapped_coord-=u_resolution/2.;
  float scale=500.;
  float img_width=500.;
  float img_height=500.;
  mapped_coord+=vec2(img_width/2.,img_height/2.);
  mapped_coord = mapped_coord/scale;
  mapped_coord.y=mapped_coord.y;
  return mapped_coord;
}


void main(){
    float iter = mod(float(u_time),13.0);

    vec2 mapped_coord=mapping();
    vec4 texturePixel=texture2D(u_sampler,mapped_coord);
    float dist=length(texturePixel.rg-mapped_coord)*20.;

    gl_FragColor=texturePixel;
    // gl_FragColor=vec4(vec3(dist),1.);
}
