precision highp float;

uniform vec2 u_resolution;
uniform float u_time;

float rectangleQuick(vec2 frag_coord, vec2 size) {\
    //gets the respective x and y distance of the coordinate (dist from rectangle center) from the rectangle edge
    vec2 componentDistance = abs(frag_coord) - size;
    //x and y will be values between 0 and 1 if beyond than the rect, and negative (black) if inside it. Then we simply pick the higher one. 
    return max(componentDistance.x, componentDistance.y);
}

float rectangle(vec2 frag_coord, vec2 size) {
    //gets the respective x and y distance of the coordinate (dist from rectangle center) from the rectangle edge
    vec2 componentDistance = abs(frag_coord) - size;
    
    //if either x or y are outside the rectangle (negative), this returns their distance from the center
    //otherwise it returns 0
    float outside = length(max(componentDistance, 0.0));
    
    //this line doesn't seem to actually have any impact if I remove it from the return
    
    float inside = min(max(componentDistance.x, componentDistance.y), 0.0);

    //if x or y or both are positive (outside), this should return 0
    //if both are negative (inside), it returns the greater negative value
    //the outside float should return 0 in this area
    
    return outside;
    // return inside + outside;
}

vec3 annotatedReturn(){
    //gets the current pixel position on a 0-1 scale in proportion to the width
    vec2 coord_N = gl_FragCoord.xy / u_resolution.x;
    float center_y=u_resolution.y/(2. * u_resolution.x);
	//gets position relative to the center of the rectangle
    vec2 rect_coord = coord_N - vec2(0.5, center_y);
    float rect_sdf = rectangle(rect_coord, vec2(0.1, 0.2));
    return vec3(rect_sdf);
}

vec3 wideAndShort(){
    vec2 coord_N = gl_FragCoord.xy / u_resolution.x;
    float center_y=u_resolution.y/(2. * u_resolution.x);
    vec2 rect_coord = coord_N - vec2(0.5, center_y);
    float rect_sdf = rectangle(rect_coord, vec2(0.3, 0.01));
    return vec3(rect_sdf);
}

vec3 alignToBottom(){
    vec2 coord_N = gl_FragCoord.xy / u_resolution.x;
    float center_y= 0.2;
    vec2 rect_coord = coord_N - vec2(0.5, center_y);
    float rect_sdf = rectangle(rect_coord, vec2(0.1, 0.2));
    return vec3(rect_sdf);
}

void main() {
    vec3 rgb;
    rgb=annotatedReturn();
    rgb=wideAndShort();
    rgb=alignToBottom();
    gl_FragColor = vec4(rgb, 1.0);
}
