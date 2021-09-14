precision highp float;

uniform vec2 u_resolution;
uniform vec2 u_mouse;

void main() {
    vec2 coord_N = gl_FragCoord.xy / u_resolution;
    coord_N.y /= u_resolution.x / u_resolution.y;
    vec2 mouse = u_mouse / u_resolution;
    
    float d = distance(vec2(0.4, 0.5), coord_N);
    float d2 = distance(vec2(0.6, 0.5), coord_N);
    float d3 = distance(vec2(0.5, 0.7), coord_N);
    vec4 out_color = vec4(0.0, 0.0, 0.0, 1.0);
    out_color.r = step(d, 0.2);
    out_color.g= step(d2, 0.2);
    out_color.b= step(d3, 0.2);
    gl_FragColor = out_color;
}
