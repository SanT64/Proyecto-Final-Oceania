import { useEffect, useId, useMemo, useRef, useState } from "react";
import dolphinPhoto from "./assets/photos/dolphin.webp";
import turtlePhoto from "./assets/photos/turtle.webp";
import {
  playBubbleIntro,
  playEffect,
  startAmbientMusic,
  startOceanAmbience,
  type SoundEffect,
  type WorldTheme,
} from "./ambientMusic";
import { MapArt, WorldScenery, type SpotCounts } from "./habitatArt";

type IconName =
  | "arrow"
  | "book"
  | "check"
  | "close"
  | "fish"
  | "heart"
  | "leaf"
  | "menu"
  | "play"
  | "recycle"
  | "sparkle"
  | "trash"
  | "volume"
  | "mute";

function getPreferredSpanishVoice(): SpeechSynthesisVoice | undefined {
  if (!("speechSynthesis" in window)) return undefined;

  return window.speechSynthesis
    .getVoices()
    .filter((voice) => voice.lang.toLowerCase().startsWith("es"))
    .sort((first, second) => {
      const score = (voice: SpeechSynthesisVoice) => {
        const language = voice.lang.toLowerCase();
        const preferredName = /natural|online|google|dalia|sabina|paulina|helena/i.test(voice.name);
        return (language === "es-mx" ? 200 : 100) + (preferredName ? 10 : 0);
      };
      return score(second) - score(first);
    })[0];
}

function configureSpeechMessage(message: SpeechSynthesisUtterance) {
  const voice = getPreferredSpanishVoice();
  message.lang = voice?.lang || "es-MX";
  if (voice) message.voice = voice;
  message.rate = 0.96;
  message.pitch = 1.12;
  message.volume = 1;
}

function Icon({ name, size = 20 }: { name: IconName; size?: number }) {
  const paths: Record<IconName, React.ReactNode> = {
    arrow: (
      <>
        <path d="M5 12h14M14 7l5 5-5 5" />
      </>
    ),
    book: (
      <>
        <path d="M4 5.5A3.5 3.5 0 0 1 7.5 2H11v17H7.5A3.5 3.5 0 0 0 4 22V5.5Z" />
        <path d="M20 5.5A3.5 3.5 0 0 0 16.5 2H13v17h3.5A3.5 3.5 0 0 1 20 22V5.5Z" />
      </>
    ),
    check: <path d="m5 12 4 4L19 6" />,
    close: (
      <>
        <path d="m6 6 12 12M18 6 6 18" />
      </>
    ),
    fish: (
      <>
        <path d="M16.5 7.5C13 4 7 5 4 10c3 5 9 6 12.5 2.5L21 16V4l-4.5 3.5Z" />
        <circle cx="9" cy="9" r=".7" fill="currentColor" stroke="none" />
      </>
    ),
    heart: (
      <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8l1.1 1.1L12 21l7.8-7.5 1.1-1.1a5.5 5.5 0 0 0-.1-7.8Z" />
    ),
    leaf: (
      <>
        <path d="M20 4C11 4 5 8 5 15c0 3 2 5 5 5 7 0 10-7 10-16Z" />
        <path d="M4 21c3-6 7-9 12-12" />
      </>
    ),
    menu: (
      <>
        <path d="M4 7h16M4 12h16M4 17h16" />
      </>
    ),
    play: <path d="m9 7 8 5-8 5V7Z" fill="currentColor" />,
    recycle: (
      <>
        <path d="m7 19-3-3 3-3M4 16h9a4 4 0 0 0 4-4" />
        <path d="m17 5 3 3-3 3M20 8h-9a4 4 0 0 0-4 4" />
      </>
    ),
    sparkle: (
      <>
        <path d="m12 3 1.5 5.5L19 10l-5.5 1.5L12 17l-1.5-5.5L5 10l5.5-1.5L12 3Z" />
        <path d="m19 17 .6 2.4L22 20l-2.4.6L19 23l-.6-2.4L16 20l2.4-.6L19 17Z" />
      </>
    ),
    trash: (
      <>
        <path d="M4 7h16M9 7V4h6v3M7 7l1 14h8l1-14M10 11v6M14 11v6" />
      </>
    ),
    volume: (
      <>
        <path d="M4 9v6h4l5 4V5L8 9H4Z" />
        <path d="M16.5 8.5a5 5 0 0 1 0 7M19 6a8.5 8.5 0 0 1 0 12" />
      </>
    ),
    mute: (
      <>
        <path d="M4 9v6h4l5 4V5L8 9H4Z" />
        <path d="m17 9 5 6M22 9l-5 6" />
      </>
    ),
  };
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {paths[name]}
    </svg>
  );
}

function OceanLogoMark() {
  const id = useId().replace(/[^a-zA-Z0-9_-]/g, "");
  return (
    <svg viewBox="0 0 64 64" role="img" aria-label="Tortuga verde sobre olas">
      <defs>
        <linearGradient id={`logo-sea-${id}`} x1="0" y1="0" x2="0" y2="1">
          <stop stopColor="#1B9AAA" />
          <stop offset="1" stopColor="#065A82" />
        </linearGradient>
      </defs>
      <circle cx="32" cy="32" r="29" fill="#E9FFFB" stroke="#04395E" strokeWidth="4" />
      <path d="M4 39c9-7 17 7 27 0s18 7 29 0v17H4Z" fill={`url(#logo-sea-${id})`} />
      <path d="M5 47c8-6 16 6 25 0s18 6 29 0" fill="none" stroke="#7DE4D4" strokeWidth="4" />
      <g stroke="#04395E" strokeWidth="2.3" strokeLinejoin="round">
        <path d="M24 27 14 21c-3-2-5 1-3 4l9 8m23-6 9-6c3-2 5 1 3 4l-9 8" fill="#80ED99" />
        <path d="M26 38 18 43c-3 2-4-2-2-5l7-6m17 6 8 5c3 2 4-2 2-5l-7-6" fill="#80ED99" />
        <ellipse cx="33" cy="30" rx="15" ry="12" fill="#38A3A5" />
        <path d="M23 29h20M28 20l-5 9 6 10m9-18 5 8-5 10" fill="none" opacity=".48" />
        <circle cx="49" cy="30" r="6.5" fill="#80ED99" />
        <circle cx="51" cy="28" r="1.4" fill="#04395E" stroke="none" />
      </g>
      <path d="m15 9 1.8 4.2L21 15l-4.2 1.8L15 21l-1.8-4.2L9 15l4.2-1.8Z" fill="#FFD166" />
    </svg>
  );
}

function OceanButton({
  children,
  href,
  variant = "primary",
  onClick,
}: {
  children: React.ReactNode;
  href?: string;
  variant?: "primary" | "secondary" | "light";
  onClick?: () => void;
}) {
  const className = `ocean-button ${variant}`;
  return href ? (
    <a className={className} href={href}>
      {children}
      <Icon name="arrow" size={18} />
    </a>
  ) : (
    <button className={className} onClick={onClick}>
      {children}
      <Icon name="arrow" size={18} />
    </button>
  );
}

const animalData = [
  {
    name: "Tortuga marina verde",
    scientific: "Chelonia mydas",
    status: "NOM-059-SEMARNAT-2010",
    fact: "Puede vivir muchas décadas y come pastos marinos.",
    kind: "turtle",
    color: "#38A3A5",
  },
  {
    name: "Tortuga marina de carey",
    scientific: "Eretmochelys imbricata",
    status: "NOM-059-SEMARNAT-2010",
    fact: "Su pico estrecho le ayuda a buscar alimento entre corales.",
    kind: "hawksbill",
    color: "#E9A23B",
  },
  {
    name: "Tonina o delfín nariz de botella",
    scientific: "Tursiops truncatus",
    status: "NOM-059-SEMARNAT-2010",
    fact: "Se comunica con silbidos y chasquidos.",
    kind: "dolphin",
    color: "#62B6CB",
  },
  {
    name: "Mero goliat",
    scientific: "Epinephelus itajara",
    status: null,
    fact: "Es uno de los peces más grandes del arrecife.",
    kind: "grouper",
    color: "#7FB069",
  },
  {
    name: "Pez loro semáforo",
    scientific: "Sparisoma viride",
    status: null,
    fact: "Limpia algas del arrecife y ayuda a formar arena.",
    kind: "parrotfish",
    color: "#38A3A5",
  },
  {
    name: "Pez ángel francés",
    scientific: "Pomacanthus paru",
    status: null,
    fact: "De joven limpia parásitos de otros peces.",
    kind: "angelfish",
    color: "#263B73",
  },
  {
    name: "Erizo negro de espinas largas",
    scientific: "Diadema antillarum",
    status: null,
    fact: "Controla las algas que compiten con los corales.",
    kind: "urchin",
    color: "#20283E",
  },
  {
    name: "Coral cuerno de alce",
    scientific: "Acropora palmata",
    status: "NOM-059-SEMARNAT-2010",
    fact: "Sus ramas forman refugios para peces pequeños.",
    kind: "staghorn",
    color: "#FF8A65",
  },
  {
    name: "Coral cerebro",
    scientific: "Colpophyllia natans",
    status: null,
    fact: "Sus surcos se parecen a los pliegues de un cerebro.",
    kind: "braincoral",
    color: "#F6A6B2",
  },
  {
    name: "Abanico de mar",
    scientific: "Plexaura homomalla",
    status: "NOM-059-SEMARNAT-2010",
    fact: "Se orienta hacia la corriente para filtrar alimento.",
    kind: "seafan",
    color: "#B58AE0",
  },
];

const animalDetails: Record<
  string,
  {
    intro: string;
    identity: string;
    home: string;
    food: string;
    needs: string;
    dangers: string;
    help: string;
    curiosities: string[];
  }
> = {
  turtle: {
    intro: "Soy una tortuga marina verde y visito las praderas del arrecife veracruzano.",
    identity: "Soy un reptil marino. Respiro aire y mi caparazón es liso y fuerte.",
    home: "Vivo en costas tropicales, praderas marinas y zonas cercanas a arrecifes.",
    food: "Cuando crezco como principalmente pastos marinos y algas.",
    needs: "Necesito agua limpia, praderas sanas y playas seguras para anidar.",
    dangers: "El plástico, las redes, los barcos y la pérdida de playas me amenazan.",
    help: "Reduce plásticos, recoge basura y respeta las zonas de anidación.",
    curiosities: ["Regreso a playas de anidación", "Respiro aire", "Ayudo a cuidar las praderas"],
  },
  hawksbill: {
    intro: "Soy la tortuga de carey y mi pico curvo me ayuda a explorar el arrecife.",
    identity: "Soy un reptil marino con placas superpuestas en el caparazón.",
    home: "Vivo alrededor de arrecifes coralinos y costas tropicales.",
    food: "Como esponjas, pequeños invertebrados y otros alimentos del arrecife.",
    needs: "Necesito corales sanos, agua limpia y playas tranquilas.",
    dangers: "Las redes, la contaminación y el comercio ilegal me ponen en peligro.",
    help: "Nunca compres objetos hechos con carey y mantén limpio el mar.",
    curiosities: ["Tengo un pico curvo", "Nado entre corales", "Mi caparazón tiene placas"],
  },
  dolphin: {
    intro: "Soy una tonina, el delfín nariz de botella que visita las aguas de Veracruz.",
    identity: "Soy un mamífero marino. Respiro por un orificio sobre mi cabeza.",
    home: "Vivo en grupos cerca de costas, lagunas y aguas abiertas.",
    food: "Como peces y calamares que encuentro usando sonidos.",
    needs: "Necesito subir a respirar, nadar libre y comunicarme con mi grupo.",
    dangers: "Las redes, el ruido intenso y la contaminación pueden dañarme.",
    help: "Obsérvame a distancia y evita tirar residuos al agua.",
    curiosities: ["Uso ecolocalización", "Tengo un silbido propio", "Duermo con medio cerebro"],
  },
  grouper: {
    intro: "Soy el mero goliat, un pez enorme y tranquilo del arrecife.",
    identity: "Soy un pez robusto con boca grande y manchas oscuras.",
    home: "Vivo en cuevas, manglares, arrecifes y estructuras sumergidas.",
    food: "Como crustáceos, pulpos y peces más pequeños.",
    needs: "Necesito refugios grandes y manglares sanos durante mi crecimiento.",
    dangers: "La pesca excesiva y la pérdida de manglares reducen mi población.",
    help: "Respeta las vedas y protege manglares y arrecifes.",
    curiosities: ["Puedo ser muy grande", "Hago sonidos graves", "Uso cuevas como refugio"],
  },
  parrotfish: {
    intro: "Soy un pez loro semáforo de colores vivos y ayudo a mantener sano el arrecife.",
    identity: "Soy un pez cuyos dientes unidos parecen el pico de un loro.",
    home: "Vivo en arrecifes tropicales, cerca de corales y grietas.",
    food: "Raspo algas de rocas y superficies coralinas.",
    needs: "Necesito arrecifes sanos, agua limpia y lugares para descansar.",
    dangers: "La pesca excesiva, la contaminación y la pérdida de arrecifes.",
    help: "Cuida los arrecifes y evita comprar fauna marina como recuerdo.",
    curiosities: ["Cambio de colores al crecer", "Ayudo a limpiar el coral", "Produzco arena"],
  },
  angelfish: {
    intro: "Soy el pez ángel francés y llevo escamas oscuras con bordes dorados.",
    identity: "Soy un pez de cuerpo alto y plano que maniobra entre los corales.",
    home: "Vivo en arrecifes poco profundos y casi siempre nado en pareja.",
    food: "Como esponjas, algas y pequeños organismos del arrecife.",
    needs: "Necesito corales complejos, agua clara y alimento variado.",
    dangers: "La contaminación y la pérdida del arrecife destruyen mi hogar.",
    help: "No toques los corales y reduce los residuos que llegan al mar.",
    curiosities: ["De joven soy limpiador", "Suelo nadar en pareja", "Tengo bordes amarillos"],
  },
  urchin: {
    intro: "Soy el erizo negro de espinas largas y limpio algas durante la noche.",
    identity: "Soy un invertebrado redondo con espinas largas que me protegen.",
    home: "Vivo en grietas y zonas rocosas del arrecife.",
    food: "Raspo algas de las rocas y dejo espacio para que crezcan corales.",
    needs: "Necesito escondites, agua limpia y un arrecife equilibrado.",
    dangers: "Las enfermedades, la contaminación y cambios bruscos del agua.",
    help: "No me toques y ayuda a mantener limpias las costas.",
    curiosities: ["Salgo más de noche", "Tengo pies diminutos", "Controlo las algas"],
  },
  staghorn: {
    intro: "Soy el coral cuerno de alce y mis ramas construyen refugios llenos de vida.",
    identity: "Soy una colonia de pequeños animales llamados pólipos.",
    home: "Vivo en aguas claras y poco profundas del arrecife.",
    food: "Capturo plancton y recibo energía de algas que viven conmigo.",
    needs: "Necesito agua limpia, temperatura estable y mucha luz.",
    dangers: "El calentamiento, las enfermedades y los golpes me dañan.",
    help: "No toques los corales y evita que la basura llegue al mar.",
    curiosities: ["Mis ramas crecen rápido", "Doy refugio a peces", "Soy un animal"],
  },
  braincoral: {
    intro: "Soy el coral cerebro y mis largos surcos me dan un aspecto inconfundible.",
    identity: "Soy una colonia de miles de pólipos que trabajan juntos.",
    home: "Vivo unido a rocas en arrecifes cálidos y luminosos.",
    food: "Atrapo plancton y comparto energía con algas microscópicas.",
    needs: "Necesito agua clara, limpia y con temperatura estable.",
    dangers: "El calor extremo, la contaminación y los golpes me dañan.",
    help: "Observa el arrecife sin tocarlo y usa menos plástico.",
    curiosities: ["Puedo vivir muchos años", "Crezco despacio", "Mis surcos me protegen"],
  },
  seafan: {
    intro: "Soy un abanico de mar flexible que se mueve con la corriente.",
    identity: "Soy una colonia de pequeños animales conectados entre sí.",
    home: "Vivo sujeto a zonas firmes del arrecife donde fluye la corriente.",
    food: "Filtro plancton y partículas diminutas del agua.",
    needs: "Necesito corrientes limpias y una base firme donde sujetarme.",
    dangers: "Las redes, la contaminación y los golpes pueden romperme.",
    help: "No dejes redes ni basura y mantén distancia al bucear.",
    curiosities: ["Miro hacia la corriente", "Soy flexible", "Doy refugio a animales pequeños"],
  },
};

function AnimalEye({ x, y, r = 7, look = 1 }: { x: number; y: number; r?: number; look?: 1 | -1 }) {
  const pupilX = x + r * 0.18 * look;
  return (
    <g>
      <circle cx={x} cy={y} r={r} fill="#FFFFFF" />
      <circle cx={pupilX} cy={y + r * 0.12} r={r * 0.58} fill="#12324A" />
      <circle cx={pupilX - r * 0.2} cy={y - r * 0.16} r={r * 0.2} fill="#FFFFFF" />
      <circle cx={pupilX + r * 0.24} cy={y + r * 0.27} r={r * 0.1} fill="#FFFFFF" />
    </g>
  );
}

function SoftCheek({ x, y, size = 5 }: { x: number; y: number; size?: number }) {
  return <ellipse cx={x} cy={y} rx={size} ry={size * 0.55} fill="#FF8FA3" opacity=".52" />;
}

function AnimalIllustration({ kind, color }: { kind: string; color: string }) {
  const uid = useId().replace(/[^a-zA-Z0-9_-]/g, "");
  const id = (name: string) => `${kind}-${name}-${uid}`;
  const url = (name: string) => `url(#${id(name)})`;
  const palettes: Record<string, [string, string, string, string]> = {
    turtle: ["#8BD6B0", "#57B68F", "#28796D", "#76CFA0"],
    hawksbill: ["#F2C56E", "#D99A42", "#8D5B32", "#E4B44F"],
    dolphin: ["#9CCEDD", "#62A8BC", "#397C98", "#91C6D3"],
    grouper: ["#D2AA79", "#9B7653", "#654B3C", "#BF9163"],
    parrotfish: ["#70C6A5", "#37999A", "#14777C", "#E5B94D"],
    angelfish: ["#6478A4", "#344873", "#1D2D50", "#DDB94F"],
    urchin: ["#51497A", "#342D5D", "#1D1B36", "#8277AD"],
    staghorn: ["#F5AA86", "#E47D64", "#BF5552", "#EFB692"],
    braincoral: ["#7ACBB6", "#52AA99", "#C36F68", "#DCB89C"],
    seafan: ["#CD82DB", "#A653B8", "#71408D", "#D984BC"],
  };
  const [top, middle, bottom, accent] = palettes[kind] ?? [color, color, color, "#FFFFFF"];
  const defs = (
    <defs>
      <linearGradient id={id("body")} x1="0" y1="0" x2="0" y2="1">
        <stop stopColor={top} />
        <stop offset=".48" stopColor={middle} />
        <stop offset="1" stopColor={bottom} />
      </linearGradient>
      <linearGradient id={id("accent")} x1="0" y1="0" x2="1" y2="1">
        <stop stopColor={top} />
        <stop offset=".25" stopColor={accent} />
        <stop offset="1" stopColor={bottom} />
      </linearGradient>
      <radialGradient id={id("round")} cx="34%" cy="26%" r="78%">
        <stop stopColor={top} />
        <stop offset=".52" stopColor={middle} />
        <stop offset="1" stopColor={bottom} />
      </radialGradient>
      <filter id={id("shadow")} x="-30%" y="-80%" width="160%" height="260%">
        <feGaussianBlur stdDeviation="4" />
      </filter>
    </defs>
  );
  const shadow = (
    <ellipse cx="110" cy="116" rx="62" ry="8" fill="#04395E" opacity=".14" filter={url("shadow")} />
  );

  if (kind === "turtle" || kind === "hawksbill") {
    const carey = kind === "hawksbill";
    return (
      <svg className="species-vector" viewBox="0 0 220 130" aria-hidden="true">
        {defs}
        {shadow}
        <path
          d="M67 45 38 30c-8-4-13 3-7 10l26 22m12 22-31 16c-8 4-12-4-5-10l26-21M138 46l28-24c8-7 15-2 10 7l-20 31m-17 24 30 22c8 6 14 0 8-8l-23-30"
          fill="none"
          stroke={url("accent")}
          strokeWidth="17"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <ellipse cx="107" cy="66" rx="59" ry="45" fill={url("round")} />
        <path
          d="m107 28 25 17-9 29-31 9-20-25 12-28Z"
          fill={carey ? "#F7C85E" : "#66C896"}
          opacity=".92"
        />
        <path
          d="M84 31 67 49m64-5 22 11M92 82l-7 22m37-31 19 22"
          fill="none"
          stroke={carey ? "#8E542B" : "#24796E"}
          strokeOpacity=".5"
          strokeWidth="3"
          strokeLinecap="round"
        />
        <path
          d="M70 41c17-13 43-15 62-7"
          fill="none"
          stroke="#FFFFFF"
          strokeOpacity=".68"
          strokeWidth="6"
          strokeLinecap="round"
        />
        <path d="M158 54c18-8 37-1 42 11-7 14-26 18-42 7Z" fill={url("accent")} />
        <ellipse cx="177" cy="55" rx="10" ry="4" fill="#FFFFFF" opacity=".16" />
        <AnimalEye x={185} y={63} r={8} />
        <SoftCheek x={193} y={77} />
        <path
          d="M186 80c5 3 10 2 13-2"
          fill="none"
          stroke="#12324A"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
      </svg>
    );
  }

  if (kind === "dolphin")
    return (
      <svg className="species-vector" viewBox="0 0 220 130" aria-hidden="true">
        {defs}
        {shadow}
        <path d="M49 75 19 55l10 22-13 17 36-12" fill={bottom} />
        <path
          d="M45 78c14-31 55-49 101-42 24 4 39 13 48 24l21 4-20 11c-13 17-46 27-82 23-31-3-54-10-68-20Z"
          fill={url("body")}
        />
        <path
          d="M103 39c6-17 18-28 29-29-5 10-7 20-5 31M112 89c-4 16-15 27-26 30l12-31"
          fill={middle}
        />
        <path
          d="M62 61c25-19 62-24 93-14"
          fill="none"
          stroke="#FFFFFF"
          strokeOpacity=".68"
          strokeWidth="7"
          strokeLinecap="round"
        />
        <path
          d="M68 80c31 8 73 6 116-9"
          fill="none"
          stroke="#E8FAFF"
          strokeOpacity=".72"
          strokeWidth="9"
          strokeLinecap="round"
        />
        <AnimalEye x={172} y={57} r={8} />
        <SoftCheek x={179} y={70} />
        <path
          d="M188 70c8 3 16 2 23-2"
          fill="none"
          stroke="#12324A"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
      </svg>
    );

  if (["grouper", "parrotfish", "angelfish"].includes(kind)) {
    const angel = kind === "angelfish";
    const grouper = kind === "grouper";
    return (
      <svg className="species-vector" viewBox="0 0 220 130" aria-hidden="true">
        {defs}
        {shadow}
        <path
          d={angel ? "M51 66 18 34l8 32-8 31 34-26Z" : "M51 66 17 43l9 23-9 23 35-19Z"}
          fill={url("accent")}
        />
        <path
          d={
            angel
              ? "M47 66c8-36 35-54 72-51 42 4 70 25 74 51-4 27-34 48-75 50-36 1-63-17-71-50Z"
              : "M43 67c9-28 43-44 88-39 37 4 61 21 65 39-5 22-34 38-72 39-41 1-72-13-81-39Z"
          }
          fill={url("body")}
        />
        <path
          d={
            angel
              ? "M86 25 111 3l12 17m-20 89 22 17 7-18"
              : "M88 33c10-17 32-23 51-13l-7 12m-25 68c9 18 26 23 38 13l-16-14"
          }
          fill={accent}
        />
        {angel && (
          <g fill="none" stroke="#FFD166" strokeWidth="4" strokeLinecap="round" opacity=".85">
            <path d="M72 30v74m29-86v96m31-90v84m29-65v47" />
            <path d="M59 46c24 13 82 13 118-1M53 70c31 15 91 14 129-2M60 94c32 12 78 10 108-2" />
          </g>
        )}
        {grouper && (
          <g fill="#5E4335" opacity=".5">
            <circle cx="82" cy="52" r="5" />
            <circle cx="111" cy="42" r="4" />
            <circle cx="135" cy="58" r="5" />
            <circle cx="98" cy="81" r="5" />
            <circle cx="143" cy="87" r="4" />
          </g>
        )}
        {kind === "parrotfish" && (
          <>
            <path
              d="M88 32c-10 19-12 44-4 69m42-71c-13 19-14 45-6 72"
              fill="none"
              stroke="#FFD166"
              strokeWidth="7"
              strokeLinecap="round"
              opacity=".9"
            />
            <path d="M178 61c9-3 17 0 21 6-5 8-14 10-22 7Z" fill="#FFF4D6" />
          </>
        )}
        <path
          d="M67 47c25-16 62-17 86-6"
          fill="none"
          stroke="#FFFFFF"
          strokeOpacity=".62"
          strokeWidth="6"
          strokeLinecap="round"
        />
        <AnimalEye x={grouper ? 164 : 168} y={55} r={8} />
        <SoftCheek x={176} y={71} />
        <path
          d="M179 78c7 4 14 3 19-1"
          fill="none"
          stroke="#12324A"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
      </svg>
    );
  }

  if (kind === "urchin")
    return (
      <svg className="species-vector" viewBox="0 0 220 130" aria-hidden="true">
        {defs}
        {shadow}
        <g stroke={url("accent")} strokeWidth="5" strokeLinecap="round" opacity=".92">
          {[0, 20, 40, 60, 80, 100, 120, 140, 160, 180, 200, 220, 240, 260, 280, 300, 320, 340].map(
            (angle) => {
              const r = (angle * Math.PI) / 180;
              return (
                <line
                  key={angle}
                  x1={110 + Math.cos(r) * 27}
                  y1={68 + Math.sin(r) * 27}
                  x2={110 + Math.cos(r) * 67}
                  y2={68 + Math.sin(r) * 56}
                />
              );
            },
          )}
        </g>
        <circle cx="110" cy="68" r="38" fill={url("round")} />
        <path
          d="M84 49c12-15 31-20 47-12"
          fill="none"
          stroke="#FFFFFF"
          strokeOpacity=".48"
          strokeWidth="6"
          strokeLinecap="round"
        />
        <AnimalEye x={96} y={64} r={8} />
        <AnimalEye x={124} y={64} r={8} />
        <SoftCheek x={84} y={78} />
        <SoftCheek x={136} y={78} />
        <path
          d="M101 83c6 5 12 5 18 0"
          fill="none"
          stroke="#D7D2FF"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
      </svg>
    );

  if (kind === "staghorn")
    return (
      <svg className="species-vector" viewBox="0 0 220 130" aria-hidden="true">
        {defs}
        {shadow}
        <path
          d="M105 118V45m0 34L68 45m37 8 33-38m-70 30L48 19m20 26-7 28m77-58 16 27m-16-27-1 42m-32 10-27-4"
          fill="none"
          stroke={url("body")}
          strokeWidth="17"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M101 105V48m-29-8L52 19m81-1 14 23"
          fill="none"
          stroke="#FFFFFF"
          strokeOpacity=".5"
          strokeWidth="5"
          strokeLinecap="round"
        />
        <AnimalEye x={93} y={91} r={8} />
        <AnimalEye x={119} y={91} r={8} />
        <SoftCheek x={82} y={104} />
        <SoftCheek x={130} y={104} />
        <path
          d="M98 106c6 5 12 5 18 0"
          fill="none"
          stroke="#8A3F45"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
      </svg>
    );

  if (kind === "braincoral")
    return (
      <svg className="species-vector" viewBox="0 0 220 130" aria-hidden="true">
        {defs}
        {shadow}
        <path d="M34 108c0-48 31-87 76-87s76 39 76 87Z" fill={url("round")} />
        <g fill="none" stroke="#247D76" strokeOpacity=".55" strokeWidth="6" strokeLinecap="round">
          <path d="M55 102c-8-30 15-28 8-53m23 58c-13-19 13-27 0-52s18-30 20-8m13 60c15-21-7-30 4-56s30-12 20 9m19 44c12-20-3-29 2-48" />
          <path d="M47 78c15 5 20-7 14-19m27 4c18 5 22-11 14-25m27 39c17 8 29-7 21-20" />
        </g>
        <path
          d="M57 54c18-25 49-32 73-22"
          fill="none"
          stroke="#FFFFFF"
          strokeOpacity=".55"
          strokeWidth="7"
          strokeLinecap="round"
        />
        <AnimalEye x={91} y={83} r={8} />
        <AnimalEye x={126} y={83} r={8} />
        <SoftCheek x={78} y={98} />
        <SoftCheek x={139} y={98} />
        <path
          d="M99 102c7 6 14 6 21 0"
          fill="none"
          stroke="#205E5B"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
      </svg>
    );

  return (
    <svg className="species-vector" viewBox="0 0 220 130" aria-hidden="true">
      {defs}
      {shadow}
      <g fill="none" stroke={url("body")} strokeWidth="12" strokeLinecap="round">
        <path d="M110 121V42M109 89 65 51m45 18 42-39m-66 41L48 30m84 24 35-32m-95 41-16 32m89-54 21 38M88 87l-4-55m46 63 7-66" />
        <path d="M48 30Q109 2 167 22M56 95Q110 55 166 79M84 32q24 20 53-3M65 51q43-18 87-21" />
      </g>
      <g fill="none" stroke="#FFFFFF" strokeOpacity=".48" strokeWidth="3" strokeLinecap="round">
        <path d="M107 112V45M64 48 49 30m99-3 17-5M84 32q24 20 53-3" />
      </g>
      <AnimalEye x={96} y={93} r={8} />
      <AnimalEye x={121} y={93} r={8} />
      <SoftCheek x={84} y={106} />
      <SoftCheek x={133} y={106} />
      <path
        d="M101 108c6 5 11 5 17 0"
        fill="none"
        stroke="#4C286F"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

function CareIllustration({ kind }: { kind: "bottle" | "bag" | "beach" }) {
  const uid = useId().replace(/[^a-zA-Z0-9_-]/g, "");
  const id = (name: string) => `care-${kind}-${name}-${uid}`;
  const url = (name: string) => `url(#${id(name)})`;

  if (kind === "bottle")
    return (
      <svg viewBox="0 0 120 120" aria-hidden="true">
        <defs>
          <linearGradient id={id("metal")} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#0a8e96" />
            <stop offset=".35" stopColor="#5fe0d4" />
            <stop offset="1" stopColor="#076f7a" />
          </linearGradient>
        </defs>
        <ellipse cx="60" cy="108" rx="26" ry="5" fill="#0b5a63" opacity=".18" />
        <rect x="47" y="10" width="26" height="14" rx="5" fill="#0b4f6c" />
        <rect x="51" y="5" width="18" height="8" rx="4" fill="#0b4f6c" />
        <path d="M49 24h22l4 10H45Z" fill="#0a7f8c" />
        <rect x="37" y="32" width="46" height="74" rx="16" fill={url("metal")} />
        <rect x="37" y="56" width="46" height="24" fill="#fff" opacity=".92" />
        <path
          d="M60 74c-8-4-8-12-2-15 4 4 7 9 2 15Zm0 0c6-2 10-7 8-13-6 1-9 6-8 13Z"
          fill="#2aa66e"
        />
        <path
          d="M45 40v58"
          stroke="#fff"
          strokeOpacity=".55"
          strokeWidth="5"
          strokeLinecap="round"
        />
        <path d="M94 26l3 7 7 3-7 3-3 7-3-7-7-3 7-3Z" fill="#ffc93c" />
        <path d="M22 44l2 4 4 2-4 2-2 4-2-4-4-2 4-2Z" fill="#ffc93c" />
      </svg>
    );

  if (kind === "bag")
    return (
      <svg viewBox="0 0 120 120" aria-hidden="true">
        <defs>
          <linearGradient id={id("water")} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#4fc6dc" stopOpacity=".75" />
            <stop offset="1" stopColor="#0c6f99" stopOpacity=".9" />
          </linearGradient>
          <linearGradient id={id("bag")} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#ffffff" />
            <stop offset="1" stopColor="#e7d9ea" />
          </linearGradient>
        </defs>
        <path
          d="M44 40c0-16 5-24 11-24s10 8 10 24"
          fill="none"
          stroke="#b87a9f"
          strokeWidth="5"
          strokeLinecap="round"
        />
        <path
          d="M58 40c0-16 5-24 11-24s10 8 10 24"
          fill="none"
          stroke="#b87a9f"
          strokeWidth="5"
          strokeLinecap="round"
        />
        <path
          d="M36 40h50l7 50c1 7-4 12-11 12H40c-7 0-12-5-11-12Z"
          fill={url("bag")}
          stroke="#b87a9f"
          strokeWidth="3.5"
          strokeLinejoin="round"
        />
        <path
          d="M50 52l-3 22M64 50l1 18M76 54l4 26"
          stroke="#c99bb6"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
        <path d="M42 46h12" stroke="#fff" strokeWidth="4" strokeLinecap="round" />
        <path d="M0 68c10-6 20-6 30 0s20 6 30 0 20-6 30 0 20 6 30 0v52H0Z" fill={url("water")} />
        <path
          d="M6 76c8-4 16-4 24 0M64 78c8-4 16-4 24 0"
          fill="none"
          stroke="#fff"
          strokeOpacity=".7"
          strokeWidth="3"
          strokeLinecap="round"
        />
        <g fill="none" stroke="#fff" strokeOpacity=".85" strokeWidth="2">
          <circle cx="20" cy="96" r="4" />
          <circle cx="28" cy="86" r="2.5" />
          <circle cx="98" cy="100" r="3.5" />
        </g>
      </svg>
    );

  return (
    <svg viewBox="0 0 120 120" aria-hidden="true">
      <defs>
        <linearGradient id={id("sand")} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#ffe3ad" />
          <stop offset="1" stopColor="#e0aa62" />
        </linearGradient>
        <linearGradient id={id("sea")} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#64d3e0" />
          <stop offset="1" stopColor="#1a92b3" />
        </linearGradient>
      </defs>
      <path d="M0 28h120v40H0Z" fill={url("sea")} />
      <path d="M0 56c20-8 44-10 70-6s38 2 50-2v72H0Z" fill={url("sand")} />
      <path
        d="M0 56c20-8 44-10 70-6s38 2 50-2"
        fill="none"
        stroke="#fff"
        strokeWidth="4"
        strokeLinecap="round"
      />
      <g transform="rotate(-24 36 84)">
        <rect x="22" y="76" width="30" height="17" rx="4" fill="#e9483f" />
        <rect x="22" y="76" width="5" height="17" rx="2" fill="#c7c9d1" />
        <rect x="47" y="76" width="5" height="17" rx="2" fill="#c7c9d1" />
        <path d="M30 81h12" stroke="#fff" strokeWidth="3" strokeLinecap="round" />
      </g>
      <g transform="rotate(14 80 92)">
        <rect
          x="62"
          y="86"
          width="34"
          height="13"
          rx="6"
          fill="#7ed2a6"
          fillOpacity=".9"
          stroke="#3a9a6c"
          strokeWidth="2"
        />
        <rect x="96" y="89" width="8" height="7" rx="2" fill="#2f7cc0" />
        <path
          d="M68 90h18"
          stroke="#fff"
          strokeOpacity=".75"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
      </g>
      <path
        d="M54 104l5-6 4 5 5-6 4 5 5-5 1 9-5 4-4-4-5 5-4-4-5 5Z"
        fill="#ffc83d"
        stroke="#d99a15"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <circle cx="98" cy="70" r="4" fill="#ff8a65" stroke="#d35f3c" strokeWidth="1.8" />
      <g fill="#c48b45" opacity=".55">
        <circle cx="12" cy="104" r="1.6" />
        <circle cx="18" cy="112" r="1.4" />
        <circle cx="104" cy="112" r="1.6" />
        <circle cx="90" cy="108" r="1.2" />
      </g>
    </svg>
  );
}

type ToastTone = "success" | "info" | "celebrate";
type ToastMessage = { id: number; title: string; message?: string; tone: ToastTone };
type CvdMode = "none" | "protanopia" | "deuteranopia" | "tritanopia" | "achromatopsia";

const cvdModes: Array<{
  value: CvdMode;
  label: string;
  description: string;
  swatches: [string, string, string];
}> = [
  {
    value: "none",
    label: "Visión estándar",
    description: "Conserva la paleta original de Oceanía.",
    swatches: ["#087ca0", "#22c9c3", "#ff7e72"],
  },
  {
    value: "protanopia",
    label: "Protanopía",
    description: "Evita depender de diferencias entre rojo y verde.",
    swatches: ["#0072b2", "#e69f00", "#cc79a7"],
  },
  {
    value: "deuteranopia",
    label: "Deuteranopía",
    description: "Refuerza azules, naranjas y formas distinguibles.",
    swatches: ["#0072b2", "#f0e442", "#d55e00"],
  },
  {
    value: "tritanopia",
    label: "Tritanopía",
    description: "Aumenta la separación entre tonos azules y amarillos.",
    swatches: ["#009e73", "#d55e00", "#cc79a7"],
  },
  {
    value: "achromatopsia",
    label: "Acromatopsia",
    description: "Presenta la interfaz en escala de grises con más contraste.",
    swatches: ["#202020", "#777777", "#e5e5e5"],
  },
];

const habitatAudioTranscripts: Record<string, string> = {
  coral:
    "[Sonido ambiental: marimba alegre con burbujas suaves y notas cristalinas entre los corales.]",
  open: "[Sonido ambiental: piano suave, corrientes profundas y olas tranquilas en mar abierto.]",
  grass:
    "[Sonido ambiental: guitarra tranquila y murmullo suave de corriente entre pastos marinos.]",
  rock: "[Sonido ambiental: pizzicato juguetón con eco suave entre cuevas y rocas submarinas.]",
};

type WcagCriterion = {
  principle: "Perceptible" | "Operable" | "Comprensible" | "Robusto";
  criterion: string;
  level: "A" | "AA";
  application: string;
};

const wcagCriteria: WcagCriterion[] = [
  {
    principle: "Perceptible",
    criterion: "1.1.1",
    level: "A",
    application: "Textos alternativos y SVG decorativos ocultos correctamente.",
  },
  {
    principle: "Perceptible",
    criterion: "1.2.1",
    level: "A",
    application: "Transcripciones visibles para narración, música y sonidos.",
  },
  {
    principle: "Perceptible",
    criterion: "1.2.2",
    level: "A",
    application: "Las cápsulas incluyen subtítulos sincronizados.",
  },
  {
    principle: "Perceptible",
    criterion: "1.2.3",
    level: "A",
    application: "Narración y descripción visual acompañan las animaciones.",
  },
  {
    principle: "Perceptible",
    criterion: "1.2.4",
    level: "AA",
    application: "Los subtítulos se muestran durante la narración en vivo.",
  },
  {
    principle: "Perceptible",
    criterion: "1.2.5",
    level: "AA",
    application: "Descripción visual textual disponible en cada cápsula.",
  },
  {
    principle: "Perceptible",
    criterion: "1.3.1",
    level: "A",
    application: "Encabezados, listas, tablas y formularios usan semántica HTML.",
  },
  {
    principle: "Perceptible",
    criterion: "1.3.2",
    level: "A",
    application: "El orden del DOM conserva una secuencia significativa.",
  },
  {
    principle: "Perceptible",
    criterion: "1.3.3",
    level: "A",
    application: "Las instrucciones no dependen solo de posición o forma.",
  },
  {
    principle: "Perceptible",
    criterion: "1.3.4",
    level: "AA",
    application: "La interfaz funciona en orientación vertical y horizontal.",
  },
  {
    principle: "Perceptible",
    criterion: "1.3.5",
    level: "AA",
    application: "Nombre y correo exponen propósitos de autocompletado.",
  },
  {
    principle: "Perceptible",
    criterion: "1.4.1",
    level: "A",
    application: "Íconos, texto y tipos de borde complementan el color.",
  },
  {
    principle: "Perceptible",
    criterion: "1.4.2",
    level: "A",
    application: "Todo audio puede pausarse o detenerse.",
  },
  {
    principle: "Perceptible",
    criterion: "1.4.3",
    level: "AA",
    application: "Texto y fondos mantienen contraste mínimo AA.",
  },
  {
    principle: "Perceptible",
    criterion: "1.4.4",
    level: "AA",
    application: "Texto grande al 120 % sin pérdida de contenido.",
  },
  {
    principle: "Perceptible",
    criterion: "1.4.5",
    level: "AA",
    application: "El texto informativo permanece como texto real.",
  },
  {
    principle: "Perceptible",
    criterion: "1.4.10",
    level: "AA",
    application: "Reflow completo hasta 320 px sin desplazamiento horizontal.",
  },
  {
    principle: "Perceptible",
    criterion: "1.4.11",
    level: "AA",
    application: "Controles y estados tienen contraste no textual suficiente.",
  },
  {
    principle: "Perceptible",
    criterion: "1.4.12",
    level: "AA",
    application: "El espaciado de texto admite ampliación sin recortes.",
  },
  {
    principle: "Perceptible",
    criterion: "1.4.13",
    level: "AA",
    application: "Contenido mostrado al enfocar puede percibirse y descartarse.",
  },
  {
    principle: "Operable",
    criterion: "2.1.1",
    level: "A",
    application: "Todas las funciones son operables con teclado.",
  },
  {
    principle: "Operable",
    criterion: "2.1.2",
    level: "A",
    application: "Ningún componente genera trampas de teclado.",
  },
  {
    principle: "Operable",
    criterion: "2.1.4",
    level: "A",
    application: "No existen atajos de una sola tecla sin control.",
  },
  {
    principle: "Operable",
    criterion: "2.2.1",
    level: "A",
    application: "Juegos y actividades no tienen límite de tiempo.",
  },
  {
    principle: "Operable",
    criterion: "2.2.2",
    level: "A",
    application: "Animaciones y ambientes cuentan con pausa.",
  },
  {
    principle: "Operable",
    criterion: "2.3.1",
    level: "A",
    application: "No se usan destellos que superen el umbral permitido.",
  },
  {
    principle: "Operable",
    criterion: "2.4.1",
    level: "A",
    application: "Enlace para saltar directamente al contenido principal.",
  },
  {
    principle: "Operable",
    criterion: "2.4.2",
    level: "A",
    application: "La página tiene título descriptivo y estable.",
  },
  {
    principle: "Operable",
    criterion: "2.4.3",
    level: "A",
    application: "El orden de foco sigue la lectura y la interacción.",
  },
  {
    principle: "Operable",
    criterion: "2.4.4",
    level: "A",
    application: "Cada enlace comunica claramente su propósito.",
  },
  {
    principle: "Operable",
    criterion: "2.4.5",
    level: "AA",
    application: "Navegación, mapas y listas ofrecen varias rutas de acceso.",
  },
  {
    principle: "Operable",
    criterion: "2.4.6",
    level: "AA",
    application: "Encabezados y etiquetas describen tema o propósito.",
  },
  {
    principle: "Operable",
    criterion: "2.4.7",
    level: "AA",
    application: "Todos los controles muestran un foco de alto contraste.",
  },
  {
    principle: "Operable",
    criterion: "2.4.11",
    level: "AA",
    application: "El foco recibe margen de desplazamiento y no queda oculto.",
  },
  {
    principle: "Operable",
    criterion: "2.5.1",
    level: "A",
    application: "No se requieren gestos complejos de puntero.",
  },
  {
    principle: "Operable",
    criterion: "2.5.2",
    level: "A",
    application: "Las acciones se completan al soltar, no al presionar.",
  },
  {
    principle: "Operable",
    criterion: "2.5.3",
    level: "A",
    application: "El nombre visible coincide con el nombre accesible.",
  },
  {
    principle: "Operable",
    criterion: "2.5.4",
    level: "A",
    application: "No se requiere movimiento del dispositivo.",
  },
  {
    principle: "Operable",
    criterion: "2.5.7",
    level: "AA",
    application: "Arrastrar nunca es obligatorio; existen botones equivalentes.",
  },
  {
    principle: "Operable",
    criterion: "2.5.8",
    level: "AA",
    application: "Los objetivos interactivos miden al menos 44 × 44 px.",
  },
  {
    principle: "Comprensible",
    criterion: "3.1.1",
    level: "A",
    application: "El idioma principal del documento se define como español.",
  },
  {
    principle: "Comprensible",
    criterion: "3.1.2",
    level: "AA",
    application: "Los nombres científicos están marcados en latín.",
  },
  {
    principle: "Comprensible",
    criterion: "3.2.1",
    level: "A",
    application: "Recibir foco no provoca cambios inesperados.",
  },
  {
    principle: "Comprensible",
    criterion: "3.2.2",
    level: "A",
    application: "Cambiar un campo no envía ni cambia la vista automáticamente.",
  },
  {
    principle: "Comprensible",
    criterion: "3.2.3",
    level: "AA",
    application: "La navegación conserva orden y presentación coherentes.",
  },
  {
    principle: "Comprensible",
    criterion: "3.2.4",
    level: "AA",
    application: "Los componentes repetidos mantienen nombres e íconos.",
  },
  {
    principle: "Comprensible",
    criterion: "3.2.6",
    level: "A",
    application: "Reporte, ayuda y declaración permanecen en posiciones coherentes.",
  },
  {
    principle: "Comprensible",
    criterion: "3.3.1",
    level: "A",
    application: "Los errores se identifican y describen en español.",
  },
  {
    principle: "Comprensible",
    criterion: "3.3.2",
    level: "A",
    application: "Todos los campos tienen etiquetas e instrucciones visibles.",
  },
  {
    principle: "Comprensible",
    criterion: "3.3.3",
    level: "AA",
    application: "Cada error incluye una sugerencia concreta de corrección.",
  },
  {
    principle: "Comprensible",
    criterion: "3.3.4",
    level: "AA",
    application: "Los envíos se confirman conservando los datos para revisión.",
  },
  {
    principle: "Comprensible",
    criterion: "3.3.7",
    level: "A",
    application: "El nombre ya proporcionado se reutiliza y puede editarse.",
  },
  {
    principle: "Comprensible",
    criterion: "3.3.8",
    level: "AA",
    application: "No se usan CAPTCHA ni pruebas cognitivas de autenticación.",
  },
  {
    principle: "Robusto",
    criterion: "4.1.2",
    level: "A",
    application: "Controles exponen nombre, función y estado accesibles.",
  },
  {
    principle: "Robusto",
    criterion: "4.1.3",
    level: "AA",
    application: "Mensajes dinámicos usan status, alert y regiones en vivo.",
  },
];

const TOAST_VISIBLE_MS = 3000;
const TOAST_EXIT_MS = 280;

function ToastItem({
  toast,
  reducedMotion,
  onDismiss,
}: {
  toast: ToastMessage;
  reducedMotion: boolean;
  onDismiss: (id: number) => void;
}) {
  const [leaving, setLeaving] = useState(false);
  const noMotion = reducedMotion || window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  useEffect(() => {
    // The toast is visible for exactly 3 seconds, then exits and is removed.
    const hideTimer = window.setTimeout(() => setLeaving(true), TOAST_VISIBLE_MS);
    const removeTimer = window.setTimeout(
      () => onDismiss(toast.id),
      TOAST_VISIBLE_MS + (noMotion ? 0 : TOAST_EXIT_MS),
    );
    return () => {
      window.clearTimeout(hideTimer);
      window.clearTimeout(removeTimer);
    };
  }, [toast.id, noMotion, onDismiss]);

  return (
    <div className={`toast toast-${toast.tone}${leaving ? " toast-leaving" : ""}`} role="status">
      <span className="toast-icon" aria-hidden="true">
        <Icon name={toast.tone === "info" ? "check" : "sparkle"} size={22} />
      </span>
      <div className="toast-text">
        <strong>{toast.title}</strong>
        {toast.message && <span>{toast.message}</span>}
      </div>
      <button onClick={() => onDismiss(toast.id)} aria-label="Cerrar notificación">
        <Icon name="close" size={18} />
      </button>
      <span className="toast-timer" aria-hidden="true" />
    </div>
  );
}

/* Fotografías reales con licencia libre y respaldo ilustrado ante fallos de red. */
const animalPhotos: Record<
  string,
  { src: string; alt: string; author: string; license: string; source: string }
> = {
  turtle: {
    src: "https://commons.wikimedia.org/wiki/Special:FilePath/Green_Sea_Turtle_grazing_seagrass.jpg?width=800",
    alt: "Fotografía real de una tortuga marina verde (Chelonia mydas) alimentándose de pastos marinos en el fondo del océano",
    author: "P. Lindgren · Wikimedia Commons",
    license: "CC BY-SA 3.0",
    source: "https://commons.wikimedia.org/wiki/File:Green_Sea_Turtle_grazing_seagrass.jpg",
  },
  hawksbill: {
    src: "https://commons.wikimedia.org/wiki/Special:FilePath/Tortuga%20carey%20%28Eretmochelys%20imbricata%29%2C%20islas%20Ad%20Dimaniyat%2C%20Om%C3%A1n%2C%202024-08-13%2C%20DD%2068.jpg?width=800",
    alt: "Fotografía real de una tortuga marina de carey nadando sobre un arrecife",
    author: "Wikimedia Commons",
    license: "Ver licencia en la fuente",
    source:
      "https://commons.wikimedia.org/wiki/File:Tortuga%20carey%20%28Eretmochelys%20imbricata%29%2C%20islas%20Ad%20Dimaniyat%2C%20Om%C3%A1n%2C%202024-08-13%2C%20DD%2068.jpg",
  },
  dolphin: {
    src: dolphinPhoto,
    alt: "Fotografía real de una tonina o delfín nariz de botella nadando bajo el agua",
    author: "Tony Hisgett",
    license: "CC BY 2.0",
    source: "https://commons.wikimedia.org/wiki/File:Underwater_dolphin_2_(14942564164).jpg",
  },
  grouper: {
    src: "https://commons.wikimedia.org/wiki/Special:FilePath/Epinephelus_itajara.jpg?width=800",
    alt: "Fotografía real de un mero goliat de cuerpo robusto junto al arrecife",
    author: "Wikimedia Commons",
    license: "Ver licencia en la fuente",
    source: "https://commons.wikimedia.org/wiki/File:Epinephelus_itajara.jpg",
  },
  parrotfish: {
    src: "https://commons.wikimedia.org/wiki/Special:FilePath/Sparisoma_viride.jpg?width=800",
    alt: "Fotografía real de un pez loro semáforo de tonos verdes y turquesa",
    author: "Wikimedia Commons",
    license: "Ver licencia en la fuente",
    source: "https://commons.wikimedia.org/wiki/File:Sparisoma_viride.jpg",
  },
  angelfish: {
    src: "https://commons.wikimedia.org/wiki/Special:FilePath/Pomacanthus_paru.jpg?width=800",
    alt: "Fotografía real de un pez ángel francés oscuro con bordes amarillos",
    author: "Wikimedia Commons",
    license: "Ver licencia en la fuente",
    source: "https://commons.wikimedia.org/wiki/File:Pomacanthus_paru.jpg",
  },
  urchin: {
    src: "https://commons.wikimedia.org/wiki/Special:FilePath/Diadema_antillarum.jpg?width=800",
    alt: "Fotografía real de un erizo negro de espinas largas sobre el fondo marino",
    author: "Wikimedia Commons",
    license: "Ver licencia en la fuente",
    source: "https://commons.wikimedia.org/wiki/File:Diadema_antillarum.jpg",
  },
  staghorn: {
    src: "https://commons.wikimedia.org/wiki/Special:FilePath/Acropora_palmata.jpg?width=800",
    alt: "Fotografía real del coral cuerno de alce Acropora palmata",
    author: "Wikimedia Commons",
    license: "Ver licencia en la fuente",
    source: "https://commons.wikimedia.org/wiki/File:Acropora_palmata.jpg",
  },
  braincoral: {
    src: "https://commons.wikimedia.org/wiki/Special:FilePath/Colpophyllia_natans.jpg?width=800",
    alt: "Fotografía real de un coral cerebro con surcos ondulados",
    author: "Wikimedia Commons",
    license: "Ver licencia en la fuente",
    source: "https://commons.wikimedia.org/wiki/File:Colpophyllia_natans.jpg",
  },
  seafan: {
    src: "https://commons.wikimedia.org/wiki/Special:FilePath/Plexaura_homomalla.jpg?width=800",
    alt: "Fotografía real de un abanico de mar violeta extendido en la corriente",
    author: "Wikimedia Commons",
    license: "Ver licencia en la fuente",
    source: "https://commons.wikimedia.org/wiki/File:Plexaura_homomalla.jpg",
  },
};

const animalHabitat: Record<string, string> = {
  turtle: "grass",
  hawksbill: "coral",
  dolphin: "open",
  grouper: "rock",
  parrotfish: "coral",
  angelfish: "coral",
  urchin: "rock",
  staghorn: "coral",
  braincoral: "coral",
  seafan: "coral",
};

type FactKey = "identity" | "home" | "food" | "needs" | "dangers" | "help";

const simpleAnimalDetails: Record<string, Record<FactKey | "intro", string>> = {
  turtle: {
    intro: "Soy una tortuga verde.",
    identity: "Soy un reptil y respiro aire.",
    home: "Vivo cerca de praderas y arrecifes.",
    food: "Como pastos y algas.",
    needs: "Necesito agua y playas limpias.",
    dangers: "El plástico y las redes me dañan.",
    help: "Usa menos plástico.",
  },
  hawksbill: {
    intro: "Soy la tortuga de carey.",
    identity: "Tengo pico curvo y caparazón con placas.",
    home: "Vivo en arrecifes.",
    food: "Como esponjas y animales pequeños.",
    needs: "Necesito corales y playas sanas.",
    dangers: "Las redes y el comercio ilegal me dañan.",
    help: "No compres objetos de carey.",
  },
  dolphin: {
    intro: "Soy una tonina.",
    identity: "Soy un mamífero y respiro aire.",
    home: "Vivo cerca de la costa y en mar abierto.",
    food: "Como peces y calamares.",
    needs: "Necesito nadar y hablar con mi grupo.",
    dangers: "Las redes y el ruido me dañan.",
    help: "Obsérvame de lejos.",
  },
  grouper: {
    intro: "Soy un mero goliat.",
    identity: "Soy un pez grande y fuerte.",
    home: "Vivo en cuevas, arrecifes y manglares.",
    food: "Como crustáceos y peces.",
    needs: "Necesito refugios y manglares sanos.",
    dangers: "La pesca excesiva me amenaza.",
    help: "Respeta las vedas.",
  },
  parrotfish: {
    intro: "Soy un pez loro.",
    identity: "Mis dientes parecen un pico.",
    home: "Vivo en arrecifes.",
    food: "Como algas de las rocas.",
    needs: "Necesito coral y agua limpia.",
    dangers: "La pesca y la contaminación me dañan.",
    help: "Cuida el arrecife.",
  },
  angelfish: {
    intro: "Soy un pez ángel francés.",
    identity: "Soy plano, oscuro y tengo bordes amarillos.",
    home: "Vivo entre corales.",
    food: "Como esponjas y algas.",
    needs: "Necesito un arrecife sano.",
    dangers: "La contaminación destruye mi hogar.",
    help: "No toques los corales.",
  },
  urchin: {
    intro: "Soy un erizo negro.",
    identity: "Tengo espinas largas.",
    home: "Vivo entre rocas del arrecife.",
    food: "Como algas.",
    needs: "Necesito grietas y agua limpia.",
    dangers: "Las enfermedades me dañan.",
    help: "No me toques.",
  },
  staghorn: {
    intro: "Soy un coral con ramas.",
    identity: "Soy un grupo de animales pequeños.",
    home: "Vivo en arrecifes con luz.",
    food: "Atrapo comida diminuta.",
    needs: "Necesito agua limpia y fresca.",
    dangers: "El calor y los golpes me dañan.",
    help: "Mírame sin tocarme.",
  },
  braincoral: {
    intro: "Soy un coral cerebro.",
    identity: "Soy un grupo de animales pequeños.",
    home: "Vivo sobre rocas del arrecife.",
    food: "Como plancton.",
    needs: "Necesito agua limpia.",
    dangers: "El calor y la basura me dañan.",
    help: "Usa menos plástico.",
  },
  seafan: {
    intro: "Soy un abanico de mar.",
    identity: "Soy un grupo de animales pequeños.",
    home: "Vivo donde hay corriente.",
    food: "Filtro comida del agua.",
    needs: "Necesito agua limpia.",
    dangers: "Las redes y los golpes me rompen.",
    help: "No dejes basura ni redes.",
  },
};

const habitats = [
  {
    name: "Reino de los arrecifes",
    shortName: "Arrecifes",
    text: "Una ciudad de coral, anémonas y miles de colores.",
    type: "coral",
    animals: ["hawksbill", "parrotfish", "angelfish", "staghorn"],
    music: "Marimba alegre y burbujas",
    protect: "Observa los corales sin tocarlos y evita dejar basura.",
    challenge: "Encuentra el pez con dientes parecidos al pico de un loro.",
  },
  {
    name: "Océano infinito",
    shortName: "Océano abierto",
    text: "Un azul enorme donde los grandes viajeros recorren el planeta.",
    type: "open",
    animals: ["dolphin", "grouper"],
    music: "Piano suave, olas y burbujas",
    protect: "Reduce el ruido y el plástico que llega a las aguas abiertas.",
    challenge: "Elige al gigante que come animales diminutos llamados plancton.",
  },
  {
    name: "Jardín submarino",
    shortName: "Praderas marinas",
    text: "Un bosque suave de pastos que produce oxígeno y alimento.",
    type: "grass",
    animals: ["turtle", "urchin"],
    music: "Guitarra tranquila y corriente marina",
    protect: "No arranques las plantas y cuida el agua que llega al mar.",
    challenge: "Descubre quién viene a este jardín para comer pastos marinos.",
  },
  {
    name: "Mundo de las rocas",
    shortName: "Fondos rocosos",
    text: "Cuevas y grietas secretas llenas de escondites.",
    type: "rock",
    animals: ["grouper", "braincoral", "seafan"],
    music: "Pizzicato juguetón y misterioso",
    protect: "Deja las piedras y conchas en su lugar: pueden ser un hogar.",
    challenge: "Busca al animal de ocho brazos que cambia de color.",
  },
];

const cleanupItems = [
  {
    id: "bottle",
    name: "Botella de plástico",
    type: "trash",
    explanation:
      "El plástico puede permanecer muchos años en el mar. Los animales pueden confundirlo con alimento.",
  },
  {
    id: "bag",
    name: "Bolsa de plástico",
    type: "trash",
    explanation:
      "Una bolsa puede envolver a una tortuga o parecerse a una medusa. Debemos recogerla.",
  },
  {
    id: "can",
    name: "Lata",
    type: "trash",
    explanation:
      "Las latas no pertenecen al océano. Pueden ensuciar el agua y lastimar a los animales.",
  },
  {
    id: "net",
    name: "Red abandonada",
    type: "trash",
    explanation:
      "Las redes perdidas siguen flotando y pueden atrapar a peces, tortugas y otros animales.",
  },
  {
    id: "wrapper",
    name: "Envoltura",
    type: "trash",
    explanation:
      "Los residuos pequeños viajan con las corrientes y contaminan lugares muy lejanos.",
  },
  {
    id: "game-fish",
    name: "Pez ángel francés",
    type: "natural",
    explanation:
      "¡Ese amiguito sí pertenece aquí! Es un pez ángel francés. Déjalo nadar tranquilamente.",
  },
  {
    id: "game-turtle",
    name: "Tortuga verde",
    type: "natural",
    explanation: "La tortuga es parte del océano. Podemos ayudarla dejando limpio su hogar.",
  },
  {
    id: "game-coral",
    name: "Coral",
    type: "natural",
    explanation: "El coral es el hogar de muchos animales. Obsérvalo sin tocarlo ni retirarlo.",
  },
  {
    id: "game-seaweed",
    name: "Alga marina",
    type: "natural",
    explanation: "Las algas producen oxígeno, dan alimento y ofrecen refugio. Déjalas crecer.",
  },
] as const;

function HabitatsMap({
  paused,
  onPause,
  onEnter,
  onOpenList,
}: {
  paused: boolean;
  onPause: () => void;
  onEnter: (habitat: (typeof habitats)[number]) => void;
  onOpenList: () => void;
}) {
  return (
    <section
      className={`habitats-map${paused ? " habitat-paused" : ""}`}
      id="habitats"
      aria-labelledby="habitats-title"
    >
      <div className="map-heading">
        <div>
          <span className="kicker">MAPA DE OCEANÍA</span>
          <h2 id="habitats-title">Mundos submarinos</h2>
          <p>Recorre el mapa y entra a un mundo. Cada lugar está conectado con el océano.</p>
        </div>
        <div className="map-controls">
          <button onClick={onOpenList}>
            <Icon name="book" size={19} /> Lista de mundos
          </button>
          <button onClick={onPause} aria-pressed={paused}>
            <span aria-hidden="true">{paused ? "▶" : "Ⅱ"}</span>
            {paused ? "Reanudar" : "Pausar"}
          </button>
        </div>
      </div>
      <div className="world-map-scene" role="group" aria-label="Mapa con cuatro hábitats marinos">
        <div className="map-rays" />
        <svg
          className="map-routes"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <path d="M25 30C40 14 60 14 75 30S88 62 75 72C60 86 40 86 25 72S12 44 25 30Z" />
          <path d="M25 30C45 46 55 56 75 72" />
        </svg>
        <svg
          className="map-floor"
          viewBox="0 0 1200 180"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <path
            d="M0 62C180 25 360 35 530 58C720 84 900 66 1200 28V180H0Z"
            fill="#c7a476"
            stroke="#d9bb8c"
            strokeWidth="5"
            vectorEffect="non-scaling-stroke"
          />
        </svg>
        <div className="map-grid">
          {habitats.map((habitat, index) => (
            <button
              key={habitat.type}
              className={`map-region map-${habitat.type}`}
              onClick={() => onEnter(habitat)}
              aria-label={`Entrar a ${habitat.name}. ${habitat.text}`}
            >
              <span className="region-illustration" aria-hidden="true">
                <MapArt theme={habitat.type as WorldTheme} />
                {habitat.type === "coral" && (
                  <span className="map-critter critter-clownfish">
                    <AnimalIllustration kind="parrotfish" color="#FFD166" />
                  </span>
                )}
                {habitat.type === "open" && (
                  <span className="map-critter critter-whale">
                    <AnimalIllustration kind="dolphin" color="#96cdeb" />
                  </span>
                )}
                {habitat.type === "grass" && (
                  <span className="map-critter critter-turtle">
                    <AnimalIllustration kind="turtle" color="#76d8bd" />
                  </span>
                )}
                {habitat.type === "rock" && (
                  <span className="map-critter critter-octopus">
                    <AnimalIllustration kind="seafan" color="#B58AE0" />
                  </span>
                )}
              </span>
              <span className="region-label">
                <span className="region-title">
                  <small>MUNDO {index + 1}</small>
                  <strong>{habitat.name}</strong>
                </span>
                <em>
                  Entrar <Icon name="arrow" size={16} />
                </em>
              </span>
            </button>
          ))}
        </div>
        <div className="map-instruction">
          <Icon name="sparkle" size={18} /> Elige una región con clic, <kbd>Tab</kbd> o{" "}
          <kbd>Enter</kbd>.
        </div>
      </div>
    </section>
  );
}

function OceanCleanupGame({
  onClose,
  onCollect,
  onSpeakingChange,
}: {
  onClose: () => void;
  onCollect: (id: string) => void;
  onSpeakingChange: (speaking: boolean) => void;
}) {
  const [selected, setSelected] = useState<(typeof cleanupItems)[number] | null>(null);
  const [identified, setIdentified] = useState<string[]>([]);
  const [collected, setCollected] = useState<string[]>([]);
  const [paused, setPaused] = useState(false);
  const [listOpen, setListOpen] = useState(false);
  const [narratedText, setNarratedText] = useState("");
  const trashTotal = cleanupItems.filter((item) => item.type === "trash").length;
  const complete = collected.length === trashTotal;

  const narrate = (text: string) => {
    setNarratedText(text);
    if (!("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();
    const message = new SpeechSynthesisUtterance(text);
    configureSpeechMessage(message);
    message.onstart = () => onSpeakingChange(true);
    message.onend = () => onSpeakingChange(false);
    message.onerror = () => onSpeakingChange(false);
    window.speechSynthesis.speak(message);
  };

  const collectSelected = () => {
    if (!selected || selected.type !== "trash") return;
    setCollected((current) => [...current, selected.id]);
    onCollect(selected.id);
    setSelected(null);
  };

  const identifyItem = (item: (typeof cleanupItems)[number]) => {
    setSelected(item);
    setNarratedText("");
    if (item.type === "trash" && !identified.includes(item.id)) {
      setIdentified((current) => [...current, item.id]);
    }
  };

  return (
    <div
      className="cleanup-backdrop"
      role="dialog"
      aria-modal="true"
      aria-labelledby="cleanup-title"
    >
      <article
        className={`cleanup-game${complete ? " ocean-clean" : ""}${paused ? " cleanup-paused" : ""}`}
      >
        <header className="cleanup-toolbar">
          <button onClick={onClose}>
            <Icon name="arrow" size={20} /> Salir del juego
          </button>
          <div>
            <span className="kicker">MISIÓN DE GUARDIANES</span>
            <h2 id="cleanup-title">¡Salvemos el océano!</h2>
          </div>
          <div className="cleanup-controls">
            <button onClick={() => setListOpen(true)}>
              <Icon name="book" size={18} /> Lista accesible
            </button>
            <button onClick={() => setPaused(!paused)} aria-pressed={paused}>
              <span aria-hidden="true">{paused ? "▶" : "Ⅱ"}</span> {paused ? "Reanudar" : "Pausar"}
            </button>
          </div>
        </header>

        <div className="cleanup-progress-area">
          <div className="cleanup-progress-copy">
            <strong>{complete ? "¡Océano limpio!" : "Busca los residuos"}</strong>
            <span>
              {identified.length} identificados · {collected.length} recogidos
            </span>
          </div>
          <div
            className="cleanup-progress"
            role="progressbar"
            aria-valuemin={0}
            aria-valuemax={trashTotal}
            aria-valuenow={collected.length}
            aria-label="Progreso de limpieza"
          >
            <span style={{ width: `${(collected.length / trashTotal) * 100}%` }} />
          </div>
          <div className="guardian-badges" aria-label="Insignias de guardián marino">
            {[2, 4, 5].map((goal, index) => (
              <span key={goal} className={collected.length >= goal ? "earned" : ""}>
                <Icon name={index === 0 ? "leaf" : index === 1 ? "heart" : "sparkle"} size={17} />
                <small>{["Observador", "Protector", "Guardián"][index]}</small>
              </span>
            ))}
          </div>
        </div>

        <div
          className="cleanup-scene"
          aria-label="Escenario submarino con residuos y elementos naturales"
        >
          <div className="cleanup-rays" />
          <div className="cleanup-nature" aria-hidden="true">
            <i />
            <i />
            <i />
            <b />
            <b />
          </div>
          {cleanupItems.map((item) =>
            collected.includes(item.id) ? null : (
              <button
                key={item.id}
                className={`cleanup-item cleanup-${item.id} ${item.type}`}
                onClick={() => identifyItem(item)}
                aria-label={`Seleccionar ${item.name}. ${item.type === "trash" ? "Posible residuo" : "Elemento natural"}`}
              >
                <span className="cleanup-item-name">{item.name}</span>
                {item.id === "game-fish" ? (
                  <AnimalIllustration kind="angelfish" color="#263B73" />
                ) : item.id === "game-turtle" ? (
                  <AnimalIllustration kind="turtle" color="#80dece" />
                ) : item.id === "game-coral" ? (
                  <span className="cleanup-coral" aria-hidden="true">
                    <i />
                    <i />
                    <i />
                  </span>
                ) : item.id === "game-seaweed" ? (
                  <span className="cleanup-seaweed" aria-hidden="true">
                    <i />
                    <i />
                    <i />
                  </span>
                ) : (
                  <span className={`waste-shape waste-${item.id}`} aria-hidden="true">
                    {item.id === "net" ? "×" : item.id === "can" ? "≡" : ""}
                  </span>
                )}
              </button>
            ),
          )}
          <div className="cleanup-floor" />
          {!complete && (
            <div className="cleanup-instruction">
              <Icon name="sparkle" size={18} />
              Selecciona un objeto. Primero descubre qué es y luego decide.
            </div>
          )}
          {complete && (
            <div className="cleanup-finish" role="status" aria-live="polite">
              <span>
                <Icon name="sparkle" size={30} />
              </span>
              <h3>¡Misión cumplida, guardián!</h3>
              <p>¡Cada pequeña acción ayuda a proteger nuestro gran océano!</p>
              <button
                onClick={() => {
                  setCollected([]);
                  setIdentified([]);
                  setSelected(null);
                }}
              >
                Jugar otra vez
              </button>
            </div>
          )}
        </div>

        {selected && (
          <div className={`cleanup-info ${selected.type}`} role="status" aria-live="polite">
            <span className="cleanup-info-icon">
              <Icon name={selected.type === "trash" ? "trash" : "check"} size={28} />
            </span>
            <div>
              <span className="kicker">
                {selected.type === "trash" ? "RESIDUO ENCONTRADO" : "AMIGO DEL ECOSISTEMA"}
              </span>
              <h3>{selected.name}</h3>
              <p>{selected.explanation}</p>
              <button
                className="narrate-button"
                onClick={() => narrate(`${selected.name}. ${selected.explanation}`)}
              >
                <Icon name="play" size={16} /> Escuchar explicación
              </button>
              {narratedText && (
                <p className="live-audio-transcript" role="status" aria-live="polite">
                  Transcripción de audio: [{narratedText}]
                </p>
              )}
            </div>
            <div className="cleanup-info-actions">
              {selected.type === "trash" ? (
                <button className="collect-button" onClick={collectSelected}>
                  <Icon name="check" size={19} /> Recoger
                </button>
              ) : (
                <strong>
                  <Icon name="check" size={19} /> Déjalo en su hogar
                </strong>
              )}
              <button onClick={() => setSelected(null)}>Seguir explorando</button>
            </div>
          </div>
        )}

        {listOpen && (
          <div className="cleanup-list-backdrop" onClick={() => setListOpen(false)}>
            <aside
              className="cleanup-list"
              role="dialog"
              aria-modal="true"
              aria-labelledby="cleanup-list-title"
              onClick={(event) => event.stopPropagation()}
            >
              <div className="friends-header">
                <div>
                  <span className="kicker">ALTERNATIVA DE LISTA</span>
                  <h2 id="cleanup-list-title">Elementos del escenario</h2>
                  <p>Selecciona cada elemento con Tab y Enter.</p>
                </div>
                <button onClick={() => setListOpen(false)} aria-label="Cerrar lista">
                  <Icon name="close" />
                </button>
              </div>
              <ul>
                {cleanupItems.map((item) => (
                  <li key={item.id} className={collected.includes(item.id) ? "collected" : ""}>
                    <span>
                      <Icon name={item.type === "trash" ? "trash" : "leaf"} size={21} />
                    </span>
                    <div>
                      <strong>{item.name}</strong>
                      <small>
                        {collected.includes(item.id)
                          ? "Recogido"
                          : item.type === "trash"
                            ? "Revisar residuo"
                            : "Elemento natural"}
                      </small>
                    </div>
                    <button
                      disabled={collected.includes(item.id)}
                      onClick={() => {
                        identifyItem(item);
                        setListOpen(false);
                      }}
                    >
                      {collected.includes(item.id) ? "Listo" : "Identificar"}
                    </button>
                  </li>
                ))}
              </ul>
            </aside>
          </div>
        )}
      </article>
    </div>
  );
}

function OceanAmbient({ variant }: { variant: "hero" | "reef" | "guardian" }) {
  return (
    <div className={`ocean-ambient ocean-ambient-${variant}`} aria-hidden="true">
      <span className="ambient-caustics" />
      <span className="ambient-current ambient-current-one" />
      <span className="ambient-current ambient-current-two" />
      <span className="ambient-motes ambient-motes-one" />
      <span className="ambient-motes ambient-motes-two" />
      <span className="ambient-bubble-stream ambient-bubble-stream-one" />
      <span className="ambient-bubble-stream ambient-bubble-stream-two" />
      <span className="ambient-fish ambient-fish-one" />
      <span className="ambient-fish ambient-fish-two" />
      <span className="ambient-fish ambient-fish-three" />
    </div>
  );
}

function HeroScene() {
  return (
    <div
      className="hero-scene"
      role="img"
      aria-label="Mundo submarino de fantasía con las diez especies oficiales del catálogo de OCEANÍA."
    >
      <div className="light-rays" />
      <OceanAmbient variant="hero" />
      <span className="hero-bubble hb1" />
      <span className="hero-bubble hb2" />
      <span className="hero-bubble hb3" />
      <div className="hero-turtle">
        <AnimalIllustration kind="turtle" color="#76dec5" />
      </div>
      <div className="hero-octopus">
        <AnimalIllustration kind="braincoral" color="#F6A6B2" />
      </div>
      <div className="hero-fish fish-one">
        <AnimalIllustration kind="parrotfish" color="#FFD166" />
      </div>
      <div className="hero-fish fish-two">
        <AnimalIllustration kind="dolphin" color="#8ed2e8" />
      </div>
      <div className="hero-extra hero-hawksbill">
        <AnimalIllustration kind="hawksbill" color="#E9A23B" />
      </div>
      <div className="hero-extra hero-grouper">
        <AnimalIllustration kind="grouper" color="#A97C50" />
      </div>
      <div className="hero-extra hero-angelfish">
        <AnimalIllustration kind="angelfish" color="#344978" />
      </div>
      <div className="hero-extra hero-urchin">
        <AnimalIllustration kind="urchin" color="#332B62" />
      </div>
      <div className="sea-floor">
        <i />
        <i />
        <i />
      </div>
      <b className="hero-coral-staghorn">
        <AnimalIllustration kind="staghorn" color="#FF8A65" />
      </b>
      <b className="hero-coral-fan">
        <AnimalIllustration kind="seafan" color="#B58AE0" />
      </b>
    </div>
  );
}

function OceanExplorer({
  paused,
  ambienceOn,
  discovered,
  onPause,
  onToggleAmbience,
  onHome,
  onSelect,
  onOpenList,
}: {
  paused: boolean;
  ambienceOn: boolean;
  discovered: string[];
  onPause: () => void;
  onToggleAmbience: () => void;
  onHome: () => void;
  onSelect: (animal: (typeof animalData)[number]) => void;
  onOpenList: () => void;
}) {
  const [showTranscript, setShowTranscript] = useState(false);
  useEffect(() => {
    if (!ambienceOn) setShowTranscript(false);
  }, [ambienceOn]);

  return (
    <section
      className={`ocean-explorer${paused ? " ocean-paused" : ""}`}
      aria-labelledby="ocean-title"
    >
      <div className="ocean-depth">
        <div className="ocean-sunbeams" />
        <span className="ocean-particle particle-1" />
        <span className="ocean-particle particle-2" />
        <span className="ocean-particle particle-3" />
        <span className="ocean-bubbles bubbles-a" />
        <span className="ocean-bubbles bubbles-b" />
        <div className="distant-rocks" />
        <div className="ocean-plants" aria-hidden="true">
          <i />
          <i />
          <i />
          <i />
          <b />
          <b />
        </div>
      </div>

      <div className="ocean-toolbar">
        <button className="ocean-home" onClick={onHome}>
          <Icon name="arrow" size={20} /> Volver al inicio
        </button>
        <div className="ocean-title">
          <span className="kicker">MODO EXPLORACIÓN</span>
          <h1 id="ocean-title">Encuentra a los amigos del océano</h1>
          <p>Selecciona un animal o usa la lista accesible.</p>
        </div>
        <div className="explore-sound-controls">
          <button
            className={`ambient-toggle${ambienceOn ? " playing" : ""}`}
            onClick={onToggleAmbience}
            aria-pressed={ambienceOn}
          >
            <Icon name={ambienceOn ? "mute" : "volume"} size={20} />
            {ambienceOn ? "Detener sonido ambiente" : "Activar sonido ambiente"}
          </button>
          <button className="pause-ocean" onClick={onPause} aria-pressed={paused}>
            <span aria-hidden="true">{paused ? "▶" : "Ⅱ"}</span>
            {paused ? "Reanudar" : "Pausar movimiento"}
          </button>
          <button
            className="transcript-toggle"
            onClick={() => setShowTranscript(!showTranscript)}
            aria-expanded={showTranscript}
            aria-controls="explorer-audio-transcript"
            disabled={!ambienceOn}
          >
            <Icon name="book" size={18} /> Transcripción
          </button>
        </div>
      </div>
      {ambienceOn && showTranscript && (
        <div
          id="explorer-audio-transcript"
          className="live-audio-transcript explorer-transcript"
          role="status"
          aria-live="polite"
        >
          Transcripción de audio: [Sonido ambiente: oleaje marino suave con burbujas ascendentes y
          tonos relajantes bajo el agua.]
        </div>
      )}

      <div className="swimming-animals" aria-label="Animales que puedes descubrir">
        {animalData.map((animal) => (
          <button
            key={animal.kind}
            className={`swimming-animal animal-${animal.kind}`}
            onClick={() => onSelect(animal)}
            aria-label={`Conocer a ${animal.name}, ${animal.scientific}${discovered.includes(animal.kind) ? ", ya descubierto" : ""}`}
          >
            <span className="animal-name-tag">
              <strong>{animal.name}</strong>
              <small lang="la">{animal.scientific}</small>
            </span>
            <AnimalIllustration kind={animal.kind} color={animal.color} />
            {discovered.includes(animal.kind) && (
              <span className="discovered-mark" aria-hidden="true">
                ✓
              </span>
            )}
          </button>
        ))}
      </div>

      <button className="animals-book-button" onClick={onOpenList}>
        <Icon name="book" size={23} />
        <span>
          <strong>Ver animalitos</strong>
          <small>
            Mis amigos del océano · {discovered.length}/{animalData.length}
          </small>
        </span>
      </button>
      <div className="ocean-hint" role="note">
        <Icon name="sparkle" size={18} />
        Usa <kbd>Tab</kbd> para encontrar cada animal y <kbd>Enter</kbd> para seleccionarlo.
      </div>
    </section>
  );
}

/* ---------- Immersive world stage ---------- */

const worldGuides: Record<
  string,
  {
    hint: string;
    title: string;
    text: string;
    simple: string;
    points: string[];
    simplePoints: string[];
  }
> = {
  coral: {
    hint: "Toca los corales, la anémona, las burbujas y a los animales.",
    title: "Los arrecifes protegen las costas",
    text: "Los arrecifes de coral son como murallas bajo el mar: frenan las olas fuertes y así protegen las playas y los pueblos de la costa. También son el hogar de miles de especies de peces, tortugas y caracoles.",
    simple: "Los arrecifes frenan las olas. Así cuidan las playas. Ahí viven miles de animales.",
    points: [
      "Frenan las olas y cuidan las playas.",
      "Dan casa y comida a miles de especies.",
      "Son delicados: míralos sin tocarlos.",
    ],
    simplePoints: ["Frenan las olas.", "Son casa de muchos animales.", "No los toques."],
  },
  open: {
    hint: "Toca a la tonina, al mero goliat y las burbujas.",
    title: "El océano nos regala oxígeno",
    text: "En el océano viven plantitas diminutas llamadas fitoplancton. Con la luz del sol fabrican oxígeno: ¡gran parte del aire que respiramos viene del mar! También son el alimento de animales enormes.",
    simple: "En el mar hay plantas muy pequeñas. Hacen oxígeno. Nosotros lo respiramos.",
    points: [
      "El fitoplancton hace oxígeno con el sol.",
      "Es alimento para muchas especies del arrecife.",
      "Un mar limpio ayuda a todo el planeta.",
    ],
    simplePoints: [
      "Las plantas pequeñas hacen oxígeno.",
      "Son comida de animales grandes.",
      "Cuidemos el mar.",
    ],
  },
  grass: {
    hint: "Toca las praderas, las burbujas y a los animales.",
    title: "Las praderas limpian el agua",
    text: "Los pastos marinos son plantas que crecen bajo el agua. Sus hojas atrapan la arena y la suciedad para que el agua quede clara, sueltan burbujas de oxígeno y son el alimento favorito de la tortuga verde.",
    simple: "Los pastos marinos limpian el agua. Hacen oxígeno. Son comida de la tortuga.",
    points: [
      "Atrapan la suciedad: el agua queda clara.",
      "Sueltan burbujas de oxígeno.",
      "Alimentan a tortugas y protegen a peces bebé.",
    ],
    simplePoints: ["Limpian el agua.", "Hacen oxígeno.", "Dan comida."],
  },
  rock: {
    hint: "Toca al mero goliat, los corales, las cuevas y las burbujas.",
    title: "Las rocas son refugios seguros",
    text: "Las rocas y las cuevas son escondites para muchos animales. Ahí descansan, se protegen de los peligros y cuidan a sus crías. Por eso hay que dejar las piedras y las conchas en su lugar.",
    simple: "Las rocas son escondites. Ahí los animales descansan y se protegen.",
    points: [
      "Son escondites para descansar.",
      "Protegen de los peligros.",
      "Deja piedras y conchas en su lugar.",
    ],
    simplePoints: ["Son escondites.", "Protegen a los animales.", "No te lleves las conchas."],
  },
};

const coralFacts: Record<string, string> = {
  "coral-fan": "Los corales son animales, ¡no plantas!",
  "coral-branch": "Un coral crece solo un poquito cada año. Por eso hay que cuidarlo.",
  "coral-brain": "El coral cerebro puede vivir cientos de años.",
  "coral-tube": "Los corales de tubo atrapan comida diminuta con sus tentáculos.",
};

const bubbleFacts: Record<string, string> = {
  coral: "Las burbujas suben llevando aire hacia la superficie.",
  open: "Las olas mezclan el aire con el agua del océano.",
  grass: "Esta burbuja tenía oxígeno hecho por los pastos marinos.",
  rock: "El mero goliat respira el oxígeno del agua con sus branquias.",
};

const mobileWorldObjects: Record<
  WorldTheme,
  { id: string; name: string; label: string; kind?: string; icon?: IconName }[]
> = {
  coral: [
    {
      id: "coral-fan",
      name: "Coral abanico",
      label: "Tocar coral abanico",
      kind: "seafan",
    },
    {
      id: "coral-branch",
      name: "Coral ramificado",
      label: "Tocar coral ramificado",
      kind: "staghorn",
    },
    {
      id: "anemone",
      name: "Anémona",
      label: "Tocar anémona",
      icon: "leaf",
    },
    {
      id: "coral-brain",
      name: "Coral cerebro",
      label: "Tocar coral cerebro",
      kind: "braincoral",
    },
  ],
  open: [],
  grass: [
    {
      id: "meadow-left",
      name: "Pradera izquierda",
      label: "Tocar pradera marina izquierda",
      icon: "leaf",
    },
    {
      id: "meadow-right",
      name: "Pradera derecha",
      label: "Tocar pradera marina derecha",
      icon: "leaf",
    },
    {
      id: "meadow-far-right",
      name: "Pradera lejana",
      label: "Tocar pradera marina lejana",
      icon: "leaf",
    },
  ],
  rock: [
    {
      id: "cave-left",
      name: "Cueva de estrellas",
      label: "Explorar cueva de estrellas",
      icon: "sparkle",
    },
    {
      id: "cave-right",
      name: "Cueva de conchas",
      label: "Explorar cueva de conchas",
      icon: "book",
    },
  ],
};

const reactionStyle: Record<string, string> = {
  dolphin: "spin",
  grouper: "gulp",
};

function HabitatStage({
  habitat,
  index,
  paused,
  soundOn,
  showTranscript,
  simpleLanguage,
  notify,
  speak,
  speaking,
  stopSpeaking,
  onOpenAnimal,
}: {
  habitat: (typeof habitats)[number];
  index: number;
  paused: boolean;
  soundOn: boolean;
  showTranscript: boolean;
  simpleLanguage: boolean;
  notify: (title: string, message?: string, tone?: ToastTone) => void;
  speak: (text: string) => void;
  speaking: boolean;
  stopSpeaking: () => void;
  onOpenAnimal: (animal: (typeof animalData)[number]) => void;
}) {
  const stageRef = useRef<HTMLDivElement>(null);
  const guideHeadingRef = useRef<HTMLHeadingElement>(null);
  const timers = useRef<number[]>([]);
  const [spots, setSpots] = useState<SpotCounts>({});
  const [animalFx, setAnimalFx] = useState<Record<string, number>>({});
  const [travel, setTravel] = useState<Record<string, string>>({});
  const [guideOpen, setGuideOpen] = useState(false);
  const guide = worldGuides[habitat.type];
  const guideText = simpleLanguage ? guide.simple : guide.text;
  const guidePoints = simpleLanguage ? guide.simplePoints : guide.points;

  useEffect(() => () => timers.current.forEach((timer) => window.clearTimeout(timer)), []);
  useEffect(() => {
    if (guideOpen) guideHeadingRef.current?.focus();
  }, [guideOpen]);

  const later = (fn: () => void, ms: number) => {
    timers.current.push(window.setTimeout(fn, ms));
  };
  const sound = (effect: SoundEffect, wait = 0) => {
    if (!soundOn) return;
    if (wait) later(() => playEffect(effect), wait);
    else playEffect(effect);
  };

  // Sends an animal to a scenery spot (measured on screen), then lets it swim back.
  const moveAnimal = (kind: string, spot: string, returnAfter: number) => {
    const stage = stageRef.current;
    const animal = stage?.querySelector<HTMLElement>(`[data-animal="${kind}"]`);
    const target = stage?.querySelector(`[data-spot="${spot}"] .hotspot-area`);
    if (!animal || !target) return;
    const from = animal.getBoundingClientRect();
    const to = target.getBoundingClientRect();
    const dx = to.left + to.width / 2 - (from.left + from.width / 2);
    const dy = to.top + to.height * 0.28 - (from.top + from.height / 2);
    setTravel((current) => ({ ...current, [kind]: `${Math.round(dx)}px ${Math.round(dy)}px` }));
    later(
      () =>
        setTravel((current) => {
          const next = { ...current };
          delete next[kind];
          return next;
        }),
      returnAfter,
    );
  };

  const onSpot = (id: string) => {
    const count = (spots[id] ?? 0) + 1;
    setSpots((current) => ({ ...current, [id]: count }));
    const coralKind = id.replace(/-\d+$/, "");
    if (coralKind in coralFacts) {
      sound("bubbles");
      notify("¡Burbujas del coral!", coralFacts[coralKind]);
    } else if (id === "anemone") {
      moveAnimal("parrotfish", "anemone", 6000);
      sound("swish");
      notify(
        "¡El pez loro explora el arrecife!",
        "Busca algas entre los corales y ayuda a mantener limpio este ecosistema.",
      );
    } else if (id.startsWith("meadow")) {
      moveAnimal("turtle", id, 7000);
      sound("bubbles");
      sound("munch", 1500);
      notify(
        "¡Burbujas de oxígeno!",
        "La pradera suelta oxígeno y la tortuga verde viene a comer.",
      );
    } else if (id.startsWith("bubble")) {
      sound("pop");
      notify("¡Pop!", bubbleFacts[habitat.type]);
    } else if (id.startsWith("cave")) {
      sound("chime");
      notify(
        count % 2 === 1 ? "¡Salieron estrellas de mar!" : "¡Salieron conchas!",
        count % 2 === 1
          ? "Las cuevas son un refugio seguro para ellas."
          : "Las conchas pueden ser la casa de un caracol o un cangrejo.",
      );
    }
  };

  const onAnimal = (animal: (typeof animalData)[number]) => {
    setAnimalFx((current) => ({ ...current, [animal.kind]: (current[animal.kind] ?? 0) + 1 }));
    if (animal.kind === "dolphin") {
      sound("swish");
      notify("¡Qué giro tan rápido!", "Las toninas juegan, saltan y nadan en grupo.");
    } else if (animal.kind === "grouper") {
      sound("munch", 600);
      notify(
        "¡El mero salió de su cueva!",
        "Los refugios rocosos son importantes para el mero goliat.",
      );
    } else {
      sound("pop");
      notify(
        `¡Hola, soy la ${animal.name.toLowerCase()}!`,
        habitat.type === "grass" ? "Toca la pradera marina y vendré a comer." : animal.fact,
      );
    }
  };

  return (
    <div ref={stageRef} className={`habitat-panorama${paused ? " habitat-paused" : ""}`}>
      <WorldScenery theme={habitat.type as WorldTheme} spots={spots} onSpot={onSpot} />
      <div className="world-heading">
        <div className="world-title-row">
          <span className="world-number">MUNDO {index + 1}</span>
          <h2 id="habitat-world-title">{habitat.name}</h2>
        </div>
        <div className="world-guide-actions">
          <button
            className="world-guide-button"
            onClick={() => setGuideOpen(!guideOpen)}
            aria-expanded={guideOpen}
            aria-controls="world-guide"
          >
            <Icon name="sparkle" size={17} /> ¿En qué ayuda este mundo?
          </button>
          <button
            className="world-listen"
            onClick={() =>
              speaking
                ? stopSpeaking()
                : speak(`${guide.title}. ${guideText} ${guidePoints.join(" ")}`)
            }
            aria-label={speaking ? "Detener voz" : "Escuchar en qué ayuda este mundo"}
            aria-pressed={speaking}
          >
            <Icon name={speaking ? "mute" : "volume"} size={18} />
            <span>{speaking ? "Detener voz" : "Escuchar"}</span>
          </button>
        </div>
        <p className="world-hint">
          <Icon name="sparkle" size={14} /> {guide.hint}
        </p>
        {soundOn && showTranscript && (
          <div
            id="habitat-audio-transcript"
            className="live-audio-transcript habitat-transcript"
            role="status"
            aria-live="polite"
          >
            Transcripción de audio: {habitatAudioTranscripts[habitat.type]}
          </div>
        )}
      </div>

      <div className="mobile-habitat-bubbles" aria-label="Burbujas interactivas">
        {["bubble-1", "bubble-2", "bubble-3"].map((id, bubbleIndex) => (
          <button
            key={id}
            type="button"
            aria-label={`Burbuja interactiva ${bubbleIndex + 1}: tocar para reventar`}
            onClick={() => onSpot(id)}
          >
            <span aria-hidden="true" />
          </button>
        ))}
      </div>

      <div className="habitat-swimmers">
        {habitat.animals.map((kind, position) => {
          const animal = animalData.find((item) => item.kind === kind)!;
          const count = animalFx[kind] ?? 0;
          const classes = [
            "habitat-animal",
            `habitat-animal-${position + 1}`,
            `resident-${kind}`,
            travel[kind] ? "is-traveling" : "",
          ]
            .filter(Boolean)
            .join(" ");
          return (
            <div key={kind} data-animal={kind} className={classes}>
              <button
                className="animal-hit"
                onClick={() => onAnimal(animal)}
                aria-label={`${animal.name}: tócalo para ver qué hace`}
              >
                <i
                  key={count}
                  className={`resident-art${count ? ` fx-${reactionStyle[kind] ?? "hop"}` : ""}`}
                  style={travel[kind] ? { translate: travel[kind] } : undefined}
                >
                  <AnimalIllustration kind={animal.kind} color={animal.color} />
                </i>
                {kind === "grouper" && count > 0 && (
                  <i key={`plankton-${count}`} className="fx-plankton">
                    {Array.from({ length: 9 }, (_, dot) => (
                      <i key={dot} style={{ "--i": dot } as React.CSSProperties} />
                    ))}
                  </i>
                )}
              </button>
              <button
                className="animal-profile-link"
                onClick={() => onOpenAnimal(animal)}
                aria-label={`Abrir la ficha de ${animal.name}`}
              >
                <Icon name="book" size={14} /> {animal.name}
              </button>
            </div>
          );
        })}
      </div>

      <div className="mobile-habitat-floor" aria-label="Elementos interactivos del fondo marino">
        <span className="mobile-seabed" aria-hidden="true" />
        {mobileWorldObjects[habitat.type as WorldTheme].map((item) => (
          <button
            key={item.id}
            type="button"
            aria-label={item.label}
            onClick={() => onSpot(item.id)}
          >
            <span aria-hidden="true">
              {item.kind ? (
                <AnimalIllustration kind={item.kind} color="#f0c26b" />
              ) : (
                <Icon name={item.icon ?? "sparkle"} size={34} />
              )}
            </span>
            <small>{item.name}</small>
          </button>
        ))}
      </div>

      {guideOpen && (
        <aside id="world-guide" className="world-guide" aria-labelledby="world-guide-title">
          <button
            className="world-guide-close"
            onClick={() => setGuideOpen(false)}
            aria-label="Cerrar explicación"
          >
            <Icon name="close" size={18} />
          </button>
          <span className="kicker">¿EN QUÉ AYUDA ESTE MUNDO?</span>
          <h3 id="world-guide-title" ref={guideHeadingRef} tabIndex={-1}>
            {guide.title}
          </h3>
          <p>{guideText}</p>
          <ul>
            {guidePoints.map((point) => (
              <li key={point}>
                <span aria-hidden="true">
                  <Icon name="check" size={15} />
                </span>
                {point}
              </li>
            ))}
          </ul>
          <button
            className="world-guide-listen"
            onClick={() =>
              speaking
                ? stopSpeaking()
                : speak(`${guide.title}. ${guideText} ${guidePoints.join(" ")}`)
            }
            aria-pressed={speaking}
          >
            <Icon name={speaking ? "mute" : "volume"} size={18} />{" "}
            {speaking ? "Detener voz" : "Escuchar en voz alta"}
          </button>
        </aside>
      )}
    </div>
  );
}

/* ---------- Entrance curtain: fantasy bubbles rising for up to 4 seconds ---------- */

const CURTAIN_MS = 4000;

function BubbleCurtain({ initial, sound }: { initial: boolean; sound: boolean }) {
  const [done, setDone] = useState(false);
  const bubbles = useMemo(
    () =>
      Array.from({ length: 30 }, (_, i) => {
        const tier = i % 3; // small, medium, large
        const size = [12 + (i % 5) * 3, 28 + (i % 4) * 5, 56 + (i % 3) * 12][tier];
        return {
          size,
          left: (i * 37 + (i % 4) * 9) % 100,
          delay: ((i * 0.13) % 1.1).toFixed(2),
          duration: (2.2 + ((i * 0.17) % 0.6)).toFixed(2),
          tier,
        };
      }),
    [],
  );
  useEffect(() => {
    if (sound) playBubbleIntro(3.6);
    const timer = window.setTimeout(() => setDone(true), CURTAIN_MS);
    const dismissOnScroll = () => {
      if (window.scrollY > 40) setDone(true);
    };
    window.addEventListener("scroll", dismissOnScroll, { passive: true });
    return () => {
      window.clearTimeout(timer);
      window.removeEventListener("scroll", dismissOnScroll);
    };
    // Runs once per curtain; a new curtain is mounted with a new key.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  if (done) return null;
  return (
    <div className={`bubble-curtain${initial ? " is-initial" : ""}`} aria-hidden="true">
      {bubbles.map((bubble, i) => (
        <i
          key={i}
          className={`curtain-bubble tier-${bubble.tier}`}
          style={{
            left: `${bubble.left}%`,
            width: bubble.size,
            height: bubble.size,
            animationDelay: `${bubble.delay}s`,
            animationDuration: `${bubble.duration}s`,
          }}
        />
      ))}
    </div>
  );
}

function SpeciesCapsule({
  animal,
  details,
  onSpeakingChange,
}: {
  animal: (typeof animalData)[number];
  details: (typeof animalDetails)[string];
  onSpeakingChange: (speaking: boolean) => void;
}) {
  const [playing, setPlaying] = useState(false);
  const [caption, setCaption] = useState(0);
  const timers = useRef<number[]>([]);
  const captions = [`Hola, soy ${animal.name}.`, details.intro, `${details.home} ${details.help}`];
  const transcript = captions.join(" ");

  const stop = () => {
    timers.current.forEach(window.clearTimeout);
    timers.current = [];
    window.speechSynthesis?.cancel();
    onSpeakingChange(false);
    setPlaying(false);
    setCaption(0);
  };
  useEffect(() => stop, []);

  const play = () => {
    stop();
    setPlaying(true);
    captions.forEach((_, index) => {
      timers.current.push(window.setTimeout(() => setCaption(index), index * 4300));
    });
    timers.current.push(window.setTimeout(() => setPlaying(false), captions.length * 4300));
    if ("speechSynthesis" in window) {
      const message = new SpeechSynthesisUtterance(transcript);
      configureSpeechMessage(message);
      message.onstart = () => onSpeakingChange(true);
      message.onend = () => {
        setPlaying(false);
        onSpeakingChange(false);
      };
      message.onerror = () => {
        setPlaying(false);
        onSpeakingChange(false);
      };
      window.speechSynthesis.speak(message);
    }
  };

  return (
    <section
      className={`species-capsule${playing ? " is-playing" : ""}`}
      aria-labelledby="capsule-title"
    >
      <div className="capsule-scene" aria-hidden="true">
        <span className="capsule-rays" />
        <span className="capsule-animal">
          <AnimalIllustration kind={animal.kind} color={animal.color} />
        </span>
        <i />
        <i />
        <i />
      </div>
      <div className="capsule-content">
        <span className="kicker">CÁPSULA EDUCATIVA ACCESIBLE</span>
        <h3 id="capsule-title">Un minuto con {animal.name}</h3>
        <div className="capsule-subtitles" aria-live="polite" aria-label="Subtítulos">
          <strong>Subtítulos:</strong> {captions[caption]}
        </div>
        <div className="capsule-actions">
          <button onClick={playing ? stop : play}>
            <Icon name={playing ? "mute" : "play"} size={18} />
            {playing ? "Detener cápsula" : "Reproducir cápsula con voz y subtítulos"}
          </button>
        </div>
        <details>
          <summary>Leer la transcripción completa</summary>
          <p>{transcript}</p>
          <p>
            Descripción visual: el personaje ilustrado nada suavemente en una escena submarina con
            rayos de luz y burbujas.
          </p>
        </details>
      </div>
    </section>
  );
}

function MarineBadge({
  kind,
  title,
  unlocked,
}: {
  kind: "reef" | "clean" | "promise" | "super";
  title: string;
  unlocked: boolean;
}) {
  const character: Record<string, { kind: string; color: string }> = {
    reef: { kind: "parrotfish", color: "#38A3A5" },
    clean: { kind: "turtle", color: "#38A3A5" },
    promise: { kind: "dolphin", color: "#62B6CB" },
    super: { kind: "angelfish", color: "#263B73" },
  };
  return (
    <article className={`marine-badge badge-${kind}${unlocked ? " unlocked" : ""}`}>
      <span className="badge-medal" aria-hidden="true">
        <AnimalIllustration kind={character[kind].kind} color={character[kind].color} />
      </span>
      <strong>{title}</strong>
      <small>{unlocked ? "Desbloqueada" : "Por desbloquear"}</small>
    </article>
  );
}

function WhyTenSpecies({ onExplore }: { onExplore: () => void }) {
  return (
    <section className="why-species" aria-labelledby="why-species-title">
      <div className="why-species-copy">
        <span className="kicker">UNA MUESTRA PARA EMPEZAR</span>
        <h2 id="why-species-title">¿Por qué 10 especies del Sistema Arrecifal Veracruzano?</h2>
        <p>
          Elegimos 10 especies clave de las más de 1,271 registradas por CONANP en el PNSAV. Con
          ellas puedes reconocer cómo se conectan los animales, los corales y sus hogares.
        </p>
        <div className="why-pills" aria-label="Resumen del contenido">
          <span>10 especies clave</span>
          <span>4 mundos marinos</span>
          <span>100 % accesible</span>
        </div>
        <div className="why-actions">
          <OceanButton onClick={onExplore}>Ver las 10 especies</OceanButton>
        </div>
      </div>
      <div className="why-species-art" aria-label="Corales ilustrados del catálogo" role="img">
        <OceanAmbient variant="reef" />
        <span className="why-seagrass why-seagrass-one" />
        <span className="why-seagrass why-seagrass-two" />
        <span className="why-staghorn">
          <AnimalIllustration kind="staghorn" color="#FF8A65" />
        </span>
        <span className="why-brain">
          <AnimalIllustration kind="braincoral" color="#F6A6B2" />
        </span>
        <span className="why-fan">
          <AnimalIllustration kind="seafan" color="#B58AE0" />
        </span>
        <span className="why-parrot">
          <AnimalIllustration kind="parrotfish" color="#FFD166" />
        </span>
      </div>
    </section>
  );
}

function GuardianPassport({
  friends,
  friendsTotal,
  cleaned,
  cleanedTotal,
  unlocked,
}: {
  friends: number;
  friendsTotal: number;
  cleaned: number;
  cleanedTotal: number;
  unlocked: boolean;
}) {
  const rows = [
    {
      label: "Amigos descubiertos",
      short: "Amigos",
      value: friends,
      total: friendsTotal,
      icon: "fish",
    },
    {
      label: "Océano limpio",
      short: "Limpio",
      value: cleaned,
      total: cleanedTotal,
      icon: "recycle",
    },
  ] as const;
  return (
    <div
      className={`guardian-passport${unlocked ? " unlocked" : ""}`}
      role="group"
      aria-label="Pasaporte de Guardián"
    >
      <span className="passport-badge" aria-hidden="true">
        <Icon name={unlocked ? "sparkle" : "heart"} size={20} />
      </span>
      {unlocked ? (
        <span className="passport-unlocked">
          <small>Insignia desbloqueada</small>
          <strong>Guardián de Oceanía</strong>
        </span>
      ) : (
        <span className="passport-rows">
          {rows.map((row) => (
            <span key={row.label} className="passport-row">
              <Icon name={row.icon} size={14} />
              <span className="passport-label">
                <span className="passport-long">{row.label}:</span>
                <span className="passport-short" aria-hidden="true">
                  {row.short}
                </span>
              </span>
              <strong>
                {row.value}/{row.total}
              </strong>
              <span className="passport-meter" aria-hidden="true">
                <span style={{ width: `${(row.value / row.total) * 100}%` }} />
              </span>
            </span>
          ))}
        </span>
      )}
    </div>
  );
}

function App() {
  const accessDialogRef = useRef<HTMLDialogElement>(null);
  const statementDialogRef = useRef<HTMLDialogElement>(null);
  const statementTriggerRef = useRef<HTMLButtonElement>(null);
  const reportHeadingRef = useRef<HTMLHeadingElement>(null);
  const skipLinkRef = useRef<HTMLAnchorElement>(null);
  const ambienceRef = useRef<{ stop: () => void } | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeNav, setActiveNav] = useState("Inicio");
  const [homeReturnId, setHomeReturnId] = useState(0);
  const [cleanupOpen, setCleanupOpen] = useState(false);
  const [accessOpen, setAccessOpen] = useState(false);
  const [largeText, setLargeText] = useState(false);
  const [highContrast, setHighContrast] = useState(false);
  const [simpleLanguage, setSimpleLanguage] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [cvdMode, setCvdMode] = useState<CvdMode>("none");
  const [statementOpen, setStatementOpen] = useState(false);
  const [reportOpen, setReportOpen] = useState(false);
  const [reportName, setReportName] = useState("");
  const [reportEmail, setReportEmail] = useState("");
  const [reportSection, setReportSection] = useState("Navegación y teclado");
  const [reportDescription, setReportDescription] = useState("");
  const [reportSent, setReportSent] = useState(false);
  const [reportErrors, setReportErrors] = useState<{
    name?: string;
    email?: string;
    description?: string;
  }>({});
  const [selectedAnimal, setSelectedAnimal] = useState<(typeof animalData)[number] | null>(null);
  const [activityChoice, setActivityChoice] = useState<string | null>(null);
  const [exploring, setExploring] = useState(false);
  const [oceanPaused, setOceanPaused] = useState(false);
  const [animalsListOpen, setAnimalsListOpen] = useState(false);
  const [discovered, setDiscovered] = useState<string[]>([]);
  const [cleanedTrash, setCleanedTrash] = useState<string[]>([]);
  const [showPhoto, setShowPhoto] = useState(false);
  const [photoFailed, setPhotoFailed] = useState(false);
  const [photoLoaded, setPhotoLoaded] = useState(false);
  const [usingLocalTurtlePhoto, setUsingLocalTurtlePhoto] = useState(false);
  const [ambienceOn, setAmbienceOn] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const [guardianName, setGuardianName] = useState("");
  const [guardianPromise, setGuardianPromise] = useState("");
  const [promiseUnlocked, setPromiseUnlocked] = useState(false);
  const [formErrors, setFormErrors] = useState<{ name?: string; promise?: string }>({});
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [backToTopBlocked, setBackToTopBlocked] = useState(false);
  const simplifiedParagraphs = useRef(
    new Map<HTMLParagraphElement, { full: string; simple: string }>(),
  );
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const toastId = useRef(0);
  const notify = (title: string, message?: string, tone: ToastTone = "info") => {
    toastId.current += 1;
    const next = { id: toastId.current, title, message, tone };
    setToasts((current) => [...current.slice(-2), next]);
  };
  const dismissToast = useRef((id: number) =>
    setToasts((current) => current.filter((toast) => toast.id !== id)),
  ).current;
  const [selectedHabitat, setSelectedHabitat] = useState<(typeof habitats)[number] | null>(null);
  const [habitatPaused, setHabitatPaused] = useState(false);
  const [habitatListOpen, setHabitatListOpen] = useState(false);
  const [habitatChallengeDone, setHabitatChallengeDone] = useState(false);
  const [musicOn, setMusicOn] = useState(true);
  const [showHabitatTranscript, setShowHabitatTranscript] = useState(false);
  const viewKey = `${exploring}|${selectedHabitat?.type ?? ""}|${selectedAnimal?.kind ?? ""}|${cleanupOpen}|${reportOpen}`;
  const lastView = useRef(viewKey);
  const [curtain, setCurtain] = useState({ id: 1, initial: true });
  useEffect(() => {
    if (lastView.current === viewKey) return;
    lastView.current = viewKey;
    setCurtain((current) => ({ id: current.id + 1, initial: false }));
  }, [viewKey]);
  const systemReducedMotion = useMemo(
    () => window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    [],
  );
  const motionOff = reducedMotion || systemReducedMotion;
  useEffect(() => {
    document.documentElement.lang = "es";
  }, []);
  useEffect(() => {
    const updateBackToTop = () => {
      setShowBackToTop(window.scrollY > 240);
      const blocked = ["#GuardianesDelMar", "footer"].some((selector) => {
        const element = document.querySelector(selector);
        if (!element) return false;
        const bounds = element.getBoundingClientRect();
        return bounds.top < window.innerHeight && bounds.bottom > 0;
      });
      setBackToTopBlocked(blocked);
    };
    updateBackToTop();
    window.addEventListener("scroll", updateBackToTop, { passive: true });
    window.addEventListener("resize", updateBackToTop);
    return () => {
      window.removeEventListener("scroll", updateBackToTop);
      window.removeEventListener("resize", updateBackToTop);
    };
  }, []);
  useEffect(() => {
    const originals = simplifiedParagraphs.current;
    const restore = () => {
      originals.forEach(({ full, simple }, paragraph) => {
        if (paragraph.isConnected && paragraph.textContent === simple) paragraph.textContent = full;
      });
      originals.clear();
    };
    if (!simpleLanguage) {
      restore();
      return;
    }
    const simplify = () => {
      document.querySelectorAll<HTMLParagraphElement>(".site-shell p").forEach((paragraph) => {
        if (originals.has(paragraph) || paragraph.children.length > 0) return;
        const text = paragraph.textContent?.trim() ?? "";
        if (text.length < 105) return;
        const sentences = text.match(/[^.!?]+[.!?]+/g) ?? [text];
        let short = sentences.slice(0, 2).join(" ").trim();
        if (short.length > 125) short = `${short.slice(0, 122).trimEnd()}…`;
        originals.set(paragraph, { full: text, simple: short });
        paragraph.textContent = short;
      });
    };
    simplify();
    const observer = new MutationObserver(simplify);
    const shell = document.querySelector(".site-shell");
    if (shell) observer.observe(shell, { childList: true, subtree: true });
    return () => {
      observer.disconnect();
      restore();
    };
  }, [simpleLanguage]);
  useEffect(() => {
    const dialog = accessDialogRef.current;
    if (accessOpen && dialog && !dialog.open) dialog.showModal();
    if (!accessOpen && dialog?.open) dialog.close();
  }, [accessOpen]);
  useEffect(() => {
    const dialog = statementDialogRef.current;
    if (statementOpen && dialog && !dialog.open) dialog.showModal();
    if (!statementOpen && dialog?.open) dialog.close();
  }, [statementOpen]);
  useEffect(() => {
    if (reportOpen) reportHeadingRef.current?.focus();
  }, [reportOpen]);
  useEffect(
    () => () => {
      ambienceRef.current?.stop();
      window.speechSynthesis?.cancel();
    },
    [],
  );
  useEffect(() => {
    const closeOverlays = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      setAnimalsListOpen(false);
      setHabitatListOpen(false);
      setSelectedAnimal(null);
      setSelectedHabitat(null);
      setCleanupOpen(false);
      setMenuOpen(false);
      setStatementOpen(false);
    };
    window.addEventListener("keydown", closeOverlays);
    return () => window.removeEventListener("keydown", closeOverlays);
  }, []);
  const worldTheme = (selectedHabitat?.type ?? null) as WorldTheme | null;
  useEffect(() => {
    if (!worldTheme || !musicOn) return;
    const music = startAmbientMusic(worldTheme);
    return () => music?.stop();
  }, [worldTheme, musicOn]);
  useEffect(() => {
    setShowHabitatTranscript(false);
  }, [selectedHabitat?.type]);
  useEffect(() => {
    if (!musicOn) setShowHabitatTranscript(false);
  }, [musicOn]);
  const nav = [
    ["Inicio", "#inicio"],
    ["Explorar", "#inicio"],
    ["Hábitats", "#habitats"],
    ["Cuida el océano", "#guardianes"],
    ["Juega", "#juegos"],
    ["Reportar barrera", "#reporte-accesibilidad"],
  ];

  const speak = (text?: string) => {
    if (!("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();
    const message = new SpeechSynthesisUtterance(
      text ||
        "Bienvenido a Oceanía. Explora animales, conoce sus hogares y aprende a proteger el mar.",
    );
    configureSpeechMessage(message);
    message.onstart = () => setSpeaking(true);
    message.onend = () => setSpeaking(false);
    message.onerror = () => setSpeaking(false);
    window.speechSynthesis.speak(message);
  };
  const stopSpeaking = () => {
    window.speechSynthesis?.cancel();
    setSpeaking(false);
  };
  const toggleAmbience = () => {
    if (ambienceOn) {
      ambienceRef.current?.stop();
      ambienceRef.current = null;
      setAmbienceOn(false);
      notify("Sonido ambiente detenido");
      return;
    }
    ambienceRef.current = startOceanAmbience();
    setAmbienceOn(Boolean(ambienceRef.current));
    notify(
      ambienceRef.current ? "Sonido ambiente activado" : "El sonido no está disponible",
      ambienceRef.current ? "Escucharás olas suaves y burbujas." : undefined,
    );
  };

  const startExploring = () => {
    setReportOpen(false);
    setActiveNav("Explorar");
    setExploring(true);
    window.scrollTo({ top: 0, behavior: motionOff ? "auto" : "smooth" });
  };
  const goHome = () => {
    ambienceRef.current?.stop();
    ambienceRef.current = null;
    window.speechSynthesis?.cancel();
    setAmbienceOn(false);
    setSpeaking(false);
    setExploring(false);
    setReportOpen(false);
    setSelectedAnimal(null);
    setSelectedHabitat(null);
    setAnimalsListOpen(false);
    setHabitatListOpen(false);
    setCleanupOpen(false);
    setAccessOpen(false);
    setStatementOpen(false);
    setMenuOpen(false);
    setActiveNav("Inicio");
    setHomeReturnId((current) => current + 1);
    window.history.replaceState(null, "", "#inicio");
    window.requestAnimationFrame(() => window.scrollTo({ top: 0, behavior: "auto" }));
  };
  const navigateToSection = (
    label: string,
    href: string,
    event?: React.MouseEvent<HTMLElement>,
  ) => {
    setMenuOpen(false);
    setActiveNav(label);

    if (label === "Inicio") {
      event?.preventDefault();
      goHome();
      return;
    }

    if (label === "Explorar") {
      event?.preventDefault();
      setReportOpen(false);
      setSelectedAnimal(null);
      setSelectedHabitat(null);
      setAnimalsListOpen(false);
      setHabitatListOpen(false);
      setCleanupOpen(false);
      setAccessOpen(false);
      setStatementOpen(false);
      startExploring();
      return;
    }

    if (label === "Reportar barrera") {
      event?.preventDefault();
      setReportName((current) => current || guardianName.trim());
      ambienceRef.current?.stop();
      ambienceRef.current = null;
      setAmbienceOn(false);
      setExploring(false);
      setSelectedAnimal(null);
      setSelectedHabitat(null);
      setAnimalsListOpen(false);
      setHabitatListOpen(false);
      setCleanupOpen(false);
      setAccessOpen(false);
      setStatementOpen(false);
      setReportOpen(true);
      window.scrollTo({ top: 0, behavior: motionOff ? "auto" : "smooth" });
      return;
    }

    event?.preventDefault();
    setReportOpen(false);
    setExploring(false);
    setSelectedAnimal(null);
    setSelectedHabitat(null);
    setAnimalsListOpen(false);
    setHabitatListOpen(false);
    setCleanupOpen(false);
    setAccessOpen(false);
    setStatementOpen(false);
    window.setTimeout(() => {
      const element = document.querySelector<HTMLElement>(href);
      element?.scrollIntoView({
        behavior: motionOff ? "auto" : "smooth",
        block: "start",
      });
      window.history.replaceState(null, "", href);
    }, 60);
  };

  const selectAnimal = (animal: (typeof animalData)[number]) => {
    const isNew = !discovered.includes(animal.kind);
    setSelectedAnimal(animal);
    setShowPhoto(false);
    setPhotoFailed(false);
    setPhotoLoaded(false);
    setUsingLocalTurtlePhoto(false);
    setAnimalsListOpen(false);
    if (isNew) {
      setDiscovered((current) => [...current, animal.kind]);
      notify(
        "¡Has descubierto un nuevo amigo marino!",
        `${animal.name} se agregó a tu libro.`,
        "success",
      );
    }
  };
  const selectedDetails = selectedAnimal ? animalDetails[selectedAnimal.kind] : null;
  const selectedSimple = selectedAnimal ? simpleAnimalDetails[selectedAnimal.kind] : null;
  const selectedPhoto = selectedAnimal ? animalPhotos[selectedAnimal.kind] : null;
  const selectedHome = selectedAnimal
    ? habitats.find((habitat) => habitat.type === animalHabitat[selectedAnimal.kind])
    : undefined;
  const factText = (key: FactKey) =>
    simpleLanguage && selectedSimple ? selectedSimple[key] : (selectedDetails?.[key] ?? "");

  const trashTotal = cleanupItems.filter((item) => item.type === "trash").length;
  const guardianUnlocked =
    discovered.length === animalData.length && cleanedTrash.length === trashTotal;
  const guardianCelebrated = useRef(false);
  useEffect(() => {
    if (!guardianUnlocked || guardianCelebrated.current) return;
    guardianCelebrated.current = true;
    notify(
      "¡Eres Guardián de Oceanía!",
      `Descubriste las ${animalData.length} especies y limpiaste el océano. Ganaste tu insignia final.`,
      "celebrate",
    );
    // notify only appends to state; it does not need to be a dependency.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [guardianUnlocked]);

  return (
    <div
      className={`site-shell${largeText ? " large-text" : ""}${highContrast ? " high-contrast" : ""}${simpleLanguage ? " simple-language" : ""}${reducedMotion ? " reduced-motion" : ""}${cvdMode !== "none" ? ` cvd-${cvdMode}` : ""}`}
      data-vision-mode={cvdMode}
    >
      <svg aria-hidden="true" width="0" height="0" style={{ position: "absolute" }}>
        <defs>
          <filter id="cvd-filter-protanopia" colorInterpolationFilters="sRGB">
            <feColorMatrix
              type="matrix"
              values="0.567 0.433 0 0 0
                      0.558 0.442 0 0 0
                      0 0.242 0.758 0 0
                      0 0 0 1 0"
            />
          </filter>
          <filter id="cvd-filter-deuteranopia" colorInterpolationFilters="sRGB">
            <feColorMatrix
              type="matrix"
              values="0.65 0.25 0.1 0 0
                      0.35 0.45 0.2 0 0
                      0.2 0.45 0.75 0 0
                      0 0 0 1 0"
            />
          </filter>
          <filter id="cvd-filter-tritanopia" colorInterpolationFilters="sRGB">
            <feColorMatrix
              type="matrix"
              values="0.8 0.1 0.25 0 0
                      0.15 0.75 0.45 0 0
                      0.15 0.35 0.45 0 0
                      0 0 0 1 0"
            />
          </filter>
        </defs>
      </svg>
      <a ref={skipLinkRef} className="skip-link" href="#contenido">
        Saltar al contenido principal
      </a>
      <header className="navbar">
        <a
          href="#inicio"
          className="logo"
          aria-label="Oceanía, volver al inicio"
          onClick={(event) => {
            event.preventDefault();
            goHome();
          }}
        >
          <span className="logo-mark">
            <OceanLogoMark />
          </span>
          <span>OCEANÍA</span>
        </a>
        <nav
          className={menuOpen ? "nav-links open" : "nav-links"}
          aria-label="Navegación principal"
          onKeyDown={(event) => {
            if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return;
            const links = [...event.currentTarget.querySelectorAll<HTMLAnchorElement>("a")];
            const current = links.indexOf(document.activeElement as HTMLAnchorElement);
            const next =
              event.key === "Home"
                ? 0
                : event.key === "End"
                  ? links.length - 1
                  : (current + (event.key === "ArrowRight" ? 1 : -1) + links.length) % links.length;
            event.preventDefault();
            links[next]?.focus();
          }}
        >
          {nav.map(([label, href]) => (
            <a
              key={label}
              href={href}
              aria-current={activeNav === label ? "page" : undefined}
              onClick={(event) => navigateToSection(label, href, event)}
            >
              {label}
            </a>
          ))}
        </nav>
        <GuardianPassport
          friends={discovered.length}
          friendsTotal={animalData.length}
          cleaned={cleanedTrash.length}
          cleanedTotal={trashTotal}
          unlocked={guardianUnlocked}
        />
        <button
          className="access-button"
          onClick={() => setAccessOpen(true)}
          aria-haspopup="dialog"
          aria-expanded={accessOpen}
        >
          <span aria-hidden="true">●</span> Accesibilidad
        </button>
        <button
          className="menu-button"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Abrir menú"
        >
          <Icon name={menuOpen ? "close" : "menu"} size={25} />
        </button>
      </header>

      <main id="contenido">
        {reportOpen ? (
          <section
            className="accessibility-report report-view"
            id="reporte-accesibilidad"
            aria-labelledby="accessibility-report-title"
          >
            <div className="report-view-toolbar">
              <button type="button" onClick={goHome}>
                <Icon name="arrow" size={20} /> Volver al inicio
              </button>
            </div>
            <div className="accessibility-report-intro">
              <span className="kicker">TU EXPERIENCIA NOS AYUDA</span>
              <h1 ref={reportHeadingRef} id="accessibility-report-title" tabIndex={-1}>
                Reportar una barrera de accesibilidad
              </h1>
              <p>
                Cuéntanos qué te impidió navegar, aprender o jugar. No usamos CAPTCHA ni pruebas
                cognitivas. Revisaremos tu reporte para seguir mejorando OCEANÍA.
              </p>
            </div>
            <form
              className="accessibility-report-form"
              noValidate
              onSubmit={(event) => {
                event.preventDefault();
                const errors: {
                  name?: string;
                  email?: string;
                  description?: string;
                } = {};
                if (!reportName.trim()) errors.name = "Escribe tu nombre.";
                if (!reportEmail.trim()) {
                  errors.email = "Escribe tu correo electrónico.";
                } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(reportEmail.trim())) {
                  errors.email = "Escribe un correo con el formato persona@dominio.com.";
                }
                if (reportDescription.trim().length < 12) {
                  errors.description = "Describe el problema con al menos 12 caracteres.";
                }
                setReportErrors(errors);
                setReportSent(false);
                if (Object.keys(errors).length) {
                  const firstInvalidId = errors.name
                    ? "report-name"
                    : errors.email
                      ? "report-email"
                      : "report-description";
                  window.requestAnimationFrame(() =>
                    document.getElementById(firstInvalidId)?.focus(),
                  );
                  return;
                }
                setReportSent(true);
              }}
            >
              {Object.keys(reportErrors).length > 0 && (
                <div className="report-error-summary" role="alert">
                  <Icon name="close" size={22} />
                  <div>
                    <strong>Revisa los campos marcados</strong>
                    <ul>
                      {reportErrors.name && <li>{reportErrors.name}</li>}
                      {reportErrors.email && <li>{reportErrors.email}</li>}
                      {reportErrors.description && <li>{reportErrors.description}</li>}
                    </ul>
                  </div>
                </div>
              )}
              <div className="report-field">
                <label htmlFor="report-name">Tu nombre *</label>
                <input
                  id="report-name"
                  name="name"
                  type="text"
                  required
                  autoComplete="name"
                  value={reportName}
                  aria-invalid={Boolean(reportErrors.name)}
                  aria-describedby={reportErrors.name ? "report-name-error" : undefined}
                  onChange={(event) => {
                    setReportName(event.target.value);
                    setReportSent(false);
                    if (reportErrors.name) {
                      setReportErrors((current) => ({ ...current, name: undefined }));
                    }
                  }}
                />
                {reportErrors.name && (
                  <span className="form-error" id="report-name-error" role="alert">
                    <Icon name="close" size={16} /> {reportErrors.name}
                  </span>
                )}
              </div>
              <div className="report-field">
                <label htmlFor="report-email">Correo electrónico *</label>
                <input
                  id="report-email"
                  name="email"
                  type="email"
                  required
                  autoComplete="email"
                  value={reportEmail}
                  aria-invalid={Boolean(reportErrors.email)}
                  aria-describedby={`report-email-help${reportErrors.email ? " report-email-error" : ""}`}
                  onChange={(event) => {
                    setReportEmail(event.target.value);
                    setReportSent(false);
                    if (reportErrors.email) {
                      setReportErrors((current) => ({ ...current, email: undefined }));
                    }
                  }}
                />
                <small id="report-email-help">Formato: persona@dominio.com</small>
                {reportErrors.email && (
                  <span className="form-error" id="report-email-error" role="alert">
                    <Icon name="close" size={16} /> {reportErrors.email}
                  </span>
                )}
              </div>
              <div className="report-field report-field-wide">
                <label htmlFor="report-section">Sección donde ocurrió</label>
                <select
                  id="report-section"
                  name="section"
                  value={reportSection}
                  onChange={(event) => {
                    setReportSection(event.target.value);
                    setReportSent(false);
                  }}
                >
                  <option>Navegación y teclado</option>
                  <option>Contraste o daltonismo</option>
                  <option>Lector de pantalla o transcripciones</option>
                  <option>Mundos submarinos o juego de limpieza</option>
                </select>
              </div>
              <div className="report-field report-field-wide">
                <label htmlFor="report-description">Descripción del problema *</label>
                <textarea
                  id="report-description"
                  name="description"
                  required
                  minLength={12}
                  value={reportDescription}
                  aria-invalid={Boolean(reportErrors.description)}
                  aria-describedby={`report-description-help${reportErrors.description ? " report-description-error" : ""}`}
                  onChange={(event) => {
                    setReportDescription(event.target.value);
                    setReportSent(false);
                    if (reportErrors.description) {
                      setReportErrors((current) => ({ ...current, description: undefined }));
                    }
                  }}
                />
                <small id="report-description-help">
                  Explica qué intentabas hacer, qué ocurrió y qué ayuda necesitabas. Mínimo 12
                  caracteres.
                </small>
                {reportErrors.description && (
                  <span className="form-error" id="report-description-error" role="alert">
                    <Icon name="close" size={16} /> {reportErrors.description}
                  </span>
                )}
              </div>
              <button type="submit">
                <Icon name="check" size={20} /> Enviar reporte
              </button>
              {reportSent && (
                <div className="report-success" role="status" aria-live="polite">
                  <Icon name="check" size={22} />
                  <span>
                    <strong>Reporte listo para revisión.</strong> Gracias, {reportName}. Conservamos
                    los datos en pantalla para que puedas confirmar lo enviado.
                  </span>
                </div>
              )}
            </form>
          </section>
        ) : (
          <>
            {exploring ? (
              <OceanExplorer
                paused={oceanPaused}
                ambienceOn={ambienceOn}
                discovered={discovered}
                onPause={() => setOceanPaused(!oceanPaused)}
                onToggleAmbience={toggleAmbience}
                onHome={goHome}
                onSelect={selectAnimal}
                onOpenList={() => setAnimalsListOpen(true)}
              />
            ) : (
              <section
                key={`home-${homeReturnId}`}
                className={`hero${homeReturnId ? " returning-home" : ""}`}
                id="inicio"
              >
                <div className="hero-copy">
                  <div className="eyebrow">
                    <Icon name="sparkle" size={16} /> ODS 4 · Meta 4.7 · Educación ambiental
                  </div>
                  <h1>
                    ¡Bienvenido a <span>OCEANÍA!</span>
                  </h1>
                  <h2>
                    Un mundo por descubrir,
                    <br />
                    un océano por proteger
                  </h2>
                  <p>
                    {simpleLanguage
                      ? "Conoce animales. Mira dónde viven. Aprende a cuidar el mar."
                      : "Descubre animales increíbles, explora sus hogares y aprende cómo proteger el mar."}
                  </p>
                  <div className="hero-actions">
                    <OceanButton onClick={startExploring}>Explorar especies</OceanButton>
                    <OceanButton onClick={() => setCleanupOpen(true)} variant="secondary">
                      Jugar misión
                    </OceanButton>
                  </div>
                  <div className="hero-note">
                    <span>
                      <Icon name="heart" size={15} />
                    </span>{" "}
                    Aprende jugando y explorando
                  </div>
                </div>
                <HeroScene />
                <svg
                  className="wave-divider"
                  viewBox="0 0 1440 32"
                  preserveAspectRatio="none"
                  aria-hidden="true"
                >
                  <path
                    d="M0 12C120 4 240 18 360 10S600 16 720 9S960 17 1080 9S1320 15 1440 8V32H0Z"
                    fill="currentColor"
                  />
                </svg>
              </section>
            )}

            {!exploring && <WhyTenSpecies onExplore={startExploring} />}

            <HabitatsMap
              paused={habitatPaused}
              onPause={() => setHabitatPaused(!habitatPaused)}
              onEnter={(habitat) => {
                setSelectedHabitat(habitat);
                setHabitatChallengeDone(false);
              }}
              onOpenList={() => setHabitatListOpen(true)}
            />

            <section className="section guardians" id="guardianes">
              <div className="guardian-intro">
                <div className="guardian-copy">
                  <span className="kicker">TU MISIÓN ES IMPORTANTE</span>
                  <h2>
                    ¡Conviértete en guardián <em>del océano!</em>
                  </h2>
                  <p>
                    El mar necesita héroes como tú. Cada buena acción ayuda a mantenerlo limpio y
                    lleno de vida.
                  </p>
                </div>
                <div className="guardian-visual">
                  <span className="guardian-sun" />
                  <OceanAmbient variant="guardian" />
                  <div className="guardian-turtle">
                    <AnimalIllustration kind="turtle" color="#66d2b6" />
                  </div>
                  <span className="plant p1" />
                  <span className="plant p2" />
                  <span className="small-bubble sb1" />
                  <span className="small-bubble sb2" />
                </div>
              </div>
              <section className="badge-showcase" aria-labelledby="badges-title">
                <div className="badge-showcase-heading">
                  <span className="kicker">TU COLECCIÓN CRECE CONTIGO</span>
                  <h2 id="badges-title">Colección de insignias marinas</h2>
                  <p>Explora, limpia y cumple tu promesa para iluminar cada medalla.</p>
                </div>
                <div className="marine-badge-grid">
                  <MarineBadge
                    kind="reef"
                    title="Explorador Arrecifal"
                    unlocked={discovered.length >= 4}
                  />
                  <MarineBadge
                    kind="clean"
                    title="Limpiador del Mar"
                    unlocked={cleanedTrash.length === trashTotal}
                  />
                  <MarineBadge kind="promise" title="Guardián Promesa" unlocked={promiseUnlocked} />
                  <MarineBadge
                    kind="super"
                    title="Súper Guardián"
                    unlocked={guardianUnlocked && promiseUnlocked}
                  />
                </div>
              </section>
              <section
                className="guardian-commitment"
                id="GuardianesDelMar"
                aria-labelledby="promise-title"
              >
                <div className="commitment-copy">
                  <span className="commitment-icon" aria-hidden="true">
                    <Icon name="heart" size={30} />
                  </span>
                  <span className="kicker">GUARDIANES DEL MAR</span>
                  <h2 id="promise-title">Escribe tu compromiso con el océano</h2>
                  <p>
                    Tu promesa puede ser pequeña y poderosa. Tus datos no se borrarán si necesitas
                    corregir algo.
                  </p>
                </div>
                <form
                  className="commitment-form"
                  noValidate
                  onSubmit={(event) => {
                    event.preventDefault();
                    const errors: { name?: string; promise?: string } = {};
                    if (!guardianName.trim()) {
                      errors.name = "Escribe tu nombre. Puedes usar tu nombre o un apodo.";
                    }
                    if (guardianPromise.trim().length < 8) {
                      errors.promise =
                        "Escribe una promesa de al menos 8 caracteres. Por ejemplo: usaré menos plástico.";
                    }
                    setFormErrors(errors);
                    if (Object.keys(errors).length) {
                      window.requestAnimationFrame(() => {
                        document
                          .getElementById(errors.name ? "guardian-name" : "guardian-promise")
                          ?.focus();
                      });
                      return;
                    }
                    setPromiseUnlocked(true);
                    notify(
                      "¡Insignia Guardián Promesa desbloqueada!",
                      "Tu compromiso quedó guardado.",
                      "celebrate",
                    );
                  }}
                >
                  <label htmlFor="guardian-name">
                    <span aria-hidden="true">1</span> Tu nombre
                  </label>
                  <input
                    id="guardian-name"
                    name="guardian-name"
                    value={guardianName}
                    onChange={(event) => {
                      setGuardianName(event.target.value);
                      if (formErrors.name)
                        setFormErrors((current) => ({ ...current, name: undefined }));
                    }}
                    autoComplete="name"
                    required
                    maxLength={40}
                    aria-invalid={Boolean(formErrors.name)}
                    aria-describedby={formErrors.name ? "guardian-name-error" : undefined}
                  />
                  {formErrors.name && (
                    <span className="form-error" id="guardian-name-error" role="alert">
                      <Icon name="heart" size={16} /> {formErrors.name}
                    </span>
                  )}
                  <label htmlFor="guardian-promise">
                    <span aria-hidden="true">2</span> Mi promesa para cuidar el mar
                  </label>
                  <textarea
                    id="guardian-promise"
                    name="guardian-promise"
                    value={guardianPromise}
                    onChange={(event) => {
                      setGuardianPromise(event.target.value);
                      if (formErrors.promise) {
                        setFormErrors((current) => ({ ...current, promise: undefined }));
                      }
                    }}
                    required
                    minLength={8}
                    maxLength={180}
                    aria-invalid={Boolean(formErrors.promise)}
                    aria-describedby={`promise-help${formErrors.promise ? " guardian-promise-error" : ""}`}
                  />
                  <small id="promise-help">
                    Ejemplo: usaré mi botella reutilizable y recogeré basura de la playa.
                  </small>
                  {formErrors.promise && (
                    <span className="form-error" id="guardian-promise-error" role="alert">
                      <Icon name="heart" size={16} /> {formErrors.promise}
                    </span>
                  )}
                  <button type="submit">
                    <Icon name="sparkle" size={20} /> Guardar mi compromiso
                  </button>
                </form>
                {promiseUnlocked && (
                  <div className="promise-success" role="status" aria-live="polite">
                    <span className="badge-medal" aria-hidden="true">
                      <AnimalIllustration kind="dolphin" color="#62B6CB" />
                    </span>
                    <div>
                      <strong>Insignia Guardián Promesa Desbloqueada</strong>
                      <p>
                        Gracias, {guardianName}. Tu promesa ayuda a construir un océano más sano.
                      </p>
                    </div>
                  </div>
                )}
              </section>
              <div className="tips-grid">
                <article>
                  <span className="tip-icon coral-bg">
                    <Icon name="trash" size={27} />
                  </span>
                  <div>
                    <small>ACCIÓN 01</small>
                    <h3>No tires basura al mar</h3>
                    <p>Guarda tus residuos hasta encontrar un contenedor.</p>
                  </div>
                </article>
                <article>
                  <span className="tip-icon lavender-bg">
                    <Icon name="heart" size={27} />
                  </span>
                  <div>
                    <small>ACCIÓN 02</small>
                    <h3>Respeta sus hogares</h3>
                    <p>Observa a los animales sin molestarlos ni tocarlos.</p>
                  </div>
                </article>
                <article>
                  <span className="tip-icon yellow-bg">
                    <Icon name="recycle" size={27} />
                  </span>
                  <div>
                    <small>ACCIÓN 03</small>
                    <h3>Usa menos plásticos</h3>
                    <p>Elige botellas y bolsas que puedas usar muchas veces.</p>
                  </div>
                </article>
              </div>
              <div className="ocean-message">
                <span>
                  <Icon name="sparkle" size={26} />
                </span>
                <strong>¡Pequeñas acciones pueden proteger un gran océano!</strong>
                <span>
                  <Icon name="leaf" size={26} />
                </span>
              </div>
            </section>

            <section className="pictogram-section" id="actividad" aria-labelledby="activity-title">
              <div className="section pictogram-inner">
                <div className="section-heading">
                  <span className="kicker">APRENDE CON IMÁGENES</span>
                  <h2 id="activity-title">
                    Elige cómo <em>cuidar el mar</em>
                  </h2>
                  <p id="activity-help">
                    Paso 1 de 1: elige una imagen. Puedes usar el ratón, la tecla Tab y Enter.
                  </p>
                  <button
                    className="listen-button"
                    onClick={() =>
                      speak("Elige cómo cuidar el mar. Selecciona la botella reutilizable.")
                    }
                  >
                    <Icon name="play" size={18} /> Escuchar instrucción
                  </button>
                </div>
                <div className="pictogram-options" role="group" aria-describedby="activity-help">
                  {[
                    ["Botella reutilizable", "bottle", true],
                    ["Bolsa en el mar", "bag", false],
                    ["Basura en la playa", "beach", false],
                  ].map(([label, art, correct]) => (
                    <button
                      key={String(label)}
                      className={activityChoice === label ? "selected" : ""}
                      aria-pressed={activityChoice === label}
                      onClick={() => setActivityChoice(String(label))}
                    >
                      <span className={`pictogram pictogram-${String(art)}`} aria-hidden="true">
                        <CareIllustration kind={art as "bottle" | "bag" | "beach"} />
                      </span>
                      <strong>{label}</strong>
                      <small>
                        {correct ? "Se puede usar muchas veces" : "Esto puede dañar el mar"}
                      </small>
                    </button>
                  ))}
                </div>
                {activityChoice && (
                  <div
                    className={`activity-feedback ${activityChoice === "Botella reutilizable" ? "right" : "try"}`}
                    role="status"
                    aria-live="polite"
                  >
                    <Icon
                      name={activityChoice === "Botella reutilizable" ? "check" : "close"}
                      size={23}
                    />
                    <div>
                      <strong>
                        {activityChoice === "Botella reutilizable"
                          ? "¡Buena elección!"
                          : "Gracias por intentarlo"}
                      </strong>
                      <span>
                        {activityChoice === "Botella reutilizable"
                          ? "Usar una botella muchas veces reduce el plástico."
                          : "Mira las pistas y prueba otra imagen. No pierdes puntos."}
                      </span>
                    </div>
                    <button onClick={() => setActivityChoice(null)}>Repetir</button>
                  </div>
                )}
              </div>
            </section>

            <section className="games-section" id="juegos">
              <div className="game-card">
                <div className="treasure-art">
                  <span className="treasure-glow" />
                  <div className="chest">
                    <div className="chest-lid">✦</div>
                    <div className="chest-body">
                      <span>●</span>
                    </div>
                  </div>
                  <i className="coin co1" />
                  <i className="coin co2" />
                  <i className="starfish">★</i>
                </div>
                <div className="game-copy">
                  <span className="kicker">MISIÓN DE GUARDIANES</span>
                  <h2>
                    ¡Salvemos <em>el océano!</em>
                  </h2>
                  <p>
                    Encuentra los residuos, aprende por qué contaminan y ayuda a devolverle su
                    brillo al océano.
                  </p>
                  <ul
                    className="game-access-list"
                    aria-label="Características accesibles del juego"
                  >
                    <li>
                      <Icon name="check" size={15} /> Sin tiempo límite
                    </li>
                    <li>
                      <Icon name="check" size={15} /> Funciona con teclado
                    </li>
                    <li>
                      <Icon name="check" size={15} /> No necesita sonido
                    </li>
                  </ul>
                  <OceanButton onClick={() => setCleanupOpen(true)}>Comenzar misión</OceanButton>
                </div>
                <div className="game-stats">
                  <div>
                    <strong>5</strong>
                    <span>residuos</span>
                  </div>
                  <div>
                    <strong>∞</strong>
                    <span>diversión</span>
                  </div>
                </div>
              </div>
            </section>
          </>
        )}
      </main>

      <footer>
        <div className="footer-top">
          <div>
            <a
              href="#inicio"
              className="logo footer-logo"
              aria-label="Oceanía, volver al inicio"
              onClick={(event) => {
                event.preventDefault();
                goHome();
              }}
            >
              <span className="logo-mark">
                <OceanLogoMark />
              </span>
              <span>OCEANÍA</span>
            </a>
            <p>Explora, aprende y protege.</p>
          </div>
          <div className="footer-links">
            {nav.slice(1).map(([label, href]) => (
              <a key={href} href={href} onClick={(event) => navigateToSection(label, href, event)}>
                {label}
              </a>
            ))}
            <button
              ref={statementTriggerRef}
              type="button"
              className="footer-link-button"
              onClick={() => setStatementOpen(true)}
            >
              Declaración de accesibilidad
            </button>
          </div>
        </div>
        <div className="footer-bottom">
          <span>Un espacio educativo para conocer y proteger la vida submarina.</span>
          <span>
            Hecho con <Icon name="heart" size={14} /> por nuestro océano
          </span>
        </div>
      </footer>

      <dialog
        ref={statementDialogRef}
        className="accessibility-statement"
        role="dialog"
        aria-modal="true"
        aria-labelledby="accessibility-statement-title"
        onCancel={(event) => {
          event.preventDefault();
          setStatementOpen(false);
        }}
        onClose={() => {
          setStatementOpen(false);
          statementTriggerRef.current?.focus();
        }}
        onClick={(event) => {
          if (event.target === event.currentTarget) setStatementOpen(false);
        }}
      >
        <div className="statement-scroll">
          <div className="statement-header">
            <div>
              <span className="kicker">COMPROMISO CON LA INCLUSIÓN</span>
              <h2 id="accessibility-statement-title">
                Declaración de accesibilidad WCAG 2.2 Nivel AA (55 criterios)
              </h2>
            </div>
            <button
              type="button"
              onClick={() => setStatementOpen(false)}
              aria-label="Cerrar declaración de accesibilidad"
            >
              <Icon name="close" />
              <span>Cerrar</span>
            </button>
          </div>

          <section>
            <h3>Nivel de conformidad alcanzado</h3>
            <p>
              La plataforma educativa OCEANÍA, vinculada con ODS 4 · Meta 4.7, declara conformidad
              completa con los 55 criterios de éxito de los niveles A y AA de WCAG 2.2 del W3C: 31
              criterios de Nivel A y 24 de Nivel AA.
            </p>
          </section>

          <section>
            <h3>Multimedia accesible</h3>
            <p>
              OCEANÍA no utiliza video externo. En su lugar ofrece cápsulas animadas interactivas
              con voz narrativa amigable, subtítulos sincronizados en vivo, transcripción completa y
              descripción visual. Las transcripciones para todos los sonidos ambientales son
              opcionales y están disponibles bajo demanda.
            </p>
          </section>

          <section>
            <h3>Personalización sensorial y cognitiva</h3>
            <ul>
              <li>
                Cinco modos de visión y daltonismo: Visión estándar, Protanopía, Deuteranopía,
                Tritanopía y Acromatopsia.
              </li>
              <li>
                Alto contraste, texto grande, lenguaje sencillo, lectura en voz alta pausable desde
                cualquier vista y pausa total de animaciones.
              </li>
            </ul>
          </section>

          <section>
            <h3>Navegación, formularios y adaptación móvil</h3>
            <ul>
              <li>
                Navegación completa por teclado con anillo de foco visible y sin elementos ocultos
                (WCAG 2.4.11), además de objetivos táctiles de al menos 44 × 44 px (WCAG 2.5.8).
              </li>
              <li>Selección de texto con subrayado y resaltado de alto contraste.</li>
              <li>
                Vista dedicada para reportar barreras, con validación accesible, autocompletado y
                sin solicitar datos redundantes (WCAG 3.3.1–3.3.8).
              </li>
              <li>
                Etiquetado de idioma español e inglés cuando corresponde, y nombres científicos
                marcados en latín (WCAG 3.1.1 y 3.1.2).
              </li>
              <li>Adaptación responsiva (reflow) hasta 320 px (WCAG 1.4.10).</li>
            </ul>
          </section>

          <section>
            <h3>Los 55 criterios de éxito de Nivel A y AA</h3>
            <div
              className="statement-table-wrap"
              tabIndex={0}
              aria-label="Tabla de 55 criterios WCAG"
            >
              <table>
                <caption>
                  Criterios WCAG 2.2 organizados por los principios Perceptible, Operable,
                  Comprensible y Robusto
                </caption>
                <thead>
                  <tr>
                    <th scope="col">Principio</th>
                    <th scope="col">Criterio</th>
                    <th scope="col">Nivel</th>
                    <th scope="col">Aplicación en OCEANÍA</th>
                  </tr>
                </thead>
                <tbody>
                  {wcagCriteria.map(({ principle, criterion, level, application }) => (
                    <tr key={criterion}>
                      <th scope="row">{principle}</th>
                      <td>{criterion}</td>
                      <td>{level}</td>
                      <td>{application}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </div>
      </dialog>

      {showBackToTop && !backToTopBlocked && !reportOpen && (
        <button
          type="button"
          id="btn-volver-arriba"
          onClick={() => {
            setShowBackToTop(false);
            window.scrollTo({ top: 0, behavior: motionOff ? "auto" : "smooth" });
            window.setTimeout(
              () => skipLinkRef.current?.focus({ preventScroll: true }),
              motionOff ? 0 : 500,
            );
          }}
        >
          <span aria-hidden="true">↑</span>
          Volver arriba
        </button>
      )}

      {speaking && (
        <div className="speech-stop-bar" role="status" aria-live="polite">
          <Icon name="volume" size={20} />
          <span>Lectura en voz alta activa</span>
          <button onClick={stopSpeaking}>
            <Icon name="mute" size={18} /> Detener
          </button>
        </div>
      )}

      {cleanupOpen && (
        <OceanCleanupGame
          onClose={() => setCleanupOpen(false)}
          onSpeakingChange={setSpeaking}
          onCollect={(id) =>
            setCleanedTrash((current) => (current.includes(id) ? current : [...current, id]))
          }
        />
      )}

      <dialog
        ref={accessDialogRef}
        className="access-panel"
        aria-labelledby="access-title"
        onCancel={(event) => {
          event.preventDefault();
          setAccessOpen(false);
        }}
        onClick={(event) => {
          if (event.target === event.currentTarget) setAccessOpen(false);
        }}
      >
        <div className="access-scroll">
          <div className="access-header">
            <div>
              <span className="kicker">AJUSTA LA EXPERIENCIA</span>
              <h2 id="access-title">Centro de accesibilidad</h2>
            </div>
            <button onClick={() => setAccessOpen(false)} aria-label="Cerrar accesibilidad">
              <Icon name="close" />
            </button>
          </div>
          <p>Elige las opciones que te ayuden. Puedes cambiarlas cuando quieras.</p>
          <div className="access-options">
            {[
              [
                "Texto grande",
                "Letras más grandes y fáciles de leer",
                largeText,
                setLargeText,
                "A+",
              ],
              [
                "Alto contraste",
                "Colores más oscuros y bordes visibles",
                highContrast,
                setHighContrast,
                "◐",
              ],
              [
                "Lenguaje sencillo",
                "Frases más cortas y directas",
                simpleLanguage,
                setSimpleLanguage,
                "Aa",
              ],
              [
                "Reducir animaciones",
                "Detiene los movimientos decorativos",
                reducedMotion,
                setReducedMotion,
                "▰",
              ],
            ].map(([label, description, active, setter, symbol]) => (
              <button
                key={String(label)}
                className={active ? "active" : ""}
                role="switch"
                aria-checked={Boolean(active)}
                onClick={() => {
                  (setter as (value: boolean) => void)(!active);
                  notify(`${String(label)} ${active ? "desactivado" : "activado"}`);
                }}
              >
                <span className="option-symbol" aria-hidden="true">
                  {String(symbol)}
                </span>
                <span>
                  <strong>{String(label)}</strong>
                  <small>{String(description)}</small>
                </span>
                <i aria-hidden="true" />
              </button>
            ))}
            <button onClick={speaking ? stopSpeaking : () => speak()} className="speech-option">
              <span className="option-symbol">
                <Icon name={speaking ? "mute" : "play"} />
              </span>
              <span>
                <strong>Leer texto en voz alta</strong>
                <small>Escucha una introducción sin activar otros sonidos</small>
              </span>
              <b>{speaking ? "Detener" : "Escuchar"}</b>
            </button>
          </div>
          <section className="cvd-options" aria-labelledby="cvd-options-title">
            <div className="cvd-options-heading">
              <h3 id="cvd-options-title">Modo de visión y daltonismo</h3>
              <p>Elige una paleta. Los íconos y bordes también comunican cada estado.</p>
            </div>
            <div className="cvd-radio-group" role="radiogroup" aria-labelledby="cvd-options-title">
              {cvdModes.map((mode) => {
                const selected = cvdMode === mode.value;
                return (
                  <button
                    type="button"
                    role="radio"
                    aria-checked={selected}
                    className={selected ? "selected" : ""}
                    key={mode.value}
                    onClick={() => {
                      setCvdMode(mode.value);
                      notify(`Modo ${mode.label} seleccionado`);
                    }}
                  >
                    <span className="cvd-radio-indicator" aria-hidden="true">
                      {selected ? <Icon name="check" size={16} /> : null}
                    </span>
                    <span className="cvd-option-copy">
                      <strong>{mode.label}</strong>
                      <small>{mode.description}</small>
                    </span>
                    <span className="cvd-swatch-bar" aria-hidden="true">
                      {mode.swatches.map((color) => (
                        <i key={color} style={{ backgroundColor: color }} />
                      ))}
                    </span>
                  </button>
                );
              })}
            </div>
          </section>
          <div className="keyboard-help">
            <Icon name="book" size={24} />
            <div>
              <strong>Ayuda para navegar con teclado</strong>
              <p>
                Usa <kbd>Tab</kbd> para avanzar, <kbd>Mayús + Tab</kbd> para volver y{" "}
                <kbd>Enter</kbd> para elegir.
              </p>
            </div>
          </div>
        </div>
      </dialog>

      {habitatListOpen && (
        <div className="friends-backdrop" onClick={() => setHabitatListOpen(false)}>
          <aside
            className="habitat-list-panel"
            role="dialog"
            aria-modal="true"
            aria-labelledby="habitat-list-title"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="friends-header">
              <div>
                <span className="kicker">LISTA ACCESIBLE</span>
                <h2 id="habitat-list-title">Todos los mundos</h2>
                <p>Recorre la lista con Tab y entra con Enter.</p>
              </div>
              <button
                onClick={() => setHabitatListOpen(false)}
                aria-label="Cerrar lista de hábitats"
              >
                <Icon name="close" />
              </button>
            </div>
            <ul>
              {habitats.map((habitat, index) => (
                <li key={habitat.type}>
                  <div className="habitat-list-main">
                    <span className={`habitat-pictogram ${habitat.type}`} aria-hidden="true">
                      {["✺", "≈", "♒", "⬟"][index]}
                    </span>
                    <div className="habitat-list-copy">
                      <strong>{habitat.name}</strong>
                      <p>{habitat.text}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setSelectedHabitat(habitat);
                      setHabitatChallengeDone(false);
                      setHabitatListOpen(false);
                    }}
                  >
                    Entrar
                  </button>
                </li>
              ))}
            </ul>
          </aside>
        </div>
      )}

      {selectedHabitat && (
        <div
          className="habitat-world-backdrop"
          role="dialog"
          aria-modal="true"
          aria-labelledby="habitat-world-title"
        >
          <article className={`habitat-world habitat-world-${selectedHabitat.type}`}>
            <header className="habitat-world-toolbar">
              <button autoFocus onClick={() => setSelectedHabitat(null)}>
                <Icon name="arrow" size={20} /> Volver al mapa
              </button>
              <div className="world-toolbar-actions">
                <button
                  className={`music-toggle${musicOn ? " playing" : ""}`}
                  onClick={() => setMusicOn(!musicOn)}
                  aria-pressed={!musicOn}
                  aria-label={musicOn ? "Silenciar música" : "Activar música"}
                >
                  <Icon name={musicOn ? "volume" : "mute"} size={20} />
                  <span className="music-copy">
                    <strong>{musicOn ? "Silenciar música" : "Activar música"}</strong>
                    <small>{selectedHabitat.music}</small>
                  </span>
                  <span className="music-bars" aria-hidden="true">
                    <i />
                    <i />
                    <i />
                  </span>
                </button>
                <button
                  onClick={() => setHabitatPaused(!habitatPaused)}
                  aria-pressed={habitatPaused}
                >
                  <span aria-hidden="true">{habitatPaused ? "▶" : "Ⅱ"}</span>
                  {habitatPaused ? "Reanudar" : "Pausar movimientos"}
                </button>
                <button
                  className="transcript-toggle"
                  onClick={() => setShowHabitatTranscript(!showHabitatTranscript)}
                  aria-expanded={showHabitatTranscript}
                  aria-controls="habitat-audio-transcript"
                  disabled={!musicOn}
                >
                  <Icon name="book" size={18} /> Transcripción
                </button>
              </div>
            </header>
            <HabitatStage
              key={selectedHabitat.type}
              habitat={selectedHabitat}
              index={habitats.indexOf(selectedHabitat)}
              paused={habitatPaused}
              soundOn={musicOn}
              showTranscript={showHabitatTranscript}
              simpleLanguage={simpleLanguage}
              notify={notify}
              speak={speak}
              speaking={speaking}
              stopSpeaking={stopSpeaking}
              onOpenAnimal={selectAnimal}
            />
            <section className="habitat-residents" id="habitat-residents">
              <div className="habitat-copy">
                <span className="kicker">VIDA EN COMUNIDAD</span>
                <h3>¿Quiénes viven aquí?</h3>
                <p>
                  {selectedHabitat.animals.length === 1
                    ? "Este mundo es el escondite favorito de un habitante muy especial."
                    : "Estos animales encuentran aquí alimento, refugio y un lugar para descansar."}
                </p>
              </div>
              <div className="resident-list">
                {selectedHabitat.animals.map((kind) => {
                  const animal = animalData.find((item) => item.kind === kind)!;
                  return (
                    <button key={kind} onClick={() => selectAnimal(animal)}>
                      <span aria-hidden="true">
                        <AnimalIllustration kind={animal.kind} color={animal.color} />
                      </span>
                      <strong>{animal.name}</strong>
                      <small className="species-scientific" lang="la">
                        {animal.scientific}
                      </small>
                      <small>
                        Conocer <Icon name="arrow" size={14} />
                      </small>
                    </button>
                  );
                })}
              </div>
            </section>
            <section className="habitat-protection">
              <div className="protection-message">
                <span>
                  <Icon name="heart" size={28} />
                </span>
                <div>
                  <span className="kicker">CUIDEMOS ESTE MUNDO</span>
                  <h3>¿Cómo podemos proteger este lugar?</h3>
                  <p>{selectedHabitat.protect}</p>
                </div>
              </div>
              <div className="habitat-challenge">
                <span className="challenge-step">RETO SIN TIEMPO</span>
                <h3>{selectedHabitat.challenge}</h3>
                <p>
                  Explora los habitantes de arriba. Puedes volver a intentarlo todas las veces que
                  quieras.
                </p>
                <button onClick={() => setHabitatChallengeDone(true)}>
                  <Icon name="sparkle" size={18} /> Mostrar una pista
                </button>
                {habitatChallengeDone && (
                  <div role="status" aria-live="polite">
                    <Icon name="check" size={20} />
                    <span>
                      <strong>¡Buena exploración!</strong> La respuesta está entre los animales que
                      ves en este mundo.
                    </span>
                    <button onClick={() => setHabitatChallengeDone(false)}>Repetir</button>
                  </div>
                )}
              </div>
            </section>
          </article>
        </div>
      )}

      {animalsListOpen && (
        <div className="friends-backdrop" onClick={() => setAnimalsListOpen(false)}>
          <aside
            className="friends-panel"
            role="dialog"
            aria-modal="true"
            aria-labelledby="friends-title"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="friends-header">
              <div>
                <span className="kicker">MIS AMIGOS DEL OCÉANO</span>
                <h2 id="friends-title">Todos nuestros amigos</h2>
                <p>Elige un animal para conocer su mundo.</p>
              </div>
              <button
                onClick={() => setAnimalsListOpen(false)}
                aria-label="Cerrar lista de animales"
              >
                <Icon name="close" />
              </button>
            </div>
            <div
              className="friends-progress"
              aria-label={`${discovered.length} de ${animalData.length} especies descubiertas`}
            >
              <span style={{ width: `${(discovered.length / animalData.length) * 100}%` }} />
            </div>
            <strong className="progress-label">
              {discovered.length} de {animalData.length} descubiertos
            </strong>
            <ul className="friends-list">
              {animalData.map((animal) => (
                <li key={animal.kind}>
                  <div className="friend-mini" aria-hidden="true">
                    <AnimalIllustration kind={animal.kind} color={animal.color} />
                  </div>
                  <div>
                    <strong>{animal.name}</strong>
                    <small className="species-scientific" lang="la">
                      {animal.scientific}
                    </small>
                    <span
                      className={discovered.includes(animal.kind) ? "discovered-check" : undefined}
                    >
                      {discovered.includes(animal.kind) ? (
                        <>
                          <Icon name="check" size={14} /> Ya descubierto
                        </>
                      ) : (
                        "Aún por descubrir"
                      )}
                    </span>
                  </div>
                  <button
                    onClick={() => selectAnimal(animal)}
                    aria-label={`Conocer a ${animal.name}`}
                  >
                    Conocer
                  </button>
                </li>
              ))}
            </ul>
          </aside>
        </div>
      )}

      {!motionOff && <BubbleCurtain key={curtain.id} initial={curtain.initial} sound={musicOn} />}

      <div
        className={`toast-region${selectedHabitat && !selectedAnimal ? " toast-region-bottom" : ""}`}
        aria-live="polite"
        aria-label="Notificaciones"
      >
        {toasts.map((toast) => (
          <ToastItem
            key={toast.id}
            toast={toast}
            reducedMotion={reducedMotion}
            onDismiss={dismissToast}
          />
        ))}
      </div>

      {selectedAnimal && selectedDetails && (
        <div
          className="animal-world-backdrop"
          role="dialog"
          aria-modal="true"
          aria-labelledby="animal-title"
        >
          <article className="animal-world">
            <header className="animal-world-header">
              <button
                className="back-ocean-button"
                onClick={() => {
                  setSelectedAnimal(null);
                }}
              >
                <Icon name="arrow" size={20} /> Volver al océano
              </button>
              <button
                className="listen-button"
                onClick={() =>
                  speak(
                    simpleLanguage && selectedSimple
                      ? `${selectedAnimal.name}. ${selectedSimple.intro} ${selectedSimple.identity} ${selectedSimple.home}`
                      : `${selectedAnimal.name}. ${selectedDetails.intro}. ${selectedDetails.identity}. Vive en ${selectedDetails.home}.`,
                  )
                }
              >
                <Icon name="play" size={18} /> Escuchar la ficha
              </button>
            </header>
            <div className="animal-world-hero">
              <div className={`world-animal-art${showPhoto ? " showing-photo" : ""}`}>
                {selectedPhoto && (
                  <button
                    className="art-toggle"
                    onClick={() => {
                      setShowPhoto(!showPhoto);
                      setPhotoFailed(false);
                      setPhotoLoaded(false);
                      setUsingLocalTurtlePhoto(false);
                    }}
                    aria-pressed={showPhoto}
                  >
                    <Icon name={showPhoto ? "sparkle" : "play"} size={18} />
                    {showPhoto ? "Ver ilustración" : "Ver foto real"}
                  </button>
                )}
                {showPhoto && selectedPhoto && !photoFailed ? (
                  <figure
                    className={`world-photo${photoLoaded ? " is-loaded" : " is-loading"}`}
                    key={`photo-${selectedAnimal.kind}`}
                  >
                    {!photoLoaded && (
                      <div className="photo-loading" role="status">
                        <Icon name="sparkle" size={22} /> Cargando fotografía real…
                      </div>
                    )}
                    <img
                      src={
                        selectedAnimal.kind === "turtle" && usingLocalTurtlePhoto
                          ? turtlePhoto
                          : selectedPhoto.src
                      }
                      alt={selectedPhoto.alt}
                      onError={() => {
                        if (selectedAnimal.kind === "turtle" && !usingLocalTurtlePhoto) {
                          setUsingLocalTurtlePhoto(true);
                          setPhotoLoaded(false);
                          return;
                        }
                        setPhotoFailed(true);
                      }}
                      onLoad={() => setPhotoLoaded(true)}
                    />
                    <figcaption>
                      Foto:{" "}
                      <a href={selectedPhoto.source} target="_blank" rel="noreferrer">
                        {selectedPhoto.author}
                      </a>{" "}
                      · {selectedPhoto.license}
                    </figcaption>
                  </figure>
                ) : (
                  <div
                    className="world-illustration animal-hero-art"
                    key={`art-${selectedAnimal.kind}`}
                    role="img"
                    aria-label={`Ilustración de ${selectedAnimal.name} al estilo de OCEANÍA`}
                  >
                    <AnimalIllustration kind={selectedAnimal.kind} color={selectedAnimal.color} />
                    {showPhoto && photoFailed && (
                      <span className="photo-fallback-note" role="status">
                        La foto no pudo cargar. Mostramos la ilustración.
                      </span>
                    )}
                  </div>
                )}
              </div>
              <div className="world-intro">
                <span className="kicker">NUEVO AMIGO MARINO</span>
                <h2 id="animal-title">{selectedAnimal.name}</h2>
                <p className="profile-scientific" lang="la">
                  <em>{selectedAnimal.scientific}</em>
                </p>
                {selectedAnimal.status && (
                  <span className="nom-status">{selectedAnimal.status}</span>
                )}
                <p>
                  {simpleLanguage && selectedSimple ? selectedSimple.intro : selectedDetails.intro}
                </p>
                <span className="friendly-fact">
                  <Icon name="sparkle" size={18} /> {selectedAnimal.fact}
                </span>
              </div>
            </div>
            <div className="animal-facts-grid">
              {(
                [
                  ["01", "¿Quién soy?", "identity", "fish"],
                  ["02", "¿Dónde vivo?", "home", "book"],
                  ["03", "¿Qué como?", "food", "leaf"],
                  ["04", "¿Qué necesito para vivir?", "needs", "heart"],
                  ["05", "¿Qué peligros enfrento?", "dangers", "trash"],
                  ["06", "¿Cómo puedes ayudarme?", "help", "recycle"],
                ] as [string, string, FactKey, IconName][]
              ).map(([number, title, key, icon]) => (
                <section key={title}>
                  <span className="fact-number" aria-hidden="true">
                    {number}
                  </span>
                  <span className="fact-icon" aria-hidden="true">
                    <Icon name={icon} size={23} />
                  </span>
                  <div>
                    <h3>{title}</h3>
                    <p>{factText(key)}</p>
                    {key === "home" && selectedHome && (
                      <button
                        className="habitat-link"
                        onClick={() => {
                          setSelectedAnimal(null);
                          setSelectedHabitat(selectedHome);
                          setHabitatChallengeDone(false);
                        }}
                      >
                        Explorar {selectedHome.name} <Icon name="arrow" size={16} />
                      </button>
                    )}
                  </div>
                </section>
              ))}
            </div>
            <section className="curiosity-section" aria-labelledby="curiosity-title">
              <div>
                <span className="kicker">DATOS ASOMBROSOS</span>
                <h3 id="curiosity-title">Curiosidades</h3>
              </div>
              <ul>
                {selectedDetails.curiosities.map((curiosity, index) => (
                  <li key={curiosity}>
                    <span aria-hidden="true">{["✦", "◉", "≈"][index]}</span>
                    <strong>{curiosity}</strong>
                  </li>
                ))}
              </ul>
            </section>
            <SpeciesCapsule
              animal={selectedAnimal}
              details={selectedDetails}
              onSpeakingChange={setSpeaking}
            />
          </article>
        </div>
      )}
    </div>
  );
}

export default App;
