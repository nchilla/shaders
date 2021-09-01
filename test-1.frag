#ifdef GL_ES
precision mediump float;
#endif

uniform float u_time;
uniform vec2 u_mouse;
uniform vec2 u_resolution;

void main() {
    float inputX = gl_FragCoord.x/u_resolution.x;
    float inputY = gl_FragCoord.y/u_resolution.y;
    float xMapped=u_mouse.x/u_resolution.x;
    float yMapped=u_mouse.y/u_resolution.y;
    gl_FragColor=vec4(
        xMapped,
        yMapped,
        abs(sin(inputX/inputY)),
        1.);
	// gl_FragColor = vec4(abs(sin(u_time)),0.0,0.0,1.0);
}

