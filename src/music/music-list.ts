import { readdir } from "fs/promises";
import { join } from "path";

export type musiclist = {
  getMusicList: () => Promise<String[] | null>;
  getSong: (name: string) => Promise<string>;
};

export default function makeMusicList() {
  const MUSIC_PATH = ["C:\\Users\\medde\\Downloads\\music"];
  return Object.freeze({
    getMusicList,
    getSong,
  });

  async function getMusicList(): Promise<String[] | null> {
    //joining path of directory
    try {
      let files: String[] = await readdir(MUSIC_PATH[0]);
      files = files.filter((i) => i.includes(".mp3"));
      //   files.forEach(function (file) {
      //     console.log(file);
      //   });
      return files;
    } catch (err) {
      console.log("Unable to scan directory: " + err);
    }
  }

  async function getSong(name: string): Promise<string> {
    return join(MUSIC_PATH[0], name);
  }
}
