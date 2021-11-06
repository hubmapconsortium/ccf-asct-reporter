import { RequestHandler } from 'express';
import mcache from 'memory-cache';


export function routeCache(duration: number): RequestHandler {
  return (req, res, next) => {
    res.set('Content-Type', 'application/json');
    res.set('Cache-control', `public, max-age=${duration}`);
    const key = '__express__' + req.originalUrl || req.url;
    const cachedBody = mcache.get(key);
    if (cachedBody) {
      res.send(cachedBody);
    } else {
      if (req.params.cache){
        const sendResponse = res.send;
        res.send = (body) => {
          mcache.put(key, body, duration * 1000);
          sendResponse.call(res, body);
          return body;
        }
      }
      next();
    }
  };
}