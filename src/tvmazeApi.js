import axios from 'axios';
import {sleep} from './utils';

const BACKOFF_BASE = 2000;
const axiosInstance = axios.create({
  baseURL: 'https://api.tvmaze.com/',
  timeout: 5000,
});

// Have a request queue to be able to comply with rate limiting
// and pause the queue while we wait for the rate limiting to stop
const requestQueue = [];
let requestQueueRunning = false;

class TVMazeAPI {
  constructor () {

  }

  async doRequest(config) {
    let attempt = 0;
    for(;;) {
      try {
        return await axiosInstance.request(config);
      } catch (err) {
        if(!err.isAxiosError) throw err;
        if(!err.response) throw err;
        if(err.response.status !== 429) throw err;

        // If we get rate limited, retry after longer and longer backoff times. At a max of 10 times the base backoff.
        const backoff = Math.min(BACKOFF_BASE * 10, Math.round(BACKOFF_BASE * Math.pow(1.5, attempt)));
        attempt++;
        if(this.maxRetries && attempt >= this.maxRetries) throw err;
        console.log(`We got ratelimited, waiting ${backoff}ms. We have tried ${attempt} times.`); // eslint-disable-line
        await sleep(backoff);
      }
    }    
  }
  
  async runQueue () {
    requestQueueRunning = true;
    if(!requestQueue.length) {
      requestQueueRunning = false;
      return;
    }
    const {config, resolve, reject} = requestQueue.pop();
    this.doRequest(config).then(resolve).catch(reject).finally(()=>this.runQueue());
  }

  request (config) {
    // Since we have a queue, there are times we want to prioritize requests
    // Such as requests based on user actions, where the latest request tends
    // to be the most important one for the user.
    // Put those at front of the queue

    // TODO: implement cancelling of queued request
    let priority = false;
    if(config.hasOwnProperty('priority')) {
      priority = config.priority;
      delete config.priority;
    }
    return new Promise((resolve, reject) => {
      requestQueue[priority ? 'push' : 'unshift']({
        config,
        resolve,
        reject
      });
      if(!requestQueueRunning) this.runQueue();
    });
  }

  get (url, config) {
    return this.request({
      url,
      method: 'get',
      ...(config || {})
    });
  }

  delete (url, config) {
    return this.request({
      url,
      method: 'delete',
      ...(config || {})
    });
  }

  head (url, config) {
    return this.request({
      url,
      method: 'head',
      ...(config || {})
    });
  }

  options (url, config) {
    return this.request({
      url,
      method: 'options',
      ...(config || {})
    });
  }

  post (url, data, config) {
    return this.request({
      url,
      method: 'post',
      data,
      ...(config || {})
    });
  }

  put (url, data, config) {
    return this.request({
      url,
      method: 'put',
      data,
      ...(config || {})
    });
  }

  patch (url, data, config) {
    return this.request({
      url,
      method: 'patch',
      data,
      ...(config || {})
    });
  }

  getUri (config) {
    axiosInstance.getUri(config);
  }

  search (query) {
    return this.get(`/singlesearch/shows`, {
      params: {
        embed: 'episodes',
        q: query,
      }
    });
  }
}
export default new TVMazeAPI();
