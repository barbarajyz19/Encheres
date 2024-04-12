import * as msg from './messageConstants.js';

const socket = io();

//input
const nameInput = document.getElementById('name');
const priceInput = document.getElementById('price');

//bouton
const judgeButton = document.getElementById('judge');
const startButton = document.getElementById('start');

//element
const infoElement = document.querySelector('.info p.info');
const montantElement = document.querySelector('.montant');


/**
 * manage if the start button can be activated if there is information in the input
 */
function updateStartButtonStatus() {
  const name = nameInput.value;
  const price = priceInput.value;
  startButton.disabled = !(name && price);
  judgeButton.disabled = true;
}


/**
 * starts a new enchere with the specified name and price
 * @param {object} socket - The socket.io instance to communicate with the server
 */
function startEnchere(socket) {
  const name = nameInput.value;
  const price = priceInput.value;
  if (!name) {
    return;
  }
  infoElement.innerText = `Début de l'enchère pour ${name} à ${price}€.`;
  montantElement.innerText = `${price}€`;

  socket.emit(msg.START_ENCHERE, { name, price });

  startButton.disabled = true;
  judgeButton.disabled = false;
  nameInput.disabled = true;
  priceInput.disabled = true;
}

/**
 * judges the actual enchere with the specified name and final price
 * @param {object} socket - The socket.io instance to communicate with the server
 */
function judgeEnchere(socket) {
  const name = nameInput.value;
  const finalPrice = montantElement.innerText;
  infoElement.innerText = `Fin de l'enchère. Un ${name} conclut à ${finalPrice}.`;

  socket.emit(msg.JUDGE_ENCHERE, { name, finalPrice });

  montantElement.innerText = `-€`;

  startButton.disabled = false;
  judgeButton.disabled = true;
  nameInput.disabled = false;
  priceInput.disabled = false;

  nameInput.value = "";
  priceInput.value = 10;
}

document.addEventListener('DOMContentLoaded', (event) => {
  startButton.addEventListener("click", () => startEnchere(socket));
  judgeButton.addEventListener("click", () => judgeEnchere(socket));

  nameInput.addEventListener("input", updateStartButtonStatus);
  priceInput.addEventListener("input", updateStartButtonStatus);

  updateStartButtonStatus();

});

// listen for the CONNECTED event to indicate a successful connection to the server
socket.on(msg.CONNECTED, () => {
  console.log(`connected with id ${socket.id}`);
  socket.emit(msg.REGISTER, msg.AUCTIONEER);
});

// listen for the AUCTIONEER event to handle cases where the client is the auctioneer or not
socket.on(msg.AUCTIONEER, ({ isAuctioneer }) => {
  if (isAuctioneer) {
    console.log('You are the only ' + msg.AUCTIONEER);
  } else {
    document.getElementById('onlyOneConnection').style.display = 'none';
    document.getElementById('tooMuchConnection').style.display = 'block';
  }
});

// listen for the PROPOSAL_BIDDER event to update the price when there is a new proposal from a bidder
socket.on(msg.PROPOSAL_BIDDER, ({ id, value }) => {
  const currentPrice = parseFloat(montantElement.innerText);
  const newPrice = currentPrice + parseFloat(value);

  infoElement.innerText = `Enchere reçue de ${id} : + ${value}€.`;
  montantElement.innerText = `${newPrice}€`;
});


