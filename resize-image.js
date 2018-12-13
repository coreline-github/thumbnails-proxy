import Jimp from 'jimp';
import {createThumbFile, thumbExists} from "./aws-manager";
import {checkUrl} from "./check-url";

export async function resizeImage(req, res) {
  const { url, w, h } = req.query;
  if (!url) {
    throw new Error('Missing url');
  }
  if (!w && !h) {
    throw new Error('Missing w or h');
  }

  checkUrl(url);

  if (await thumbExists(url, w, h)) {
    const resultingUrl = await createThumbFile(null, url, w, h);
    res.redirect(302, resultingUrl);
    console.log('using cache');
    return;
  }

  const image = await Jimp.read(url);
  const resized = image.resize(parseInt(w, 10) || Jimp.AUTO, parseInt(h, 10) || Jimp.AUTO);
  const buffer = await resized.getBufferAsync(Jimp.MIME_JPEG);
  const resultingUrl = await createThumbFile(buffer, url, w, h);
  res.redirect(302, resultingUrl);
}
