import * as msg from '../public/scripts/messageConstants.js';

export default class IOController {
  #io;
  #clients;
  #auctioneer;

  constructor(io) {
    this.#io = io;
    this.#clients = new Map();
    this.#auctioneer = {id : "", status : false};
  }

  get auctioneer() {
    return this.#auctioneer;
  }


  /**
   * handle new socket connections
   * @param {object} socket - The socket.io instance to communicate with the server
   */
  registerSocket(socket) {
    console.log(`new connection with id ${socket.id}`);
    this.setupListeners(socket);
    socket.emit(msg.CONNECTED);
  }

  /**
   * method to set up event listeners for the socket
   * @param {object} socket - The socket.io instance to communicate with the server
   */
  setupListeners(socket) {
    socket.on(msg.REGISTER, (value) => this.handleRegister(socket, value));
    socket.on(msg.DISCONNECT, () => this.handleDisconnect(socket));
    socket.on(msg.START_ENCHERE, (data) => this.handleStartEnchere(socket, data));
    socket.on(msg.JUDGE_ENCHERE, (data) => this.handleJudgeEnchere(socket, data));
    socket.on(msg.PROPOSAL_BIDDER, (data) => this.handleProposal(data));
   }
  

  /**
   * handle the case where only one auctioneer is allowed
   * @param {object} socket - The socket.io instance to communicate with the server
   */
  handleOneAuctioneer(socket) {
    if (!this.auctioneer.status) {
      this.auctioneer.id = socket.id;
      this.auctioneer.status = true;
      socket.emit(msg.AUCTIONEER, { isAuctioneer: true });
    } else {
      socket.emit(msg.AUCTIONEER, { isAuctioneer: false });
    }
  }

  /**
   * handle the REGISTER message from the client
   * @param {object} socket - The socket.io instance to communicate with the server
   * @param {number} value - bidder or auctioneer 
   */
  handleRegister(socket, value) {
    console.log(`register received from ${socket.id} : ${value}`);
    this.handleOneAuctioneer(socket);
    this.#clients.set(socket.id, socket);
  }
  
  /**
   * handle the DISCONNECT event from the client
   * @param {object} socket - The socket.io instance to communicate with the server
   */
  handleDisconnect(socket) {
    console.log(`disconnection from ${socket.id}`);
    if (this.auctioneer.status && (this.auctioneer.id === socket.id)){
      this.auctioneer.id = "";
      this.auctioneer.status = false;   
      this.#io.emit();
    }
  }

  /**
   * handle the START_ENCHERE message from the client
   * @param {object} socket - The socket.io instance to communicate with the server
   * @param {data} data - name and price of the enchere 
   */
  handleStartEnchere(socket, { name, price }) {
    if (socket.id === this.auctioneer.id) {
      this.#io.emit(msg.START_ENCHERE, { name, price });
    }
  }

  /**
   * handle the JUDGE_ENCHERE message from the client
   * @param {object} socket - The socket.io instance to communicate with the server
   * @param {data} data - name and fianl price of the enchere 
   */
  handleJudgeEnchere(socket, { name, finalPrice }) {
    if (socket.id === this.auctioneer.id) {
      this.#io.emit(msg.JUDGE_ENCHERE, { name, finalPrice });
    }
  }

  /**
   * handle the PROPOSAL_BIDDER message from the client
   * @param {data} data - id of the bidder and value to add to the price 
   */
  handleProposal({ id, value }) {
    this.#io.emit(msg.PROPOSAL_BIDDER, { id: id, value: value });
  }

}
