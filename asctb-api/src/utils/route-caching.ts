import { RequestHandler } from 'express';
import mcache from 'memory-cache';


export function routeCache(duration: number): RequestHandler {
  return (req, res, next) => {
    res.set('Content-Type', 'application/json');
    res.set('Cache-control', `public, max-age=${duration}`);
    const key = '__express__' + req.originalUrl || req.url;
    const cachedBody = mcache.get(key);
    // query parameters
    const cache = req.query.cache as string;
    if (cache !== 'true') {
      mcache.del(key);
      next();
    } else {
      if (cachedBody) {
        res.send(cachedBody);
      } else {
        const sendResponse = res.send;
        res.send = (body) => {
          mcache.put(key, body, duration * 1000);
          sendResponse.call(res, body);
          return body;
        };
        next();
      }
    }
  };
}
