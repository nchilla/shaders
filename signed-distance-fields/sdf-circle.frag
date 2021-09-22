precision highp float;

uniform vec2 u_resolution;
uniform float u_time;

float circle(vec2 frag_coord, float radius) {
    
    return length(frag_coord) - radius;
}


vec3 annotated(){
    //gets the current pixel position on a 0-1 scale in proportion to the width
    vec2 coord_N = gl_FragCoord.xy / u_resolution.x;

    float center_y=u_resolution.y/(2. * u_resolution.x);
    
    //gets position relative to the center of the circle
    vec2 circle_coord = coord_N - vec2(0.5, center_y);
    
    //creates a gradient outwards from a circle with a specified radius
    float circle_sdf = circle(circle_coord, 0.3);
    
    return vec3(circle_sdf);
}

vec3 moveUp(){
    vec2 coord_N = gl_FragCoord.xy / u_resolution.x;
    float center_y=u_resolution.y/(4. * u_resolution.x) * 3.;
    vec2 circle_coord = coord_N - vec2(0.5, center_y);
    float circle_sdf = circle(circle_coord, 0.3);
    
    return vec3(circle_sdf);
}

vec3 invert(){
    vec2 coord_N = gl_FragCoord.xy / u_resolution.x;
    float center_y=u_resolution.y/(2. * u_resolution.x);
    vec2 circle_coord = coord_N - vec2(0.5, center_y);
    float circle_sdf = circle(circle_coord, 0.3);
    
    return vec3(1.-circle_sdf);
}

void main() {
    vec3 rgb;
    rgb=annotated();
    rgb=moveUp();
    rgb=invert();
    
    gl_FragColor = vec4(rgb, 1.0);
}
