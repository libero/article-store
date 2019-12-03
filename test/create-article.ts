import { Iri, JsonLdObj } from 'jsonld/jsonld-spec';

export default (id?: Iri, name = `Article ${id}`): JsonLdObj => {
  const article = {
    '@id': id,
    '@type': 'http://schema.org/Article',
    'http://schema.org/name': name,
  };

  Object.keys(article).forEach((key) => (article[key] == null) && delete article[key]);

  return article;
};
