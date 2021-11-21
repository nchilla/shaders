
precision highp float;


// uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform vec2 u_resolution;
varying highp vec2 v_texture_coord;
uniform sampler2D u_sampler;
uniform float u_time;
uniform float u_pass;

vec2 img_size=vec2(500.,500.);


vec2 norm(vec2 coord){
  vec2 uv =(coord.xy-0.5) / img_size.xy;
  return uv;
}





void main(){

    vec2 mapped_coord=norm(gl_FragCoord.xy);
    vec4 texturePixel=texture2D(u_sampler,mapped_coord);
    // float dist=length(texturePixel.rg-mapped_coord)*20.;
    // float dist=length(texturePixel.rg*500.-gl_FragCoord.xy);
    // texturePixel.rg=norm(texturePixel.rg);


    // texturePixel.rg=texturePixel.rg;
    gl_FragColor=texturePixel;



    // gl_FragColor=vec4(vec3(dist),1.);
}
