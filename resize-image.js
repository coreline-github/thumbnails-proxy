import Jimp from 'jimp';
import tmp from 'tmp-promise';
import imagemagick from 'imagemagick';
import { promisify } from 'util';
import cleanDeep from 'clean-deep';
import { createThumbFile, thumbExists } from "./aws-manager";
import { checkUrl } from "./check-url";

const downloadToFile = promisify(require('download-to-file'));
const resize = promisify(imagemagick.resize);
const readFile = promisify(require('fs').readFile);

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

  const inputFile = await tmp.file();
  const outputFile = await tmp.file();
  try {
    await downloadToFile(url, inputFile.path);
    await resize(cleanDeep({
      srcPath: inputFile.path,
      dstPath: outputFile.path,
      width: w,
      height: h,
    }));
    const buffer = await readFile(outputFile.path);
    const resultingUrl = await createThumbFile(buffer, url, w, h);
    res.redirect(302, resultingUrl);
  } finally {
    inputFile.cleanup();
    outputFile.cleanup();
  }
}
