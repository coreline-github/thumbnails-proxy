import { createThumbFile, thumbExists } from "./aws-manager";
import { checkUrl } from "./check-url";
import {resizeFromUrl} from "./resize-from-url";

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
    return;
  }

  const resultingUrl = await resizeFromUrl(url, w, h);
  res.redirect(302, resultingUrl);
}
