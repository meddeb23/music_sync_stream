import { Request } from "express";

export type httpRequest = {
  path: String;
  method: String;
  pathParams: any;
  queryParams: any;
  body: any;
};

export default function adaptRequest(req: Request): httpRequest {
  return Object.freeze({
    path: req.path,
    method: req.method,
    pathParams: req.params,
    queryParams: req.query,
    body: req.body,
  });
}
