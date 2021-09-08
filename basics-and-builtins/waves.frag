precision highp float;

vec3 basic(){
    float y = gl_FragCoord.y;
    float frequency=1.;
    float wavelength=10.0/frequency;
    float amplitude=10.;
    
    //this gives us a max y for the wave at a particular x point
    y += sin(gl_FragCoord.x / wavelength) * amplitude;
    
    //here's our typical striping.
    float gapWidth=50.0;
    float fillWidth=20.;
    //the mod goes from 0 to 1
    float g = step(fillWidth, mod(y, gapWidth));
    return vec3(g,g,g);
}

vec3 frequency(){
    float y = gl_FragCoord.y;
    float frequency=2.;
    float wavelength=10.0/frequency;
    float amplitude=10.;
    y += sin(gl_FragCoord.x / wavelength) * amplitude;
    float gapWidth=50.0;
    float fillWidth=20.;
    float g = step(fillWidth, mod(y, gapWidth));
    return vec3(g,g,g);
}

vec3 amplitude(){
    float y = gl_FragCoord.y;
    float frequency=1.;
    float wavelength=10.0/frequency;
    float amplitude=30.;
    y += sin(gl_FragCoord.x / wavelength) * amplitude;
    float gapWidth=50.0;
    float fillWidth=20.;
    float g = step(fillWidth, mod(y, gapWidth));
    return vec3(g,g,g);
}



void main() {
    vec3 rgb;
    rgb=basic();
    rgb=frequency();
    rgb=amplitude();
    gl_FragColor = vec4(rgb, 1.0);
}