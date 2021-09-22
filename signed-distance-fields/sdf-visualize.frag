precision highp float;

uniform vec2 u_resolution;
uniform float u_time;

float rectangle(vec2 frag_coord, vec2 size) {
    vec2 componentDistance = abs(frag_coord) - size;
    float outside = length(max(componentDistance, 0.0));
    float inside = min(max(componentDistance.x, componentDistance.y), 0.0);
    return outside + inside;
}

float rectangle2(vec2 frag_coord, vec2 size) {
    vec2 componentDistance = abs(frag_coord) - size;
    float outside = length(max(componentDistance, 0.0));
    return outside;
}


vec3 annotated(){
    //see previous explanations
    vec2 coord_N = gl_FragCoord.xy / u_resolution.x;
    float center_y=u_resolution.y/(2. * u_resolution.x);
    vec2 rect_coord = coord_N - vec2(0.5, center_y);
    float rect_sdf = rectangle(rect_coord, vec2(0.2, 0.25));
    
    //the step returns 1 inside the rectangle an 0 outside
    //which is then applied to the red
    vec3 color = vec3(1.0, 0.0, 0.0) * step(rect_sdf, 0.0);
    
    //this applies a sawtooth function to the gradient progression
    //scales it from 0 to 1 by multiplying by 10 and applies it to the blue
    color.b = mod(rect_sdf, 0.1) * 10.0;
    
    return color;
}

void main() {
    vec3 rgb;
    rgb=annotated();

    gl_FragColor = vec4(rgb, 1.0);
}
