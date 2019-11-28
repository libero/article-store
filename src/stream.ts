import { BaseQuad, Quad, Stream } from 'rdf-js';
import { Readable } from 'stream';

export const fromArray = <Q extends BaseQuad = Quad>(quads: Array<Q>):
  Stream<Q> & NodeJS.ReadableStream => {
  const stream = new Readable({
    objectMode: true,
    read: (): void => {
      quads.forEach((quad: Q) => {
        stream.push(quad);
      });

      stream.push(null);
    },
  });

  return stream;
};

export const toReadable = <Q extends BaseQuad = Quad>(quads: Stream<Q>):
  Stream<Q> & NodeJS.ReadableStream => quads as Stream<Q> & NodeJS.ReadableStream;
