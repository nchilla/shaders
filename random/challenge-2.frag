// precision mediump float;
precision highp float;

float rand(vec2 co) {
    return fract(sin(dot(co.xy , vec2(12.9898, 78.233))) * 43758.5453);
}

float dotPos(vec2 cstep, vec2 coord, float incr,float size){
    vec2 offset = vec2(
        rand(cstep),
        rand(cstep + 1.0)
    );
    float d = distance(vec2(0.5, 0.5) - offset * 0.7, coord);
    d=incr*d;
    float g = step(size, d);
    

    return g;
}

float circle(vec2 i,vec2 f, float incr,float size){
    vec2 offset=vec2(
        rand(i),
        rand(i+4.)
    );
    // offset*=0.5;
    float jscale=0.8;
    vec2 jitter=jscale/2. - offset * jscale;
    float d=distance(vec2(0.5) + jitter,f);
    float fill=step(0.4,d);

    return fill;
}

vec3 noWizardry(){
    float incr= 120.0;
    vec2 i = floor(gl_FragCoord.xy / vec2(incr, incr));
    vec2 f = fract(gl_FragCoord.xy / vec2(incr, incr));
    float g=dotPos(i,f,incr,50.);

    return vec3(1.-g,0.,1.);
    
}

vec3 touchingly(){
    float incr= 120.0;
    vec2 i = floor(gl_FragCoord.xy / vec2(incr, incr));
    vec2 f = fract(gl_FragCoord.xy / vec2(incr, incr));
    float g=dotPos(i,f,incr,50.);

    vec2 i_t = vec2(i.x, i.y + 1.);
    vec2 f_t = vec2(f.x, f.y - 1.);
    // f_t = vec2(f.x, f.y);
    // f_t = vec2(f.x, pow(f.y - 1.,2.));
    float g_t=dotPos(i_t,f_t,incr,50.);

    // g=circle(i,f,incr,50.);
    // g_t=circle(i_t,f_t,incr,50.);
    
    // return vec3(f.x*f.y);
    return vec3(1.-g,1.-g_t,1.);
    
}

vec3 wat(){
    float incr= 120.0;
    float size=30.;
    vec2 i = floor(gl_FragCoord.xy / vec2(incr, incr));
    vec2 f = fract(gl_FragCoord.xy / vec2(incr, incr));

    vec2 up=vec2(0.,1.);
    vec2 down=vec2(0.,-1.);
    vec2 l=vec2(-1.,0.);
    vec2 r=vec2(1.,0.);
    vec2 l_up=vec2(-1.,1.);
    vec2 r_up=vec2(1.,1.);
    vec2 l_down=vec2(-1.,-1.);
    vec2 r_down=vec2(1.,-1.);

    float g = dotPos(i,f,incr,size);
    float g_1 = dotPos(i + up,f - up,incr,size);
    float g_2 = dotPos(i + down,f - down,incr,size);
    float g_3 = dotPos(i + l,f - l,incr,size);
    float g_4 = dotPos(i + r,f - r,incr,size);
    float g_5 = dotPos(i + l_up,f - l_up,incr,size);
    float g_6 = dotPos(i + r_up,f - r_up,incr,size);
    float g_7 = dotPos(i + l_up,f - l_up,incr,size);
    float g_8 = dotPos(i + r_down,f - r_down,incr,size);

    return vec3(g*g_1*g_2*g_3*g_4*g_5*g_6*g_7*g_8);

    
}






void main() {
    vec3 rgb;
    rgb=noWizardry();
    rgb=touchingly();
    rgb=wat();
    
    
    gl_FragColor = vec4(rgb, 1.0);
}
