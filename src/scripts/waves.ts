/**
 * Campo de líneas del hero, en WebGL.
 *
 * Un solo triángulo que cubre el cuadro y un shader de fragmento que dibuja
 * una cinta de líneas ondulantes en diagonal. No hay librería 3D: para un
 * triángulo y un shader, `ogl` o `three` serían cientos de kB de más.
 *
 * Vive dentro de `.field`, debajo del foco del puntero: así hereda la máscara
 * del campo —que lo disuelve antes de que acabe el hero— y el foco lo enciende
 * por `plus-lighter`, sin una segunda capa que repintar.
 *
 * Reglas de la casa que se respetan aquí:
 *   · No abre su propio bucle: se registra en el rAF compartido (`env.ts`),
 *     que además ya se apaga cuando la pestaña deja de verse.
 *   · Deja de pintar en cuanto el hero sale de pantalla. Es el gasto que hay
 *     que vigilar: aquí el shader cubre una pantalla entera, no una banda.
 *   · En móvil y con «reducir movimiento» ni siquiera se descarga: quien lo
 *     llama (`main.ts`) hace el `import()` sólo en escritorio.
 *
 * Los colores no se escriben aquí: se leen de los tokens, así que recolorear
 * el sitio sigue siendo una edición de `tokens.css`.
 */
import { onTick, lerp, clamp, isDesktop, reduceMotion, finePointer } from './env';

/* --- Mandos --------------------------------------------------------------
   Las coordenadas NO se corrigen por relación de aspecto: el hero es apaisado,
   así que el dibujo sale estirado a lo ancho y la cinta lo cruza en diagonal
   larga en vez de quedarse en un cuadrado en medio.

   `innerLines` / `outerLines` son la densidad de línea; `brightness` compite
   con el titular, que va encima; y `maxDpr` es el mando de coste: aquí el
   shader cubre una pantalla entera, no una banda, y cada décima de DPR son
   millones de píxeles por frame.                                           */
const CFG = {
  speed: 0.3, //            velocidad del oleaje
  innerLines: 24.0, //      densidad de línea en el centro de la cinta
  outerLines: 28.0, //      densidad en los bordes
  warp: 1.0, //             cuánto se retuerce el campo
  rotation: -45, //         grados; la diagonal del original
  edgeFade: 0.0, //         grosor de la cinta antes de disolverse
  cycleSpeed: 0.9, //       velocidad del vaivén de color
  brightness: 0.22, //      subir con cuidado: satura y se come el titular
  mouseInfluence: 2.0, //   fuerza del bulto que sigue al puntero
  ease: 0.05, //            amortiguación del puntero
  maxDpr: 1.25, //          más resolución no se nota y multiplica el coste
} as const;

const VERT = `
attribute vec2 aPos;
void main() { gl_Position = vec4(aPos, 0.0, 1.0); }
`;

const FRAG = `
precision highp float;

uniform float uTime;
uniform vec2  uResolution;
uniform float uSpeed;
uniform float uInnerLines;
uniform float uOuterLines;
uniform float uWarp;
uniform float uRotation;
uniform float uEdgeFade;
uniform float uCycle;
uniform float uBrightness;
uniform vec3  uColor1;
uniform vec3  uColor2;
uniform vec3  uColor3;
uniform vec2  uMouse;
uniform float uMouseInfluence;

#define HALF_PI 1.5707963

float hashF(float n) {
  return fract(sin(n * 127.1) * 43758.5453123);
}

/* Ruido 1D interpolado: da el nervio irregular a la separación de líneas. */
float smoothNoise(float x) {
  float i = floor(x);
  float f = fract(x);
  float u = f * f * (3.0 - 2.0 * f);
  return mix(hashF(i), hashF(i + 1.0), u);
}

/* Dos desplazamientos con frecuencias distintas. Mezclarlos es lo que evita
   que el oleaje se lea como un seno y lo hace parecer vivo. */
float displaceA(float coord, float t) {
  float r = sin(coord * 2.123) * 0.2;
  r += sin(coord * 3.234 + t * 4.345) * 0.1;
  r += sin(coord * 0.589 + t * 0.934) * 0.5;
  return r;
}

float displaceB(float coord, float t) {
  float r = sin(coord * 1.345) * 0.3;
  r += sin(coord * 2.734 + t * 3.345) * 0.2;
  r += sin(coord * 0.189 + t * 0.934) * 0.3;
  return r;
}

vec2 rotate2D(vec2 p, float a) {
  float c = cos(a);
  float s = sin(a);
  return vec2(p.x * c - p.y * s, p.x * s + p.y * c);
}

void main() {
  vec2 coords = gl_FragCoord.xy / uResolution;
  coords = coords * 2.0 - 1.0;
  coords = rotate2D(coords, uRotation);

  float halfT = uTime * uSpeed * 0.5;
  float fullT = uTime * uSpeed;

  /* El puntero abomba el campo. La caída es gaussiana, así que lejos del
     puntero el término se anula solo: no hay que apagarlo a mano. */
  vec2 mPos = rotate2D(uMouse * 2.0 - 1.0, uRotation);
  float mDist = length(coords - mPos);
  float mouseWarp = uMouseInfluence * exp(-mDist * mDist * 4.0);

  vec2 fieldA = vec2(
    coords.x + displaceA(coords.y, halfT) * uWarp + mouseWarp,
    coords.y - displaceA(coords.x * cos(fullT) * 1.235, halfT) * uWarp
  );
  vec2 fieldB = vec2(
    coords.x + displaceB(coords.y, halfT) * uWarp + mouseWarp,
    coords.y - displaceB(coords.x * sin(fullT) * 1.235, halfT) * uWarp
  );
  vec2 blended = mix(fieldA, fieldB, mix(fieldA, fieldB, 0.5));

  /* Máscara vertical: recorta la cinta y la deja disolverse por arriba y por
     abajo, de modo que nunca aparece un canto recto. */
  float fadeTop = smoothstep(uEdgeFade, uEdgeFade + 0.4, blended.y);
  float fadeBottom = smoothstep(-uEdgeFade, -(uEdgeFade + 0.4), blended.y);
  float vMask = 1.0 - max(fadeTop, fadeBottom);

  float tileCount = mix(uOuterLines, uInnerLines, vMask);
  float scaledY = blended.y * tileCount;
  float nY = smoothNoise(abs(scaledY));

  /* Cresta: el brillo que corre por encima de las líneas. */
  float ridge = pow(
    step(abs(nY - blended.x) * 2.0, HALF_PI) * cos(2.0 * (nY - blended.x)),
    5.0
  );

  float lines = 0.0;
  for (float i = 1.0; i < 3.0; i += 1.0) {
    lines += pow(max(fract(scaledY), fract(-scaledY)), i * 2.0);
  }

  float pattern = vMask * lines;

  float cycleT = fullT * uCycle;
  float c1 = (pattern + lines * ridge) * (cos(blended.y + cycleT * 0.234) * 0.5 + 1.0);
  float c2 = (pattern + vMask * ridge) * (sin(blended.x + cycleT * 1.745) * 0.5 + 1.0);
  float c3 = (pattern + lines * ridge) * (cos(blended.x + cycleT * 0.534) * 0.5 + 1.0);

  vec3 col = (c1 * uColor1 + c2 * uColor2 + c3 * uColor3) * uBrightness;
  gl_FragColor = vec4(col, clamp(length(col), 0.0, 1.0));
}
`;

type Rgb = [number, number, number];

/** Lee un token de color y lo pasa a 0-1. Sólo entiende hexadecimal, que es
 *  lo que hay en `tokens.css` para la paleta base. */
function tokenColor(styles: CSSStyleDeclaration, token: string, fallback: Rgb): Rgb {
  const raw = styles.getPropertyValue(token).trim();
  const hit = /^#([0-9a-f]{3}|[0-9a-f]{6})$/i.exec(raw);
  if (!hit) return fallback;
  const hex = hit[1].length === 3 ? hit[1].replace(/./g, (c) => c + c) : hit[1];
  return [
    parseInt(hex.slice(0, 2), 16) / 255,
    parseInt(hex.slice(2, 4), 16) / 255,
    parseInt(hex.slice(4, 6), 16) / 255,
  ];
}

function compile(gl: WebGLRenderingContext, type: number, src: string): WebGLShader | null {
  const shader = gl.createShader(type);
  if (!shader) return null;
  gl.shaderSource(shader, src);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    gl.deleteShader(shader);
    return null;
  }
  return shader;
}

export function initHeroWaves(): void {
  const host = document.querySelector<HTMLElement>('[data-waves]');
  if (!host) return;
  if (reduceMotion() || !isDesktop()) return;

  const canvas = document.createElement('canvas');
  const gl = canvas.getContext('webgl', {
    alpha: true,
    premultipliedAlpha: false,
    antialias: false,
    depth: false,
    stencil: false,
    powerPreference: 'low-power',
  });
  // Sin WebGL la cabecera se queda como estaba: transparente y correcta.
  if (!gl) return;

  const vs = compile(gl, gl.VERTEX_SHADER, VERT);
  const fs = compile(gl, gl.FRAGMENT_SHADER, FRAG);
  const program = gl.createProgram();
  if (!vs || !fs || !program) return;

  gl.attachShader(program, vs);
  gl.attachShader(program, fs);
  gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) return;
  gl.useProgram(program);

  // Un triángulo que se sale del cuadro lo cubre entero con la mitad de
  // vértices y sin la costura diagonal de un rectángulo de dos triángulos.
  const buffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
  const aPos = gl.getAttribLocation(program, 'aPos');
  gl.enableVertexAttribArray(aPos);
  gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

  const u = (name: string) => gl.getUniformLocation(program, name);
  const uTime = u('uTime');
  const uResolution = u('uResolution');
  const uMouse = u('uMouse');

  const tokens = getComputedStyle(document.documentElement);
  gl.uniform3fv(u('uColor1'), tokenColor(tokens, '--c-bone', [0.95, 0.93, 0.89]));
  gl.uniform3fv(u('uColor2'), tokenColor(tokens, '--c-bone-soft', [0.8, 0.76, 0.72]));
  gl.uniform3fv(u('uColor3'), tokenColor(tokens, '--c-bone-mute', [0.55, 0.52, 0.48]));
  gl.uniform1f(u('uSpeed'), CFG.speed);
  gl.uniform1f(u('uInnerLines'), CFG.innerLines);
  gl.uniform1f(u('uOuterLines'), CFG.outerLines);
  gl.uniform1f(u('uWarp'), CFG.warp);
  gl.uniform1f(u('uRotation'), (CFG.rotation * Math.PI) / 180);
  gl.uniform1f(u('uEdgeFade'), CFG.edgeFade);
  gl.uniform1f(u('uCycle'), CFG.cycleSpeed);
  gl.uniform1f(u('uBrightness'), CFG.brightness);
  gl.uniform1f(u('uMouseInfluence'), finePointer() ? CFG.mouseInfluence : 0);

  gl.clearColor(0, 0, 0, 0);

  let rect = host.getBoundingClientRect();

  const resize = () => {
    rect = host.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, CFG.maxDpr);
    const w = Math.max(1, Math.round(rect.width * dpr));
    const h = Math.max(1, Math.round(rect.height * dpr));
    if (canvas.width === w && canvas.height === h) return;
    canvas.width = w;
    canvas.height = h;
    gl.viewport(0, 0, w, h);
    gl.uniform2f(uResolution, w, h);
  };

  const ro = new ResizeObserver(resize);
  ro.observe(host);
  resize();

  // El hero va en el flujo: al desplazarse cambia dónde cae el puntero dentro
  // del lienzo. Basta releer el rectángulo, no hay que redimensionar nada.
  const remeasure = () => {
    rect = host.getBoundingClientRect();
  };
  window.addEventListener('scroll', remeasure, { passive: true });

  host.appendChild(canvas);
  host.setAttribute('data-waves-on', '');

  // Fuera de pantalla no se pinta. Con un shader del tamaño de la ventana esto
  // no es un detalle: es la diferencia entre un sitio que se desplaza y uno
  // que se atasca.
  let visible = true;
  const io = new IntersectionObserver(
    ([entry]) => {
      visible = entry?.isIntersecting ?? true;
    },
    { threshold: 0 },
  );
  io.observe(host);

  let tx = 0.5;
  let ty = 0.5;
  let cx = 0.5;
  let cy = 0.5;

  // El puntero se escucha en la ventana, no en el lienzo: el lienzo tiene
  // `pointer-events: none` —si no, se comería los clics del hero— y así el
  // bulto ya viene entrando por el borde cuando el ratón baja desde la
  // cabecera. Se acota al cuadro para que no se escape al salir del hero.
  const onPointer = (e: PointerEvent) => {
    tx = rect.width ? clamp((e.clientX - rect.left) / rect.width) : 0.5;
    ty = rect.height ? clamp(1 - (e.clientY - rect.top) / rect.height) : 0.5;
  };
  window.addEventListener('pointermove', onPointer, { passive: true });

  let elapsed = 0;
  let lost = false;

  const stop = onTick((dt) => {
    if (lost || !visible) return;

    elapsed += dt * 0.016667;
    const t = Math.min(CFG.ease * dt, 1);
    cx = lerp(cx, tx, t);
    cy = lerp(cy, ty, t);

    gl.uniform1f(uTime, elapsed);
    gl.uniform2f(uMouse, cx, cy);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
  });

  canvas.addEventListener('webglcontextlost', (e) => {
    e.preventDefault();
    lost = true;
    host.removeAttribute('data-waves-on');
  });

  window.addEventListener('pagehide', () => {
    stop();
    ro.disconnect();
    io.disconnect();
    window.removeEventListener('scroll', remeasure);
    window.removeEventListener('pointermove', onPointer);
    gl.getExtension('WEBGL_lose_context')?.loseContext();
  });
}
