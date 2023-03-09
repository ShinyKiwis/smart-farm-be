import * as express from "express"

class App {
  private app: express.Application;

  constructor() {
    this.app = express()
  }

  public listen() {
    this.app.listen(process.env.PORT, () => {
      console.log(`Server listening on port: ${process.env.PORT}`)
    })
  }

}

export default App