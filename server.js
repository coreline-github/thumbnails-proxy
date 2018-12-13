import express from 'express';
import bodyParser from 'body-parser';
import 'dotenv/config'

import { resizeImage } from './resize-image';
import { deleteImage } from "./delete-image";

const app = express();

const port = process.env.PORT || '3000';

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

const expressAsyncHandler = (f) => async (req, res, next) => {
  try {
    await f(req, res, next);
  } catch (e) {
    console.error('Unhandled error', e);
    next(e);
  }
};

app.get('/', (req, res) => res.send('thumbnails proxy'));
app.get('/resize', expressAsyncHandler(resizeImage));
app.all('/delete', expressAsyncHandler(deleteImage));

app.listen(port, () => console.log(`Thumbnails proxy listening on port ${port}!`));
