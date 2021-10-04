precision highp float;

uniform vec2 u_resolution;
uniform float u_time;



float circle(vec2 frag_coord, float radius) {
    return max(length(frag_coord) - radius,0.);
}



vec3 generate(){
    vec2 coord_N = gl_FragCoord.xy / u_resolution.x;
    float center_y=u_resolution.y/(2. * u_resolution.x);

    
    vec2 circle_1 = coord_N;
    circle_1 = circle_1 - vec2(0.4, center_y - 0.15);
    float circle_1_sdf = circle(circle_1, 0.2);

    vec2 circle_2 = coord_N;
    circle_2 = circle_2 - vec2(0.7, center_y + 0.15);
    float circle_2_sdf = circle(circle_2, 0.1);
    
    float combined_sdf =min(circle_1_sdf,circle_2_sdf);
    float fill = combined_sdf * 3.;
    fill= mod(fill, 0.1) * 10.0;
    fill = step(0.1, fill);
    
    vec3 c = vec3(fill);

    return c;
}


void main() {
    vec3 rgb;
    rgb=generate();
    gl_FragColor = vec4(rgb, 1.0);
}
