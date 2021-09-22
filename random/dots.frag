precision highp float;

float rand(vec2 co) {
    return fract(sin(dot(co.xy , vec2(12.9898, 78.233))) * 43758.5453);
}

vec3 basic(){
    vec2 i = floor(gl_FragCoord.xy / vec2(50.0, 50.0));
    vec2 f = fract(gl_FragCoord.xy / vec2(50.0, 50.0));
    
    vec2 offset = vec2(
        rand(i),
        rand(i + 1.0)
    );
    
    float d = distance(vec2(0.5, 0.5), f + offset * 0.3);
    float g = step(0.2, d);
    return vec3(g);
}


vec3 randomSizes(){
    vec2 i = floor(gl_FragCoord.xy / vec2(50.0, 50.0));
    vec2 f = fract(gl_FragCoord.xy / vec2(50.0, 50.0));
    
    vec2 offset = vec2(
        rand(i),
        rand(i + 1.0)
    );
    
    float d = distance(vec2(0.5, 0.5), f + offset * 0.3);
    float g = step(rand(i)*0.2, d);
    return vec3(g);
}

vec3 randomColors(){
    vec2 i = floor(gl_FragCoord.xy / vec2(50.0, 50.0));
    vec2 f = fract(gl_FragCoord.xy / vec2(50.0, 50.0));
    
    vec2 offset = vec2(
        rand(i),
        rand(i + 1.0)
    );

    vec3 color=vec3(
        rand(i),
        rand(i + 0.1),
        rand(i + 0.2)
    );
    
    float d = distance(vec2(0.5, 0.5), f + offset * 0.3);
    float x = step(rand(i)*0.2, d);
    color=mix(color,vec3(1.,1.,1.),x);
    return color;
}

void main() {
    vec3 rgb;
    rgb=basic();
    rgb=randomSizes();
    rgb=randomColors();
    
    gl_FragColor = vec4(rgb, 1.0);
    // gl_FragColor = vec4(random,random,random, 1.0);
}
