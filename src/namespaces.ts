import namespace from '@rdfjs/namespace';

const namespaces = {
  hydra: 'http://www.w3.org/ns/hydra/core#',
  owl: 'http://www.w3.org/2002/07/owl#',
  rdf: 'http://www.w3.org/1999/02/22-rdf-syntax-ns#',
  schema: 'http://schema.org/',
} as const;

export const hydra = namespace(namespaces.hydra);
export const owl = namespace(namespaces.owl);
export const rdf = namespace(namespaces.rdf);
export const schema = namespace(namespaces.schema);

export default namespaces;
