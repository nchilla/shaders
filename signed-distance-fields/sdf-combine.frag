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

vec3 annotated(){
    vec2 coord_N = gl_FragCoord.xy / u_resolution.x;
    
    //making rect sdf
    vec2 rect_coord = coord_N;
    float center_y=u_resolution.y/(2. * u_resolution.x);
    rect_coord -= vec2(0.5, center_y);
    rect_coord = rotate(rect_coord, u_time);
    float rect_sdf = rectangle(rect_coord, vec2(0.1, 0.3));
    
    //making circle sd4
    vec2 circle_coord = coord_N;
    circle_coord = circle_coord - vec2(0.5, center_y);
    float circle_sdf = circle(circle_coord, 0.2);
    
    //only shows black in areas where both are <0
    //min combines instead of intersecting
    float combined_sdf = max(rect_sdf, circle_sdf);
    
    float fill = step(0.0, combined_sdf);
    //in the inside, the point gets more and more negative
    //this is used with a step to mark off a stroke
    float stroke = step(-0.01, combined_sdf) - step(0.0, combined_sdf);
    
    vec3 c = vec3(fill);
    c.r += stroke;

    return c;
}

vec3 min(){
    vec2 coord_N = gl_FragCoord.xy / u_resolution.x;
    
    vec2 rect_coord = coord_N;
    float center_y=u_resolution.y/(2. * u_resolution.x);
    rect_coord -= vec2(0.5, center_y);
    rect_coord = rotate(rect_coord, u_time);
    float rect_sdf = rectangle(rect_coord, vec2(0.1, 0.3));
    
    vec2 circle_coord = coord_N;
    circle_coord = circle_coord - vec2(0.5, center_y);
    float circle_sdf = circle(circle_coord, 0.2);
    
    float combined_sdf = min(rect_sdf, circle_sdf);
    
    float fill = step(0.0, combined_sdf);
    float stroke = step(-0.01, combined_sdf) - step(0.0, combined_sdf);
    
    vec3 c = vec3(fill);
    c.r += stroke;

    return c;
}

vec3 circleEnd(){
    vec2 coord_N = gl_FragCoord.xy / u_resolution.x;
    
    vec2 rect_coord = coord_N;
    float center_y=u_resolution.y/(2. * u_resolution.x);
    rect_coord -= vec2(0.5, center_y);
    rect_coord = rotate(rect_coord, u_time);
    float rect_sdf = rectangle(rect_coord, vec2(0.1, 0.3));
    
    vec2 circle_coord = coord_N;
    circle_coord = circle_coord - vec2(0.5, center_y);
    circle_coord = rotate(circle_coord, u_time);
    circle_coord -= vec2(0.0, 0.3);
    float circle_sdf = circle(circle_coord, 0.2);
    
    float combined_sdf = min(rect_sdf, circle_sdf);
    
    float fill = step(0.0, combined_sdf);
    float stroke = step(-0.01, combined_sdf) - step(0.0, combined_sdf);
    
    vec3 c =mix(vec3(1.,0.,0.),vec3(1.,1.,1.),fill);
    c.r -= stroke;

    return c;
}

void main() {
    vec3 rgb;
    rgb=annotated();
    rgb=min();
    rgb=circleEnd();
    gl_FragColor = vec4(rgb, 1.0);
}
