import tmp from "tmp-promise";
import cleanDeep from "clean-deep";
import {promisify} from "util";
import imagemagick from "imagemagick";
export { resizeFromUrlUsingJimp as resizeFromUrl } from './resize-from-url-using-jimp';

import {createThumbFile} from "./aws-manager";

const downloadToFile = promisify(require('download-to-file'));
const resize = promisify(imagemagick.resize);
const readFile = promisify(require('fs').readFile);

export async function resizeFromUrlUsingImageick(url: string, w, h) {
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
    return await createThumbFile(buffer, url, w, h);
  } finally {
    inputFile.cleanup();
    outputFile.cleanup();
  }
}
