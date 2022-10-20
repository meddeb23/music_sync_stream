import { httpRequest } from "../helper/adapt-request";
import makeMusicList, { musiclist } from "./music-list";

import Debug from "debug";
import makeHttpError from "../helper/http-error";

const debug = Debug("music:router");

const musicList: Readonly<musiclist> = makeMusicList();
export const handleMusicEndpoint: any = makeMusicEndpointHandler(musicList);

function makeMusicEndpointHandler(model: Readonly<musiclist>) {
  return async function handler(req: httpRequest) {
    switch (req.method) {
      case "GET":
        if (req.pathParams.id) return await getSongByName(req);
        return await getMusicList();
      default:
        return makeHttpError(404, "Not Found");
    }
  };

  async function getMusicList() {
    const songs: String[] = await musicList.getMusicList();
    return {
      headers: {
        "Content-Type": "application/json",
      },
      status: 200,
      data: {
        success: true,
        music: songs,
      },
    };
  }

  async function getSongByName(req: httpRequest) {
    return {
      data_type: "file",
      headers: {
        //   "Content-Type": "application/json",
      },
      status: 200,
      data: await musicList.getSong(req.pathParams.id),
    };
  }
}
