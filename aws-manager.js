import { S3 } from 'aws-sdk';
import Jimp from 'jimp';
import slugify from 'slugify';
import bluebird from 'bluebird';

const Bucket = process.env.S3_BUCKET;

const s3 = new S3({ apiVersion: '2006-03-01' });

bluebird.promisifyAll(s3);

export function getThumbKey(originalUrl: string, w, h) {
  return `thumb/${slugify(originalUrl)}/${w}/${h}`;
}

export function getThumbKeyPrefix(originalUrl: string) {
  return `thumb/${slugify(originalUrl)}/`;
}

export async function deleteThumb(url: string) {
  const Prefix = getThumbKeyPrefix(url);
  const result = await s3.listObjectsV2Async({
    Bucket,
    Prefix,
  });

  const keys = result.Contents.map(c => c.Key);
  await bluebird.map(keys, async Key => {
    try {
      await s3.deleteObjectAsync({
        Bucket,
        Key,
      });
      console.log('deleted', Key);
    } catch (e) {
      console.error('error deleting image', e, url, Key);
    }
  });
}

export async function thumbExists(originalUrl: string, w, h) {
  const Key = getThumbKey(originalUrl, w, h);

  const result = await s3.listObjectsV2Async({
    Bucket,
    Prefix: Key,
  });

  return result.Contents.length > 0;
}

export async function createThumbFile(buffer: Buffer, originalUrl: string, w, h) {
  const Key = getThumbKey(originalUrl, w, h);

  if (buffer) {
    await s3.putObjectAsync({
      Body: buffer,
      Bucket,
      Key,
      ContentType: Jimp.MIME_JPEG,
      ACL: 'public-read',
    });
  }

  return `https://s3-${process.env.AWS_DEFAULT_REGION}.amazonaws.com/${process.env.S3_BUCKET}/${Key}`;
}
