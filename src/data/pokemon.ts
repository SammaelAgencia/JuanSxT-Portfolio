/**
 * Torneo Pokémon — contenido de la página interna /pokemon.
 *
 * No hay enlace a ella en ninguna parte: se llega tecleando `torneo.codigo`
 * estando en el índice (lo escucha `scripts/secret.ts`).
 *
 * Todo lo que se lee en la página se edita aquí: las reglas, la cartelera del
 * próximo duelo, los siete puestos del salón de la fama y la tabla.
 */

/* ------------------------------------------------------------- CABECERA -- */

export const torneo = {
  ruta: '/pokemon',
  codigo: 'pokemon',
  title: 'Torneo Pokémon — Juan Pablo Sierra Tejada',
  description: 'Página interna del torneo. En construcción.',
  eyebrow: 'Zona secreta',
  /** Cada entrada del array es una línea del título. */
  titulo: ['Torneo Pokémon', '*Adoradores de vaporeon*'],
  nota: 'Reglas, cartelera y tabla del torneo. Se actualiza a medida que avanza.',

  /** Música de fondo.
   *  · `pista` es el archivo dentro de /public: deja el .mp3 (o .m4a) en
   *    `public/media/torneo/` con este mismo nombre y suena solo.
   *  · `auto` la arranca al entrar. Los navegadores no dejan sonar audio sin
   *    permiso, así que si bloquean el arranque suena con el primer clic o
   *    tecla; quien la silencie con el botón no la vuelve a oír.
   *  · `volumen` es de 0 a 1. Es música de fondo: por encima de ~0.5 tapa
   *    cualquier otra cosa que el visitante esté oyendo. */
  musica: {
    pista: '/media/torneo/tema.mp3',
    volumen: 0.35,
    auto: true,
  },
} as const;

/* --------------------------------------------------------------- TABS -- */

export interface PestanaTorneo {
  /** Identificador de la pestaña y de su panel. Sin espacios ni acentos. */
  id: string;
  index: string;
  label: string;
}

export const pestanasTorneo: PestanaTorneo[] = [
  { id: 'reglas',           index: '01', label: 'Reglas' },
  { id: 'proximo-duelo',    index: '02', label: 'Próximo duelo' },
  { id: 'salon-de-la-fama', index: '03', label: 'Salón de la fama' },
  { id: 'leaderboard',      index: '04', label: 'Leaderboard' },
];

/* --------------------------------------------------------------- REGLAS -- */

export interface ReglaItem {
  label: string;
  body: string;
  /** Sub-puntos de la regla. Se pintan como lista debajo del cuerpo. */
  lista?: string[];
  /** Caso práctico. Va destacado al final de la regla. */
  ejemplo?: string;
}

export interface GrupoReglas {
  index: string;
  title: string;
  items: ReglaItem[];
}

export const reglas: GrupoReglas[] = [
  {
    index: '01',
    title: 'Logística y sanciones',
    items: [
      {
        label: 'Plazos',
        body:
          'Tras recibir la ROM (máximo 2 por jugador), tendrán 1–2 semanas para avanzar. Ausencias injustificadas significan baja automática.',
      },
      {
        label: '1ª falta',
        body: 'Pérdida de un slot en el equipo (se recupera tras superar 1 gimnasio).',
      },
      {
        label: '2ª falta',
        body: 'Prohibición total del uso de objetos equipados (se recupera tras superar 1 gimnasio).',
      },
      {
        label: '3ª falta',
        body: 'Expulsión inmediata del torneo.',
      },
    ],
  },
  {
    index: '02',
    title: 'Reglas de captura',
    items: [
      {
        label: 'Límites',
        body: '1 captura por ruta o zona diferenciada (2 permitidas antes del primer gimnasio).',
      },
      {
        label: 'Species Clause',
        body:
          'Si el primer Pokémon de la ruta ya está en tu equipo o caja (vivo o muerto), debes buscar otro. Captura fallida o huida cuenta como ruta perdida.',
      },
      {
        label: 'Métodos permitidos',
        body: '1 captura por ruta o zona diferenciada (Desde que cambie el letrero)(2 permitidas antes del primer gimnasio).',
      },
      {
        label: 'Restricciones de especie',
        body:
          'Prohibidos los Ultraentes y cualquier Pokémon con estadísticas base (BST) superiores a 600. Límite de 1 Legendario/Mítico por partida.',
      },
      {
        label: 'Excepción shiny',
        body: 'Máximo 3 por partida. No consumen la captura de su respectiva ruta.',
      },
      {
        label: 'Wipe temprano',
        body:
          'Si todo el equipo muere antes del primer gimnasio, envías solo 3 Pokémon a la caja de muertos y conservas el resto.',
      },
    ],
  },
  {
    index: '03',
    title: 'Aventura y gimnasios',
    items: [
      {
        label: 'Muerte permanente',
        body:
          'Todo Pokémon debilitado va a la caja de muertos. Puedes retirarle el objeto que lleve equipado.',
      },
      {
        label: 'Límite de nivel',
        body: 'Máximo el nivel del Pokémon más fuerte del Líder de Gimnasio + 2 niveles.',
      },
      {
        label: 'Topes de BST por nivel',
        body: 'El BST máximo permitido sube con el nivel del torneo:',
        lista: [
          'Primer gimnasio: sólo Pokémon con BST ≤ 350.',
          'Segundo gimnasio: sólo Pokémon con BST ≤ 420.',
          'Tercer gimnasio: sólo Pokémon con BST ≤ 500.',
          'A partir del nivel 30: sin límite de BST para Pokémon normales. Siguen aplicando las restricciones de especie para legendarios y míticos.',
        ],
        ejemplo:
          'Si capturas un Victreebel (BST 490), un Mimikyu (BST 476) o un Blissey (BST 540) en las primeras rutas, tendrás que dejarlos guardados en la caja durante los primeros compases del juego. Recién podrás integrarlos a tu equipo activo cuando el nivel máximo del torneo alcance el nivel 30.',
      },
      {
        label: 'Economía estricta',
        body:
          'Prohibido comprar curaciones u objetos de combate. Prohibido farmear dinero, IVs, bayas o ítems repetibles.',
      },
      {
        label: 'Objetos',
        body:
          'Prohibido robar objetos a salvajes o entrenadores. No se puede repetir el mismo objeto equipado en dos Pokémon del equipo simultáneamente.',
      },
      {
        label: 'Prohibiciones',
        body:
          'Nada de Guardería, cheats, herramientas externas (PKHeX) o abusar de bugs. Prohibido el combo de habilidad Indefenso + ataques de KO directo.',
      },
    ],
  },
  {
    index: '04',
    title: 'Liga y combates PvP',
    items: [
      {
        label: 'Liga Pokémon',
        body:
          'Al entrar a la Liga, el equipo se bloquea y se vuelve inmortal. A partir de aquí no hay muertes.',
      },
      {
        label: 'Cero ayudas en PvP',
        body:
          'Prohibido usar wikis, calculadoras o apuntes previos. Solo se permite un bloc de notas en blanco iniciado durante el posicionamiento.',
      },
      {
        label: 'Comunicaciones',
        body:
          'Micrófono abierto obligatorio entre los duelistas. Los espectadores deben estar totalmente silenciados.',
      },
      {
        label: 'Desconexión',
        body: 'Perder el internet durante un combate equivale a una derrota automática.',
      },
    ],
  },
];


/* -------------------------------------------------------- PRÓXIMO DUELO --
   Cinco láminas en un carrusel. Cada una es una imagen apaisada con su texto
   debajo; mientras el archivo no exista se ve la placa técnica de
   <MediaSlot> con el nombre que espera. Van en public/media/torneo/.        */

export interface LaminaDuelo {
  imagen: string;
  alt: string;
  /** Rótulo sobre la imagen. Cadena vacía para no pintarlo. */
  tag?: string;
  /** Texto al pie de la lámina. */
  texto: string;
}

export const proximoDuelo = {
  ratio: '16 / 9',
  laminas: [
    {
      imagen: '/media/torneo/duelo-01.webp',
      alt: 'Cartel del primer duelo',
      tag: 'Duelo 01',
      texto:
        'La masacre de Rotom y Daniel',
    },
    {
      imagen: '/media/torneo/duelo-02.webp',
      alt: 'Cartel del segundo duelo',
      tag: 'Duelo 02',
      texto: 'La rebelión de Camilo y el dueño de está página',
    },
    {
      imagen: '/media/torneo/duelo-03.webp',
      alt: 'Cartel del tercer duelo',
      tag: 'Duelo 03',
      texto: 'La supremacía de Camilo',
    },
    {
      imagen: '/media/torneo/duelo-04.webp',
      alt: 'Cartel del cuarto duelo',
      tag: 'Duelo 04',
      texto: 'La caída de Daniel',
    },
    {
      imagen: '/media/torneo/duelo-05.webp',
      alt: 'Cartel del quinto duelo',
      tag: 'Duelo 05',
      texto: 'Se alza un campeón',
    },
  ] satisfies LaminaDuelo[],
};

/* ----------------------------------------------------- SALÓN DE LA FAMA --
   Tres láminas en carrusel: dos iguales —siete puestos, uno por temporada—
   y una tercera que sólo dice «coming soon».

   Un puesto sin `nombre` se pinta como hueco libre, que es lo correcto
   mientras nadie lo haya ganado. `foto` es opcional; sin ella van iniciales. */

export interface CampeonTorneo {
  /** Sello pequeño sobre la ficha: la temporada, el número de la Pokédex… */
  temporada?: string;
  nombre?: string;
  /** Una línea: el equipo, el mote o la hazaña. */
  lema?: string;
  /** Retrato que ocupa la ficha. */
  foto?: string;
  /** Cómo se acomoda esa imagen al contenedor:
   *  · 'contain' — entera dentro de la ficha, sin recortar nada (por defecto
   *    en el primer puesto: sirve cualquier imagen, del tamaño que sea).
   *  · 'cover'   — llena la ficha y recorta lo que sobra. */
  ajuste?: 'contain' | 'cover';
  /** Sprite: se pinta entero y sin suavizar, no recortado como un retrato. */
  sprite?: string;
}

export interface LaminaSalon {
  titulo: string;
  /** Logo que sustituye al título de la lámina. Uno por lámina: cada una
   *  lleva el suyo. Cualquier formato sirve; para una marca vectorial el .svg
   *  es lo más ligero y nítido, y si el original es un mapa de bits, .png (o
   *  .webp, que pesa la mitad). Si el archivo todavía no está, el hueco se
   *  queda vacío —no se pinta nada— y la lámina no se rompe. */
  logo?: string;
  /** Sin campeones la lámina se pinta como «coming soon». */
  campeones?: CampeonTorneo[];
  nota?: string;
}

/** Los siete puestos en blanco. Es una función y no una constante para que
 *  cada lámina se lleve su propia copia: editar una no toca la otra. */
const puestosEnBlanco = (): CampeonTorneo[] => [
  { temporada: 'T1' },
  { temporada: 'T2' },
  { temporada: 'T3' },
  { temporada: 'T4' },
  { temporada: 'T5' },
  { temporada: 'T6' },
  { temporada: 'T7' },
];

/** El equipo del campeón. Los sprites están descargados de PokeAPI y viven en
 *  /public: la página no le pide una sola imagen a un servidor de terceros. */
const equipoCampeon: CampeonTorneo[] = [
  { temporada: '#254', nombre: 'Sceptile',  sprite: '/media/torneo/sprites/sceptile.png' },
  { temporada: '#350', nombre: 'Milotic',   sprite: '/media/torneo/sprites/milotic.png' },
  { temporada: '#057', nombre: 'Primeape',  sprite: '/media/torneo/sprites/primeape.png' },
  { temporada: '#376', nombre: 'Metagross', sprite: '/media/torneo/sprites/metagross.png' },
  { temporada: '#065', nombre: 'Alakazam',  sprite: '/media/torneo/sprites/alakazam.png' },
  { temporada: '#049', nombre: 'Venomoth',  sprite: '/media/torneo/sprites/venomoth.png' },
];

export const salonDeLaFama: LaminaSalon[] = [
  {
    /* `titulo` ya no se lee en pantalla —lo sustituye el logo—, pero sigue
       siendo el nombre de la lámina para el botón del carrusel. */
    titulo: 'Campeones',
    logo: '/media/torneo/campeones.png',
    campeones: [
      /* El primer puesto es el campeón: una imagen, no un sprite. Va en
         'contain', así que cabe entera sea cual sea su proporción. */
      { temporada: 'T1', foto: '/media/torneo/pollo.png', ajuste: 'contain' },
      ...equipoCampeon,
    ],
  },
  {
    titulo: 'Subcampeones',
    logo: '/media/torneo/subcampeones.png',
    campeones: puestosEnBlanco(),
  },
  {
    titulo: 'Coming soon',
    logo: '/media/torneo/coming-soon.png',
    nota: 'Queda torneo por delante. Esta lámina se llena cuando haya de qué presumir.',
  },
];

/* ---------------------------------------------------------- LEADERBOARD --
   La puntuación ya no vive aquí: la lleva un tablero externo
   (leaderboarded.com) que se actualiza solo. La página no lo empotra en un
   iframe —sería un tercero pintando dentro del documento—, sino que enseña
   su lámina y enlaza al tablero en vivo.

   `preview` es una imagen de 1200×630 que el propio servicio regenera; el
   `width`/`height` del `<img>` reserva su sitio para que no salte nada.     */

export const leaderboardTitulo = 'Pokepollas';

export const leaderboardTablero = {
  /** Tablero público. Se abre en una pestaña nueva. */
  href: 'https://leaderboarded.com/board/grnqkpzmvnstr/?public=true&utm_source=board_badge&utm_medium=embed&utm_campaign=external_site',
  preview: 'https://leaderboarded.com/preview.png?token=grnqkpzmvnstr',
  alt: 'Pokepollas — puntuación en vivo',
  fuente: 'Leaderboarded',
  cta: 'Ver en vivo',
};
