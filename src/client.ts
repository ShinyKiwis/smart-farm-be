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

  public addClient = (connection: WebSocket.WebSocket) => {
    this.clients.push(connection)
  }

  public removeClient = (connection: WebSocket.WebSocket) => {
    const connectionIdx = this.clients.indexOf(connection)
    this.clients.splice(connectionIdx, 1)
  }

}

export default Client
