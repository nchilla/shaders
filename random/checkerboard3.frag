precision highp float;

float rand(vec2 co) {
    return fract(sin(dot(co.xy , vec2(12.9898, 78.233))) * 43758.5453);
}

vec3 basic(){
    vec2 i = floor(gl_FragCoord.xy / vec2(50.0, 50.0));
    vec2 f = fract(gl_FragCoord.xy / vec2(50.0, 50.0));
    
    vec3 color = vec3(
        rand(i + 0.1),
        rand(i + 0.2),
        rand(i + 0.3)
    );
    
    return color;

}

vec3 grey(){
    vec2 i = floor(gl_FragCoord.xy / vec2(50.0, 50.0));
    
     vec3 color = vec3(
        rand(i),
        rand(i),
        rand(i)
    );
    
    return color;

}

vec3 stripes(){
    vec2 i = floor(gl_FragCoord.x / vec2(50.0, 50.0));
    
     vec3 color = vec3(
        rand(i + 0.1),
        rand(i + 0.2),
        rand(i + 0.3)
    );
    
    return color;

}

void main() {
    vec3 rgb;
    rgb=basic();
    rgb=grey();
    rgb=stripes();

    
    gl_FragColor = vec4(rgb, 1.0);
}
