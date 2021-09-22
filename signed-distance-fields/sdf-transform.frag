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

float rectangle2(vec2 frag_coord, vec2 size) {
    vec2 componentDistance = abs(frag_coord) - size;
    float outside = length(max(componentDistance, 0.0));
    return outside;
}


vec3 annotated(){
    //see previous explanations
    vec2 coord_N = gl_FragCoord.xy / u_resolution.x;

    vec2 rect_coord = coord_N;
    //gets the x and y distance of the pixel from the x and y of the center
    //changing the center changes the origin of the rectangle
    float center_y=u_resolution.y/(2. * u_resolution.x);
    rect_coord -= vec2(0.5, center_y);
    //rotates the vectors according to the time
    rect_coord = rotate(rect_coord, u_time);
    
    //still not entirely sure why this does what it does
    rect_coord -= vec2(0.0, 0.3);
    //this just applies another rotation
    rect_coord = rotate(rect_coord, u_time * -5.0);
    //scales the vector proportionally in accordance with the time
    rect_coord *= 1.0 + sin(u_time);
    
    float rect_sdf = rectangle2(rect_coord, vec2(0.1, 0.2));
    //we want it to be white if it's more than 0
    float gray = 1.- step(rect_sdf,0.0);

    return vec3(gray);
}

vec3 noScaling(){
    vec2 coord_N = gl_FragCoord.xy / u_resolution.x;
    
    vec2 rect_coord = coord_N;
    float center_y=u_resolution.y/(2. * u_resolution.x);
    rect_coord -= vec2(0.5, center_y);
    rect_coord = rotate(rect_coord, u_time);
    rect_coord -= vec2(0.0, 0.3);
    rect_coord = rotate(rect_coord, u_time * -5.0);
    // rect_coord *= 1.0 + sin(u_time);
    
    float rect_sdf = rectangle2(rect_coord, vec2(0.1, 0.2));
    //we want it to be white if it's more than 0
    float gray = 1.- step(rect_sdf,0.0);

    return vec3(gray);
}

vec3 noRotate(){
    vec2 coord_N = gl_FragCoord.xy / u_resolution.x;
    
    vec2 rect_coord = coord_N;
    float center_y=u_resolution.y/(2. * u_resolution.x);
    rect_coord -= vec2(0.5, center_y);
    rect_coord = rotate(rect_coord, u_time);
    rect_coord -= vec2(0.0, 0.3);
    rect_coord = rotate(rect_coord, u_time * -1.);
    
    float rect_sdf = rectangle2(rect_coord, vec2(0.1, 0.2));
    //we want it to be white if it's more than 0
    float gray = 1.- step(rect_sdf,0.0);

    return vec3(gray);
}

void main() {
    vec3 rgb;
    rgb=annotated();
    rgb=noScaling();
    rgb=noRotate();
    gl_FragColor = vec4(rgb, 1.0);
}
