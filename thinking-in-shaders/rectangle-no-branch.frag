#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;

void main() {
   vec4 rectangle1 = vec4(0,100,0,100);
	vec4 rectangle2 = vec4(100,200,100,200);
    
    vec3 color;
    if (rectangle1.x < gl_FragCoord.x &&
        rectangle1.z < gl_FragCoord.y &&
        gl_FragCoord.x < rectangle1.y &&
        gl_FragCoord.y < rectangle1.w)
    {
        color = vec3(0.,0.,1.000);
    } else if(rectangle2.x < gl_FragCoord.x &&
        rectangle2.z < gl_FragCoord.y &&
        gl_FragCoord.x < rectangle2.y &&
        gl_FragCoord.y < rectangle2.w){
        color = vec3(1.000,0.471,0.228);
    }else {
        color = vec3(1.0, 1.0, 1.0);
    }
	gl_FragColor = vec4(color,1);
}
