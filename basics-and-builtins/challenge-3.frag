precision highp float;

vec3 wave(){
    float y = gl_FragCoord.y;
    float wavelength=40.0;
    float amplitude=20.;
    y += sin(gl_FragCoord.x / wavelength) * amplitude;
    
    float x = floor(gl_FragCoord.x / 100.0);
    y = floor(y / 50.0);

    float g = mod(x + y, 2.0);

    return vec3(g,g,g);
}


void main() {
    vec3 rgb;
    rgb=wave();
    gl_FragColor = vec4(rgb, 1.0);
}