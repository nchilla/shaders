
precision highp float;


// uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform vec2 u_resolution;
varying highp vec2 v_texture_coord;
uniform sampler2D u_sampler;




void main(){
    // vec2 mapped_coord=v_texture_coord;
    vec2 mapped_coord=gl_FragCoord.xy;
    mapped_coord-=u_resolution/2.;
    float scale=500.;
    float img_width=500.;
    float img_height=500.;
    mapped_coord+=vec2(img_width/2.,img_height/2.);
    mapped_coord = mapped_coord/scale;
    mapped_coord.y=mapped_coord.y;

    gl_FragColor=texture2D(u_sampler,mapped_coord);
}
