import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as http from 'http'
import * as cors from 'cors'
import Controller from 'interfaces/controller.interface';
import Database from './database';
import Client from './client';
import WebSocket, { WebSocketServer } from 'ws';

class App {
  private app: express.Application;
  private httpServer: http.Server<typeof http.IncomingMessage, typeof http.ServerResponse>;
  private ws: WebSocket.Server<WebSocket.WebSocket>;
  private clients: Client 

  constructor(controllers: Controller[]) {
    this.app = express();
    this.clients = Client.getInstance()

    this.initializeDatabaseConnection();
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
    this.ws = new WebSocketServer({server: this.httpServer})
  }

  private initializeWebSocketEvents = () => {
    this.ws.on('connection', (connection) => {
      if (!this.clients.getClients().includes(connection)) {
        this.clients.addClient(connection)
        connection.send('HEllO')
      }
      console.log('Received a new connection: ' + connection )
      this.ws.on('message', (message) => {
        console.log(`Received: ${message}`)
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
