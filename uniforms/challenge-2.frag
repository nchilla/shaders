precision highp float;

uniform vec2 u_resolution;

float clampStep(float edge1,float edge2,float val){
    float a=step(edge1,val);
    float b=step(edge2,val);
    return mod(a+b,2.);
}

vec3 circles(){
    vec2 coord_N = gl_FragCoord.xy / u_resolution.x;
    
    float d = distance(vec2(0.4, 0.5), coord_N);
    float outline=clampStep(0.2,0.21,d);
    float d2 = distance(vec2(0.6, 0.5), coord_N);
    float outline2=clampStep(0.2,0.21,d2);
    vec3 out_color = vec3(0.0, 0.0, 0.0);
    
    float circle1=step(d, 0.2);
    float circle2=step(d2, 0.2);
    circle1=mix(circle1,0.,outline2);
    circle2=mix(circle2,0.,outline);

    out_color.rg = vec2(circle1);
    out_color.gb = vec2(circle2);

    return out_color;
}



void main() {
    vec3 rgb=circles();
    
    gl_FragColor = vec4(rgb,1.);
}
