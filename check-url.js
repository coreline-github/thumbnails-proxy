export function checkUrl(url: String) {
  if (!url.includes('process.env.S3_BUCKET')) {
    throw new Error('Given url is not allowed');
  }
}
