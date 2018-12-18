import 'dotenv/config';
import normalizeUrl from 'normalize-url';
import {listUrlsByPrefix} from "../aws-manager";
import {resizeFromUrl} from "../resize-from-url";

const usage = `
  USAGE: nnode scripts/create-thumbs-for-s3-directory <directory> <start-index> <width or auto> <height or auto>
`;

const directoryName = process.argv[2];
if (!directoryName) {
  throw new Error(usage);
}

const startIndex = parseInt(process.argv[3], 10);
if (isNaN(startIndex)) {
  throw new Error(usage);
}

const width = parseInt(process.argv[4], 10) || undefined;
const height = parseInt(process.argv[5], 10) || undefined;
if (!width && !height) {
  throw new Error('Width or height must be defined');
}

(async () => {
  const allUrls = await listUrlsByPrefix(directoryName);
  console.log(`Total images ${allUrls.length}`);
  for (let i = startIndex; i < allUrls.length; i += 1) {
    const url = normalizeUrl(allUrls[i]);
    console.log('resizing:');
    console.log(url);
    console.log('resize OK for index', i, await resizeFromUrl(url, undefined, 150));
  }
})();
