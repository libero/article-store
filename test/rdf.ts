import { Response } from 'koa';
import { Quad, Source, Stream } from 'rdf-js';
import streamToArray from 'stream-to-array';
import isSource from '../src/is-source';

export const captureSource = (response: Response): Source => {
  if (!isSource(response.body)) {
    throw new TypeError('not a source');
  }

  return response.body;
};

export const toArray = async (stream: Stream): Promise<Array<Quad>> => (
  streamToArray(stream as Stream & NodeJS.ReadableStream)
);

export const captureQuads = async (response: Response): Promise<Array<Quad>> => (
  toArray(captureSource(response).match())
);
