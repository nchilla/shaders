precision highp float;
uniform vec2 u_resolution;
vec2 center=u_resolution.xy/2.;


vec3 basic(){
    float d = distance(center, gl_FragCoord.xy);
    //if it's less than 100, you get 1
    float disc = step(100.0, d);
    // disc=abs(disc-1.);
    
    //if d is less than 100, return 0
    //if d is more than 100, return 1
    
    
    //if the x coordinate of the page is less than 300, make black, otherwise white
    float side = step(center.x, gl_FragCoord.x);
    //if x is less than 300, return 0
    //if x is more than 300, return 1
    
    
    float g = min(disc, side);
    return vec3(g,g,g);
}

vec3 cutout(){
    float d = distance(center, gl_FragCoord.xy);
    float disc = step(100.0, d);
    disc = 1. - disc;

    float side = step(center.x, gl_FragCoord.x);
    
    float g = max(disc, side);
    
    return vec3(g,g,g);
}



void main() {
    vec3 rgb;
    rgb=basic();
    rgb=cutout();
    
    gl_FragColor = vec4(rgb, 1.0);
}
