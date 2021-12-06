
precision highp float;


// uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform vec2 u_resolution;
varying highp vec2 v_texture_coord;
uniform sampler2D u_sampler;
uniform sampler2D u_sampler1;
uniform sampler2D u_sampler2;
uniform float u_time;
uniform float u_pass;
uniform vec3 active;

// vec2 img_size=u_resolution;


vec2 norm(vec2 coord){
  vec2 uv =(coord.xy-0.5) / u_resolution.xy;
  return uv;
}


float topograph(vec4 texturePixel){
  float dist=length((texturePixel.rg*u_resolution)-gl_FragCoord.xy)/200.;
  float fill=dist;
  fill= mod(fill, 0.1) * 10.0;
  fill = step(0.1, fill);
  return fill;
}


void main(){

    vec2 mapped_coord=norm(gl_FragCoord.xy);
    vec4 l0=texture2D(u_sampler,mapped_coord);
    vec4 l1=texture2D(u_sampler1,mapped_coord);
    vec4 l2=texture2D(u_sampler2,mapped_coord);

    // float r=topograph(l0);
    // float g=topograph(l1);
    // float b=topograph(l2);


    float r=mix(topograph(l0),1.,active.x);
    float g=mix(topograph(l1),1.,active.y);
    float b=mix(topograph(l2),1.,active.z);
    // float dist=length(texturePixel.rg-mapped_coord)*20.;


    gl_FragColor=vec4(r,g,b,1.);
    // gl_FragColor=vec4(r,g,b,1.);



    // gl_FragColor=texturePixel;




}
