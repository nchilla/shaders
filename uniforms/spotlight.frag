precision highp float;

uniform vec2 u_resolution;
uniform vec2 u_mouse;

vec3 pattern(vec2 p) {
    //this function is fed the x and y coordinates of the page
    //it gets the remainder of x and y...
    // respectively multiplied by 10 and divided by 1 (so always a number between 0 and 1)
    //that loops over and over as you move across the canvas
    p = mod(p * 10.0, 1.);
    return vec3(p.x, p.y, 0.0);
}

vec3 dimPattern(vec2 p) {
    p = mod(p * 10.0, 1.) / 2.;
    return vec3(p.x, p.y, 0.0);
}

vec3 annotated(){
    //this divides the pixel x/y coordinates by the width of the canvas
    //Justin was doing it in a roundabout way that was sort of confusing but this does the same thing
    //namely, scales everything on a 1:1 ratio, so it adapts to the width but not the height of the canvas
    //the x goes from 0 to 1, the y goes up from 0 at the same rate until it reaches the bottom of the canvas
    vec2 coord_N = gl_FragCoord.xy / u_resolution.x;
    
    //again I simplified it, but this gets the coordinate of the mouse on the same scale
    vec2 mouse_N = u_mouse / u_resolution.x;

    
    vec3 black = vec3(0.0, 0.0, 0.0);
    
    //this is the distance of the current scaled coordinate from the scaled coordinate of the mouse
    float d = distance(mouse_N , coord_N);

    //if the distance is less than radius 0.2, use the pattern color, otherwise black.
    return mix(pattern(coord_N), black, step(0.2, d));
}

vec3 softEdge(){
    vec2 coord_N = gl_FragCoord.xy / u_resolution.x;
    vec2 mouse_N = u_mouse / u_resolution.x;
    vec3 black = vec3(0.0, 0.0, 0.0);
    float d = distance(mouse_N , coord_N);
    return mix(pattern(coord_N), black, smoothstep(0.1,0.3, d));
}


vec3 dimVersion(){
    vec2 coord_N = gl_FragCoord.xy / u_resolution.x;
    vec2 mouse_N = u_mouse / u_resolution.x;
    vec3 black = vec3(0.0, 0.0, 0.0);
    float d = distance(mouse_N , coord_N);
    return mix(dimPattern(coord_N), black, smoothstep(0.1,0.3, d));
}


void main() {
    vec3 rgb;
    rgb=annotated();
    rgb=softEdge();
    rgb=dimVersion();

    gl_FragColor=vec4(rgb,1.);
}
