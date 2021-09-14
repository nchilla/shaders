precision highp float;

uniform vec2 u_resolution;


vec3 basic(){
    float s1 = sin((gl_FragCoord.x + 60.) / 45.0) * 30.0;
    float s2 = sin((gl_FragCoord.x + 60.) / 90.0) * 50.0;
    float layer1 = step(u_resolution.y/2.7, gl_FragCoord.y + s1);
    float layer2 = step(u_resolution.y/3., gl_FragCoord.y + s2);
    layer1+=0.2;
    
    
    float sky = 1.0 - gl_FragCoord.y / u_resolution.y;
    float g = min(layer1, sky);
    g=min(layer2, g);
    return vec3(g,g,g);
}

void main(){
    vec3 rgb;
    rgb=basic();
    gl_FragColor = vec4(rgb, 1.0);
}