import { Request, Response, Router } from "express";
import path from "path";
import adaptRequest, { httpRequest } from "../helper/adapt-request";
import { handleMusicEndpoint } from "./controller";

const router = Router();

router.all("/", musicController);
router.all("/:id", musicController);

async function musicController(req: Request, res: Response) {
  const httpRequest: httpRequest = adaptRequest(req);
  const { headers, status, data, data_type } = await handleMusicEndpoint(
    httpRequest
  );
  if (data_type === "file") {
    console.log({ headers, status, data, data_type });
    res.status(status).sendFile(data);
  } else {
    res.status(status).set(headers).json(data);
  }
}

export default router;
