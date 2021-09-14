precision highp float;

uniform vec2 u_resolution;

float checkers(){
    float x = floor(gl_FragCoord.x / 50.0);
    float y = floor(gl_FragCoord.y / 50.0);
    
    float mask = mod(x + y, 2.0);
    float light = 1.0 - gl_FragCoord.y / (u_resolution.y * 2.);
    float dark = 0.5 - gl_FragCoord.y / (u_resolution.y * 2.);
   

    float g = mix(dark, light, mask);

    return g;
}

vec3 stickerComposite(){
    float d = distance(u_resolution/2., gl_FragCoord.xy);
    float background = checkers();
    
    float foreground = gl_FragCoord.x / u_resolution.x + (gl_FragCoord.y - u_resolution.y/2.) / 200.0;
    foreground = 1.0 - abs(foreground - 0.5) * 2.0;
    foreground = clamp(foreground, 0.0, 1.0);
    foreground = pow(foreground, 4.0);
    
    float g = mix(foreground, background, step(200.0, d));

    return vec3(g,g,g);
}



void main() {
    vec3 rgb;
    rgb=stickerComposite();
    
    gl_FragColor = vec4(rgb, 1.0);
}
