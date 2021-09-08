precision highp float;

vec3 basic(){
    float y = gl_FragCoord.y;

    float frequency=1.;
    float frequency2=3.2;
    float wavelength=30.0/frequency;
    float wavelength2=20.0/frequency2;
    float amplitude=20.;
    float amplitude2=8.;

    y += sin(gl_FragCoord.x / wavelength) * amplitude;
    y += sin(gl_FragCoord.x / wavelength2) * amplitude2;
    
    float gapWidth=70.0;
    float fillWidth=25.;
    float g = step(fillWidth, mod(y, gapWidth));
    return vec3(g,g,g);
}

void main() {
    vec3 rgb;
    rgb=basic();
    gl_FragColor = vec4(rgb, 1.0);
}