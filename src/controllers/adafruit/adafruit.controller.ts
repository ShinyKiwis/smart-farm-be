import Controller from 'interfaces/controller.interface'
import * as express from 'express';
import axios from 'axios';

class AdafruitController implements Controller {
    public path = '/adafruit';
    public router = express.Router();

    constructor() {
        this.initializeRoute();
    }

    private initializeRoute () {
        this.router.get(`${this.path}/:feedKey`, this.getFeedData);
        this.router.post(`${this.path}/:feedKey/:data`, this.updateFeedData);
        this.router.get(`${this.path}/:feedKey/latest`, this.getLatestData);
    }

    private getFeedData(request: express.Request, response: express.Response) {
        const { feedKey } = request.params;
        axios.get(`https://io.adafruit.com/api/v2/meodihere/feeds/${feedKey}/data`, {
            params: {
                'x-aio-key': 'aio_WSgw68yODyZk35CBsmsZd3CSwQcV'
            }
        }).then((res) => {
            console.log(res)
            response.send(JSON.stringify(res.data))
        }).catch((err) => {
            console.log(err)
        })
    }

    private updateFeedData(request: express.Request, response: express.Response) {
        const { feedKey, data } = request.params;
        console.log(feedKey, data)
        axios.post(`https://io.adafruit.com/api/v2/meodihere/feeds/${feedKey}/data`, {
            value: data
        },{
            params: {
                'x-aio-key': 'aio_WSgw68yODyZk35CBsmsZd3CSwQcV',
              },
        })
    }

    private getLatestData(request: express.Request, response: express.Response) {
        const { feedKey } = request.params;
        axios.get(`https://io.adafruit.com/api/v2/meodihere/feeds/${feedKey}/data/retain`, {
            params: {
                'x-aio-key': 'aio_WSgw68yODyZk35CBsmsZd3CSwQcV'
            },
        }).then((res) => {
            response.send(res)
        })
    } 
}
export default AdafruitController