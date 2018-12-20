import jimp from "jimp";

import {createThumbFile} from "./aws-manager";

export async function resizeFromUrlUsingJimp(url: string, w, h) {
  const image = await jimp.read(url);
  const resizedBuffer = await image
  .resize(w || jimp.AUTO, h || jimp.AUTO)
  .getBufferAsync(jimp.MIME_JPEG);

  return await createThumbFile(resizedBuffer, url, w, h);
}
