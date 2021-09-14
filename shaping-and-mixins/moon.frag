precision highp float;

uniform vec2 u_resolution;

vec3 annotated(){
    //this is the primary wave
    float s1 = sin(gl_FragCoord.x / 35.0) * 30.0;
    //this is the smaller wave that distorts s1
    float s2 = sin(gl_FragCoord.x / 4.0) * 1.0;
    //this cuts off the high and lowpoints of s1 so you get those flattened portions
    s1 = clamp(s1, - 10.0, 10.0);
    //this 
    // 1. shifts the current pixel's y value up by the corresponding wave value
    // 2. compares that (dynamic) value to the constant 200, and makes the pixel black 
    // ...if the val is smaller, which is y this wave is in a sense inverted
    float moon = step(u_resolution.y/3., gl_FragCoord.y + s1 + s2);
    float sky = 1.4 - gl_FragCoord.y / u_resolution.y;
    float g = min(moon, sky);
    return vec3(g,g,g);
}

vec3 noSmallBumps(){
    float s1 = sin(gl_FragCoord.x / 35.0) * 30.0;
    s1 = clamp(s1, - 10.0, 10.0);
    float moon = step(u_resolution.y/3., gl_FragCoord.y + s1);
    float sky = 1.4 - gl_FragCoord.y / u_resolution.y;
    float g = min(moon, sky);
    return vec3(g,g,g);
}

vec3 horizonUp(){
    float s1 = sin(gl_FragCoord.x / 35.0) * 30.0;
    float s2 = sin(gl_FragCoord.x / 4.0) * 1.0;
    s1 = clamp(s1, - 10.0, 10.0);
    float moon = step(u_resolution.y/2., gl_FragCoord.y + s1 + s2);
    float sky = 1.4 - gl_FragCoord.y / u_resolution.y;
    float g = min(moon, sky);
    return vec3(g,g,g);
}

vec3 brightenSky(){
    float s1 = sin(gl_FragCoord.x / 35.0) * 30.0;
    float s2 = sin(gl_FragCoord.x / 4.0) * 1.0;
    s1 = clamp(s1, - 10.0, 10.0);
    float moon = step(u_resolution.y/3., gl_FragCoord.y + s1 + s2);
    float sky = 1.9 - gl_FragCoord.y / u_resolution.y;
    float g = min(moon, sky);
    return vec3(g,g,g);
}






void main() {
    vec3 rgb;
    rgb=annotated();
    rgb=noSmallBumps();
    rgb=horizonUp();
    rgb=brightenSky();
    
    gl_FragColor = vec4(rgb, 1.0);
}
