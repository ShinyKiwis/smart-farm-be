import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as http from 'http'
import * as cors from 'cors'
import Controller from 'interfaces/controller.interface';
import Database from './database';
import Client from './client';
import * as WebSocket from 'ws';

class App {
  private app: express.Application;
  private httpServer: http.Server<typeof http.IncomingMessage, typeof http.ServerResponse>;
  private ws: WebSocket.Server<WebSocket.WebSocket>;
  private clients: Client 

  constructor(controllers: Controller[]) {
    this.app = express();
    this.clients = Client.getInstance()

    this.initializeDatabaseConnection()
    this.initializeMiddleware()
    this.initializeWebSocket()
    this.initializeControllers(controllers);
    this.initializeWebSocketEvents()
  }

  private initializeMiddleware = () => {
    this.app.use(bodyParser.json())
    this.app.use(cors())
  }

  private initializeWebSocket = () => {
    this.httpServer = http.createServer(this.app)
    const server = this.httpServer
    this.ws = new WebSocket.Server({server})
  }

  private initializeWebSocketEvents = () => {
    this.ws.on('connection', (connection) => {
      console.log(this.clients.getClients().length)
      if (!this.clients.getClients().includes(connection)) {
        this.clients.addClient(connection)
      }
      console.log('Received a new connection: ' + connection )
      connection.on('message', (message) => {
        console.log(`Received: ${message}`)
      })

      connection.on('close', ()=> {
        this.clients.removeClient(connection)
      })
    })
  }

  private initializeDatabaseConnection = () => {
    Database.getInstance();
  };

  private initializeControllers = (controllers: Controller[]) => {
    controllers.forEach((controller) => {
      this.app.use('/api', controller.router);
    });
  };

  public listen() {
    this.httpServer.listen(process.env.PORT, () => {
      console.log(`Server listening on port: ${process.env.PORT}`);
    });
  }
}

export default App;
