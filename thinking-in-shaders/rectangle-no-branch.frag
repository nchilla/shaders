#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;

void main() {
    vec4 rectangle1 = vec4(0,100,0,100);
	vec4 rectangle2 = vec4(100,200,100,200);

   
    float left1 = step(rectangle1.x, gl_FragCoord.x); 
    float top1 = step(rectangle1.z, gl_FragCoord.y);  
    float right1 = step(gl_FragCoord.x, rectangle1.y);
    float bottom1 = step(gl_FragCoord.y, rectangle1.w);  
    float left2 = step(rectangle2.x, gl_FragCoord.x); 
    float top2 = step(rectangle2.z, gl_FragCoord.y);  
    float right2 = step(gl_FragCoord.x, rectangle2.y);
    float bottom2 = step(gl_FragCoord.y, rectangle2.w); 
    float inRect = left1*top1*right1*bottom1; 
    float inRect2 = left2*top2*right2*bottom2;
    vec3 color1 = mix(vec3(1.0, 1.0, 1.0), vec3(0.0, 0.0, 1.0), inRect);
    vec3 color = mix(color1,vec3(0.276,0.500,0.004),  inRect2);

	gl_FragColor = vec4(color,1);
}
