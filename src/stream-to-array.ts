import { Quad, Stream } from 'rdf-js';
import streamToArray from 'stream-to-array';

export default async (stream: Stream): Promise<Array<Quad>> => (
  streamToArray(stream as Stream & NodeJS.ReadableStream)
);
