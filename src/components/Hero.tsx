import { Button } from "@/components/ui/button";
import { ArrowDown } from "lucide-react";
import { useVFXShader } from "@/hooks/useVFXShader";

const glowShader = `
precision highp float;
uniform vec2 resolution;
uniform vec2 offset;
uniform vec2 mouse;
uniform float time;
uniform sampler2D src;

#define PI 3.141593
#define SAMPLES 48.

float hash(vec2 p) {
  return fract(sin(dot(p, vec2(489., 589.))) * 492.) * 2. - 1.;
}
float hash(vec3 p) {
  return fract(sin(dot(p, vec3(489., 589., 58.))) * 492.) * 2. - 1.;
}
vec2 hash2(vec3 p) {
  return vec2(hash(p), hash(p + 1.));
}
vec4 readTex(vec2 uv) {
  if (uv.x < 0. || uv.x > 1. || uv.y < 0. || uv.y > 1.) { return vec4(0); }
  return texture2D(src, uv);
}
vec3 spectrum(float x) {
    return cos((x - vec3(0, .5, 1)) * vec3(.6, 1., .5) * PI);
}

void main() {
  vec2 uv = (gl_FragCoord.xy - offset) / resolution;  
  if (readTex(uv).r > 0.) { discard; }
  
  vec2 p = uv * 2. - 1.;
  p.x *= resolution.x / resolution.y;
  
  vec2 mp = (mouse - offset) / resolution;
  mp = mp * 2. - 1.;
  mp.x *= resolution.x / resolution.y;
  
  vec2 rp = p;
  vec2 d = (mp - p) / SAMPLES;
  float acc = 0.;
  
  for (float i = 0.; i < SAMPLES; i++) {
    rp += d;
    rp += hash2(vec3(rp, i)) * 0.5 / SAMPLES;
    
    vec2 uv2 = rp;
    uv2.x /= resolution.x / resolution.y;
    uv2 = uv2 * 0.5 + 0.5;    
    acc += readTex(uv2).r / SAMPLES;
  }

  float lm = length(p - mp);
  vec4 c = vec4(smoothstep(0., 1., pow(.1 / lm, .2)));
  
  c -= acc;
  c += vec4((spectrum(cos(acc * 3.5))), 1) * acc * 2.5;
  
  c -= hash(vec3(uv.xyy)) * 0.01;
  gl_FragColor = c;  
}
`;

const Hero = () => {
  const h1Ref = useVFXShader(glowShader);
  return <section className="relative min-h-screen flex items-center justify-center overflow-hidden py-40 lg:py-56">
      <div className="container mx-auto px-6 lg:px-12 relative z-10 max-w-5xl">
        <div className="flex flex-col items-center space-y-12 md:space-y-16 animate-fade-in-slow text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-3 px-6 py-2 minimal-border bg-card/10 backdrop-blur-sm mx-auto" style={{ animationDelay: "0.2s" }}>
            <span className="text-[10px] md:text-xs tracking-[0.3em] uppercase text-muted-foreground font-light">
              Metodo Esoterico & Magico-Pratico
            </span>
          </div>

          {/* Title - Monumental Typography with VFX Shader */}
          <h1 
            ref={h1Ref}
            className="font-display font-bold leading-[0.9] tracking-tighter text-[clamp(4rem,10vw,10rem)]" 
            style={{ animationDelay: "0.4s" }}
          >
            TAROCCHI
            <br />
            <span className="text-accent-gradient">PER</span>
            <br />
            ILLUMINARSI
          </h1>

          {/* Subtitle */}
          <p className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-2xl mx-auto font-light" style={{ animationDelay: "0.6s" }}>
            Non semplice divinazione, ma un viaggio profondo verso la{" "}
            <span className="text-accent font-medium">Saggezza</span> attraverso
            13 anni di pratica magica e studio esoterico approfondito.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 pt-4 justify-center" style={{ animationDelay: "0.8s" }}>
            <Button size="lg" variant="default" className="group">
              Inizia il Percorso
              <ArrowDown className="w-4 h-4 ml-2 group-hover:translate-y-1 transition-transform" />
            </Button>
            <Button size="lg" variant="outline" className="elegant-underline">
              Scopri il Metodo
            </Button>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 animate-fade-in" style={{
        animationDelay: "1.2s"
      }}>
          <div className="flex flex-col items-center gap-2 text-muted-foreground">
            <span className="text-xs tracking-widest uppercase font-light">Scorri</span>
            <ArrowDown className="w-4 h-4 animate-bounce" />
          </div>
        </div>
      </div>
    </section>;
};
export default Hero;