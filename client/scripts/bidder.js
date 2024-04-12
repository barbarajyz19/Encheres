const msg = require('./messageConstants.js');
const socket = io();

let enchereIsRunning = false;
let lastBidder = null;
let prixInitial;

const info = document.getElementById("info");
const proposal = document.getElementById("proposal");
const btn5 = document.getElementById("btn5");
const btn10 = document.getElementById("btn10");
const btn100 = document.getElementById("btn100");

document.addEventListener('DOMContentLoaded', (event) => {
  proposal.style.display = `none`;
  btn5.addEventListener("click", () => newProposal(5));
  btn10.addEventListener("click", () => newProposal(10));
  btn100.addEventListener("click", () => newProposal(100));
});

/**
 * Sends a new proposal to the auctionneer and other bidder
 * @param {object} socket - The socket.io instance to communicate with the server
 * @param {number} value - The value of the new proposal
 */
function newProposal(value) {
  if (enchereIsRunning) {
    info.innerText = `Vous avez fait une nouvelle enchère de + ${value}€.`;
    socket.emit(msg.PROPOSAL_BIDDER, { id: socket.id, value: value });
  }
}

// listen for the connection event
socket.on(() => {
    console.log(`connected with id ${socket.id}`);
    if (!enchereIsRunning) {
      socket.emit(msg.REGISTER, msg.BIDDER);
    } else {
      console.log('Enchère en cours. Inscription bloquée.');
  }
}
);

// listen for the START_ENCHERE event 
socket.on(msg.START_ENCHERE, ({ name, price }) => {
  const status = document.querySelector('p span#status');
  const montant = document.querySelector('p span#montant');

  status.textContent = name;
  montant.textContent = `${price}€`;
  prixInitial = parseFloat(price);
  
  info.innerText = `Une nouvelle enchère commence.`;
  proposal.style.display = `block`;

  enchereIsRunning = true;
});

// listen for the JUDGE_ENCHERE event
socket.on(msg.JUDGE_ENCHERE, ({ name, finalPrice }) => {
  if (enchereIsRunning) {
    const status = document.querySelector('p span#status');
    const montant = document.querySelector('p span#montant');

    if (parseFloat(finalPrice) === prixInitial) {
      info.innerText = `Enchère terminée, personne n'a remporté l'enchère.`;
    } else {
      if (lastBidder === socket.id) {
        info.innerText = `Enchère terminée, vous avez remporté l'enchère !`;
      } else {
        info.innerText = `Enchère terminée, l'enchère a été remportée par une autre personne`;
      }
    }

    status.textContent = name;
    montant.textContent = finalPrice;

    proposal.style.display = `none`;
    enchereIsRunning = false;
  }
});

// listen for the PROPOSAL_BIDDER event
socket.on(msg.PROPOSAL_BIDDER, ({ id, value }) => {
  if (enchereIsRunning) {
    if (id !== socket.id) {
      info.innerText = `Nouvelle enchère de + ${value}€.`;
    }
    const montant = document.querySelector('p span#montant');
    const currentPrice = parseFloat(montant.innerText);
    const newPrice = currentPrice + parseFloat(value);
    montant.innerText = `${newPrice}€`;
    lastBidder = id;
  }
});

// Listen for the DISCONNECT event
socket.on(msg.DISCONNECT, () => {
  const status = document.querySelector('p span#status');
  const montant = document.querySelector('p span#montant');

  info.innerText = `Le comissaire priseur s'est déconnecté. Fin de l'enchère.`;
  status.textContent = ``;
  montant.textContent = `-€`;

  proposal.style.display = `none`;
  enchereIsRunning = false;
});
