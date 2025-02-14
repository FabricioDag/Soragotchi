const { ipcRenderer } = require("electron");

const closeButton = document.querySelector(".closeButton");

closeButton.addEventListener("click", () => {
  ipcRenderer.send("closeApp");
});

const minimizeButton = document.querySelector(".minimizeButton");

minimizeButton.addEventListener("click", () => {
  ipcRenderer.send("minimizeApp");
});

// --------------------- QUERIES SELECTORS --------------------- //

const debugEstado = document.querySelector(".debugEstado");
const debugIsAlert = document.querySelector(".debugIsAlert");
const debugIsLampOn = document.querySelector(".debugIsLampOn");
const debugIsWindowOpen = document.querySelector(".debugIsWindowOpen");

const screen = document.querySelector(".screen");

const lcdText = document.querySelector(".lcdText");

const cat = document.querySelector(".cat");

const hungerStatus = document.querySelector(".hungerStatus");
const lonelinessStatus = document.querySelector(".lonelinessStatus");
const sleepinessStatus = document.querySelector(".sleepinessStatus");

const feedButton = document.querySelector(".feedButton");
const lampButton = document.querySelector(".lampButton");
const lampButtonIcon = document.querySelector("#lampButtonIcon");
const filter = document.querySelector(".filter");
const petButton = document.querySelector(".petButton");
const windowButton = document.querySelector(".windowButton");
const windowButtonIcon = document.querySelector("#windowButtonIcon");

// --------------------- TAMAGOTCHI/ENVIRONMENT --------------------- //

document.addEventListener("DOMContentLoaded", () => {
  updateUI();
});

const Soragotchi = {
  state: "awake", // awake, sleep, away
  isAlert: true,
  maxLoneliness: 100,
  curLoneliness: 0,
  maxHunger: 100,
  curHunger: 0,
  maxSleepiness: 100,
  curSleepiness: 0,
  currentAnimating: false,
};

// const Soragotchi = {
//   state: "awake", // awake, sleep, away
//   isAlert: true,
//   hunger: { max: 100, current: 0 },
//   loneliness: { max: 100, current: 0 },
//   sleepiness: { max: 100, current: 0 },
//   isAnimating: false,
// };

const Environment = {
  isLampOn: true,
  isWindowOpen: false,
};

// --------------------- TIMERS --------------------- //
const globalTimer = () => {
  // serve para atualizar os estados
  setInterval(() => {
    updateStatus();

    updateState();

    // handleNextHumor();

    updateUI();
  }, 5 * 60 * 1000); // A cada 5 minutos (5*60*1000)
};

// const animationTimer = () => {
//   setInterval(() => {
//     playAnimation();
//   }, Math.random() * 5000 + 5000); // Toca a animação aleatoriamente entre 5s e 10s
// };

// --------------------- STATUS/STATES FUNCTIONS --------------------- //

const updateStatus = () => {
  if (Soragotchi.state === "awake") {
    Soragotchi.curHunger < Soragotchi.maxHunger
      ? (Soragotchi.curHunger += 10)
      : null;
    Soragotchi.curLoneliness < Soragotchi.maxLoneliness
      ? (Soragotchi.curLoneliness += 10)
      : null;
    Soragotchi.curSleepiness < Soragotchi.maxSleepiness
      ? (Soragotchi.curSleepiness += 10)
      : null;
  } else if (Soragotchi.state === "sleep") {
    Soragotchi.curHunger < Soragotchi.maxHunger
      ? (Soragotchi.curHunger += 20)
      : null;
    Soragotchi.curLoneliness < Soragotchi.maxLoneliness
      ? (Soragotchi.curLoneliness += 5)
      : null;
    Soragotchi.curSleepiness > 0 ? (Soragotchi.curSleepiness -= 10) : null;
  } else if (Soragotchi.state === "away") {
    Soragotchi.curHunger < Soragotchi.maxHunger
      ? (Soragotchi.curHunger += 20)
      : null;
    Soragotchi.curLoneliness < Soragotchi.maxLoneliness
      ? (Soragotchi.curLoneliness += 5)
      : null;
    Soragotchi.curSleepiness < Soragotchi.maxSleepiness
      ? (Soragotchi.curSleepiness += 20)
      : null;
  }
};

const updateState = () => {
  //aleatoriamente testa se ele está alerta ou nao
  if (Soragotchi.isAlert && Math.random() > 0.5) {
    Soragotchi.isAlert = false;
  }

  if (
    Environment.isLampOn === false &&
    Soragotchi.state === "awake" &&
    Soragotchi.curSleepiness > 20
  ) {
    // se esta escuro e ele está acordado e com sono ele dorme
    Soragotchi.state = "sleep";
    Soragotchi.isAlert = false;
  } else if (Soragotchi.state === "sleep" && Soragotchi.curSleepiness === 0) {
    // se está dormindo e nao tem mais sono ele acorda
    Soragotchi.state = "awake";
  } else if (
    Environment.isWindowOpen &&
    Soragotchi.state === "awake" &&
    Soragotchi.curLoneliness > 20
  ) {
    // se janela aberta e acordado e com carencia 20 ele sai
    Soragotchi.state = "away";
  } else if (Soragotchi.state === "away") {
    //se na rua e deu fome ou sono entao volta senao 50% chance de voltar
    if (Soragotchi.curHunger > 70 || Soragotchi.curSleepiness > 70) {
      Soragotchi.state = "awake";
    } else {
      // 50% chance de voltar
      if (Math.random() > 0.5) {
        Soragotchi.state = "awake";
      }
    }
  }
};

// --------------------- UTILS --------------------- //

const playAnimation = () => {
  if (Soragotchi.currentAnimating) return;

  setLcdText("playing animation"); // debug only

  Soragotchi.currentAnimating = true;

  if (Soragotchi.state === "awake") {
    cat.style.animation = "gatoAnimado .4s steps(5)";

    //definir bg principal
    cat.style.backgroundImage = "url('./gatoPiscando/gatoPerto1.png')";
  } else if (Soragotchi.state === "sleep") {
    cat.style.animation = "gatoAnimadoDormindo .8s steps(5)";

    //definir bg principal
    cat.style.backgroundImage = "url('./gatoDormindo/gatoDormindo1.png')";
  } else if (Soragotchi.state === "away") {
    cat.style.animation = "gatoAnimadoLonge .4s steps(5)";
    //definir bg principal
    cat.style.backgroundImage = "url('./gatoRabo/gatoLonge1.png')";
  }

  setTimeout(() => {
    cat.style.animation = ""; // Reseta a animação
    Soragotchi.currentAnimating = false;
    updateBaseImage();
  }, 1000); // Tempo da animação
};

const setLcdText = (newText) => {
  lcdText.innerHTML = newText;
  setTimeout(() => {
    lcdText.innerHTML = "";
  }, 2000);
};

const updateUI = () => {
  hungerStatus.textContent = Soragotchi.curHunger;
  lonelinessStatus.textContent = Soragotchi.curLoneliness;
  sleepinessStatus.textContent = Soragotchi.curSleepiness;

  debugEstado.innerHTML = `state: ${Soragotchi.state}`;
  debugIsAlert.innerHTML = `isAlert: ${Soragotchi.isAlert}`;
  debugIsLampOn.innerHTML = `isLampOnd: ${Environment.isLampOn}`;
  debugIsWindowOpen.innerHTML = `isWindowOpen: ${Environment.isWindowOpen}`;

  if (Soragotchi.state === "awake" && Soragotchi.isAlert === true) {
    // ou alterar bgs
    cat.classList.remove("longe");
    cat.classList.remove("dormindo");
    cat.classList.remove("fora");
    cat.classList.add("perto");
  } else if (Soragotchi.state === "awake" && Soragotchi.isAlert === false) {
    cat.classList.remove("perto");
    cat.classList.remove("dormindo");
    cat.classList.remove("fora");
    cat.classList.add("longe");
  } else if (Soragotchi.state === "sleep") {
    cat.classList.remove("longe");
    cat.classList.remove("perto");
    cat.classList.remove("fora");
    cat.classList.add("dormindo");
  } else if (Soragotchi.state === "away") {
    cat.classList.remove("longe");
    cat.classList.remove("perto");
    cat.classList.remove("dormindo");
    cat.classList.add("fora");
  }
};

// --------------------- Feed --------------------- //
feedButton.addEventListener("click", () => {
  if (Soragotchi.isAlert === false) {
    setLcdText("Sora isnt looking at you, call him first");
    return;
  }

  Soragotchi.curHunger -= 20;
  if (Soragotchi.curHunger < 0) Soragotchi.curHunger = 0;

  if (Soragotchi.curHunger > 50) {
    setLcdText("Ainda estou com muita fome!");
  } else if (Soragotchi.curHunger > 20) {
    setLcdText("Estou satisfeito!");
  } else {
    setLcdText("Obrigado! Estou cheio!");
  }
  updateUI();
});

// --------------------- Lamp --------------------- //
lampButton.addEventListener("click", () => {
  filter.classList.toggle("active");
  if (Environment.isLampOn) {
    lampButtonIcon.classList.remove("fa-solid");
    lampButtonIcon.classList.add("fa-regular");
  } else {
    lampButtonIcon.classList.remove("fa-regular");
    lampButtonIcon.classList.add("fa-solid");
  }
  Environment.isLampOn = !Environment.isLampOn;

  console.log(Environment);
  updateUI();
});

// --------------------- Pet --------------------- //
petButton.addEventListener("click", () => {
  if (Soragotchi.isAlert === false) {
    setLcdText("Sora isnt looking at you, call him first");
    return;
  }

  if (Soragotchi.state === "awake") {
    Soragotchi.curLoneliness -= 20;
    if (Soragotchi.curLoneliness < 0) Soragotchi.curLoneliness = 0;

    if (Soragotchi.curLoneliness > 50) {
      setLcdText("Ainda estou muito sozinho!");
    } else if (Soragotchi.curLoneliness > 20) {
      setLcdText("Obrigado! Estou melhor!");
    } else {
      setLcdText("Estou muito feliz!");
    }
  } else {
    setLcdText("zzzz..");
  }

  console.log(Soragotchi);
  updateUI();
});

// --------------------- Window --------------------- //
windowButton.addEventListener("click", () => {
  if (Soragotchi.state === "away") {
    setLcdText("Sora is outside, wait for him come back!");
    return;
  }
  if (Environment.isWindowOpen) {
    windowButtonIcon.classList.remove("fa-door-open");
    windowButtonIcon.classList.add("fa-door-closed");
  } else {
    windowButtonIcon.classList.remove("fa-door-closed");
    windowButtonIcon.classList.add("fa-door-open");
  }
  Environment.isWindowOpen = !Environment.isWindowOpen;

  console.log(Environment);
  updateUI();
});

// --------------------- Nudge --------------------- //
const meowList = ["Miau", "MIAU!", "miau...", "MIAAAAuu", "..."];

screen.addEventListener("click", () => {
  if (Soragotchi.state !== "away") {
    Soragotchi.isAlert = true;
  }

  if (Soragotchi.state === "awake") {
    let randomMeow = meowList[Math.floor(Math.random() * meowList.length)];
    setLcdText(randomMeow);
  } else if (Soragotchi.state === "away") {
    setLcdText("...");
  } else {
    Soragotchi.state = "awake";
  }

  updateUI();
});

// --------------------- START --------------------- //
globalTimer();
// animationTimer();
