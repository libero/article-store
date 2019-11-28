import { Source } from 'rdf-js';

export default (arg: unknown): arg is Source => typeof arg === 'object' && 'match' in arg;
