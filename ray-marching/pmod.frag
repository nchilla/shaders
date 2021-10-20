precision lowp float;

const int steps =  64;
const float smallNumber=0.001;
const float maxDist=10.;

uniform float u_time;
uniform vec2 u_resolution;

vec3 pMod3(inout vec3 p, vec3 size) {
	vec3 c = floor((p + size*0.5)/size);
	p = mod(p + size*0.5, size) - size*0.5;
	return c;
}


float scene(vec3 position){
    vec3 editPos=vec3(position.x+ sin(u_time),position.y + 1.2,position.z);
    pMod3(editPos,vec3(4.));
    
    float sphere=length(editPos) - 01.;
    float ground=position.y + sin(position.x*5.)/5. + 3.
        +cos(position.z * 5.)/5.;
    // float ground=position.y + sin(position.x*5.)/2. + 3.
    // +cos(position.z * 5.)/1.;
    
    
    // return sphere;
    
    return min(ground,sphere);
}


 vec3 cosPalette( float t , vec3 brightness, vec3 contrast, vec3 osc, vec3 phase){
    return brightness + contrast*cos( 6.28318*(osc*t+phase) );
}

vec3 estimateNormal(vec3 p) {
    // define your own small number here or at the top
    // im just not doing it here because in my workshop
    // i have it as a const global.
    vec3 n = vec3(
        scene(vec3(p.x + smallNumber, p.yz)) - 
        scene(vec3(p.x - smallNumber, p.yz)),
        scene(vec3(p.x, p.y + smallNumber, p.z)) - 
        scene(vec3(p.x, p.y - smallNumber, p.z)),
        scene(vec3(p.xy, p.z + smallNumber)) - 
        scene(vec3(p.xy, p.z - smallNumber))
    );
    return normalize(n);
}


vec4 march(vec3 origin, vec3 dir){
    float dist = 0.;
    float totalDist=0.;
    vec3 positionOnRay=origin;
    
    for(int i =0; i < steps ;i++){
        
        dist=scene(positionOnRay);
        // dist=length(positionOnRay) - 01.5;
        positionOnRay += dist*dir;
        totalDist+=dist;
        
        if(dist < smallNumber){
            vec3 brightness=vec3(0.3,0.3,0.3);
            vec3 contrast=vec3(0.4,0.4,0.5);
            vec3 phase=vec3(0.3,0.7,0.4);
            vec3 osc=vec3(0.2,0.2,0.2);
            vec3 color = cosPalette(positionOnRay.z/10.+u_time, brightness,contrast,osc,phase);
            // vec3 color=estimateNormal(positionOnRay);
            vec3 norm=estimateNormal(positionOnRay);
            
            // return pMod3(positionOnRay,osc);
            
            return vec4(color*norm,1.);
            // return vec4(1.-totalDist/maxDist);
        }
    }
    return vec4(0.);
}




void main () {
    vec2 pos = gl_FragCoord.xy/u_resolution.x;
   
    pos=(pos-0.5)*2.;
    //  pox.x=pos.x * u_resolution.x/u_resolution.y;
    // pos.y=pos.y + 0.25;
    vec3 camOrigin=vec3(0.,0.,-5.);
    vec3 rayOrigin=vec3(pos + camOrigin.xy,camOrigin.z + 1.);
    vec3 dir=normalize(rayOrigin - camOrigin);
    
    
    
    vec4 color=vec4(vec3(march(rayOrigin, dir)),1.);
    
    gl_FragColor=color;
// 	gl_FragColor = vec4(abs(pos),1., 1.0);
}