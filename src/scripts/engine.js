const state = {
  score: {
    playerScore: 0,
    computerScore: 0,
    scoreBox: document.getElementById("score_points"),
  },
  cardSprites: {
    avatar: document.getElementById("card-image"),
    name: document.getElementById("card-name"),
    type: document.getElementById("card-type"),
  },
  fieldCards: {
    player: document.getElementById("player-field-card"),
    computer: document.getElementById("computer-field-card"),
  },
  playerSides: {
    player: "player-cards",
    playerBox: document.getElementById("player-cards"),
    computer: "computer-cards",
    computerBox: document.getElementById("computer-cards"),
  },
  actions: {
    button: document.getElementById("next-duel"),
  },
};

const pathImage = "./src/assets/icons/";

const cardData = [
  {
    id: 0,
    name: "Blue Eyes White Dragon",
    type: "Paper",
    img: `${pathImage}dragon.png`,
    WinOf: [1],
    LoseOf: [2],
  },
  {
    id: 1,
    name: "Dark Magician",
    type: "Rock",
    img: `${pathImage}magician.png`,
    WinOf: [2],
    LoseOf: [0],
  },
  {
    id: 2,
    name: "Exodia the Forbidden One",
    type: "Scissors",
    img: `${pathImage}exodia.png`,
    WinOf: [0],
    LoseOf: [1],
  },
];

const playerSides = {
  player: "player-cards",
  computer: "computer-cards",
};

const getRandomCardId = () => Math.floor(Math.random() * cardData.length);

const createCardImage = (cardId, fieldSide) => {
  const cardImage = document.createElement("img");
  cardImage.setAttribute("height", "100px");
  cardImage.setAttribute("src", "./src/assets/icons/card-back.png");
  cardImage.setAttribute("data-id", cardId);
  cardImage.classList.add("card");

  if (fieldSide === playerSides.player) {
    cardImage.addEventListener("mouseover", () => drawSelectCard(cardId));
    cardImage.addEventListener("click", () => setCardsField(cardId));
  }

  return cardImage;
};

const setCardsField = async (cardId) => {
  await removeAllCardsImages();

  const computerCardId = getRandomCardId();
  await ShowHiddenCardFieldsImages(true);
  await hiddenCardDetails();
  await drawCardsInField(cardId, computerCardId);

  const duelResult = await checkDuelResults(cardId, computerCardId);
  await updateScore();
  await drawButton(duelResult);
};

const drawCardsInField = (cardId, computerCardId) => {
  state.fieldCards.player.src = cardData[cardId].img;
  state.fieldCards.computer.src = cardData[computerCardId].img;
};

const ShowHiddenCardFieldsImages = (value) => {
  state.fieldCards.player.style.display = value ? "block" : "none";
  state.fieldCards.computer.style.display = value ? "block" : "none";
};

const hiddenCardDetails = () => {
  state.cardSprites.avatar.src = "";
  state.cardSprites.name.innerText = "";
  state.cardSprites.type.innerText = "";
};

const drawButton = (text) => {
  state.actions.button.innerHTML = text.toUpperCase();
  state.actions.button.style.display = "block";
};

const updateScore = () => {
  state.score.scoreBox.innerText = `Win: ${state.score.playerScore} | Lose: ${state.score.computerScore}`;
};

const checkDuelResults = async (playerCardId, computerCardId) => {
  const playerCard = cardData[playerCardId];
  let duelResult = "draw";

  if (playerCard.WinOf.includes(computerCardId)) {
    duelResult = "win";
    await playAudio(duelResult);
    state.score.playerScore++;
  } else if (playerCard.LoseOf.includes(computerCardId)) {
    duelResult = "lose";
    await playAudio(duelResult);
    state.score.computerScore++;
  }

  return duelResult;
};

const removeAllCardsImages = () => {
  const { computerBox, playerBox } = state.playerSides;
  
  [...computerBox.querySelectorAll("img"), ...playerBox.querySelectorAll("img")]
    .forEach(img => img.remove());
};

const drawSelectCard = (index) => {
  const { avatar, name, type } = state.cardSprites;
  const card = cardData[index];
  avatar.src = card.img;
  name.innerText = card.name;
  type.innerText = `Attribute : ${card.type}`;
};

const drawCards = async (cardNumbers, fieldSide) => {
  for (let i = 0; i < cardNumbers; i++) {
    const randomCardId = getRandomCardId();
    const cardImage = createCardImage(randomCardId, fieldSide);
    document.getElementById(fieldSide).appendChild(cardImage);
  }
};

const resetDuel = async () => {
  state.cardSprites.avatar.src = "";
  state.actions.button.style.display = "none";
  state.fieldCards.player.style.display = "none";
  state.fieldCards.computer.style.display = "none";

  init();
};

const playAudio = (status) => {
  const audio = new Audio(`./src/assets/audios/${status}.wav`);
  audio.play();
};

const init = () => {
  ShowHiddenCardFieldsImages(false);
  drawCards(3, playerSides.player);
  drawCards(3, playerSides.computer);

  const bgm = document.getElementById("bgm");
  bgm.volume = 0.1;
  bgm.play();
};

init();
