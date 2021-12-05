
precision highp float;


// uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform vec2 u_resolution;
varying highp vec2 v_texture_coord;
uniform sampler2D u_sampler;
uniform float u_time;
uniform float u_pass;

vec2 img_size=u_resolution;


vec2 norm(vec2 coord){
  vec2 uv =(coord.xy-0.5) / img_size.xy;
  return uv;
}





void main(){

    vec2 mapped_coord=norm(gl_FragCoord.xy);
    vec4 texturePixel=texture2D(u_sampler,mapped_coord);
    // float dist=length(texturePixel.rg-mapped_coord)*20.;



    float dist=length((texturePixel.rg*img_size)-gl_FragCoord.xy)/200.;

    // float fill=dist-u_time*0.1;
    float fill=dist;
    fill= mod(fill, 0.1) * 10.0;
    fill = step(0.1, fill);
    gl_FragColor=vec4(vec3(fill),1.);



    // gl_FragColor=texturePixel;




}
