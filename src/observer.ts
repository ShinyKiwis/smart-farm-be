import Client from "./client";
import WebSocket from "ws";

class Observer {
  private observers: WebSocket.WebSocket[]
  constructor(clients: Client) {
    this.observers = clients.getClients()
  }

  notify = (data: string) => {
    this.observers.forEach(observer => {
      console.log(data)
      observer.send(data)
    })
  }
}

export default Observer