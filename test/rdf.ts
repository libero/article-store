import { Response } from 'koa';
import { Quad, Source } from 'rdf-js';
import isSource from '../src/is-source';
import streamToArray from '../src/stream-to-array';

export const captureSource = (response: Response): Source => {
  if (!isSource(response.body)) {
    throw new TypeError('not a source');
  }

  return response.body;
};

export const captureQuads = async (response: Response): Promise<Array<Quad>> => (
  streamToArray(captureSource(response).match())
);
