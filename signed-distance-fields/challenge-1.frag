precision highp float;

uniform vec2 u_resolution;
uniform float u_time;

vec2 rotate(vec2 p, float angle) {
    float sine = sin(angle);
    float cosine = cos(angle);
    return vec2(
        cosine * p.x + sine * p.y,
        cosine * p.y - sine * p.x
    );
}

float rectangle(vec2 frag_coord, vec2 size) {
    vec2 componentDistance = abs(frag_coord) - size;
    float outside = length(max(componentDistance, 0.0));
    float inside = min(max(componentDistance.x, componentDistance.y), 0.0);
    return outside + inside;
}

float circle(vec2 frag_coord, float radius) {
    return length(frag_coord) - radius;
}

vec3 accident(){
    vec2 coord_N = gl_FragCoord.xy / u_resolution.x;
    
    vec2 rect_coord = coord_N;
    float center_y=u_resolution.y/(2. * u_resolution.x);
    rect_coord -= vec2(0.5, center_y);
    // rect_coord = rotate(rect_coord, u_time);
    float rect_sdf = rectangle(rect_coord, vec2(0.1, 0.3));
    
    vec2 circle_coord = coord_N;
    circle_coord = circle_coord - vec2(0.5, center_y);
    circle_coord+=vec2(0.,-0.3);
    float circle_sdf = max(0.,circle(circle_coord, 0.13));
    
    
    float combined_sdf = rect_sdf * circle_sdf;
    
    float fill = step(0.0, combined_sdf);
    
    vec3 c = vec3(fill);

    return c;
}

vec3 generate(){
    vec2 coord_N = gl_FragCoord.xy / u_resolution.x;
    
    vec2 rect_1 = coord_N;
    float center_y=u_resolution.y/(2. * u_resolution.x);
    rect_1 -= vec2(0.5, center_y);
    float rect_1_sdf = rectangle(rect_1, vec2(0.15, 0.2));

    vec2 rect_2 = coord_N;
    rect_2 -= vec2(0.5, center_y);
    rect_2 +=vec2(0.,0.15);
    float rect_2_sdf = rectangle(rect_2, vec2(0.1, 0.1));
    
    vec2 circle_coord = coord_N;
    circle_coord = circle_coord - vec2(0.5, center_y);
    circle_coord+=vec2(0.,-0.29);
    float circle_sdf = circle(circle_coord, 0.12);
    
    
    float combined_sdf = min(min(rect_1_sdf, circle_sdf),rect_2_sdf);
    
    float fill = step(0.0, combined_sdf);
    
    vec3 c = vec3(fill);

    return c;
}


void main() {
    vec3 rgb;
    rgb=generate();
    gl_FragColor = vec4(rgb, 1.0);
}
