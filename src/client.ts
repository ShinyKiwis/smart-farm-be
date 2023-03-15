import WebSocket from "ws"

class Client {
  private clients: WebSocket.WebSocket[]
  private static instance: Client
  private constructor() {
    this.clients = [] 
  }

  static getInstance() {
    if(!this.instance) {
      this.instance = new Client()
    }
    return this.instance
  }

  public getClients = () => {
    return this.clients
  }

  public addClient = (connection) => {
    this.clients.push(connection)
  }

}

export default Client