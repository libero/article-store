export default class ArticleHasIncorrectType extends Error {
  constructor(type?: string) {
    super(`Article type must be http://schema.org/Article (${type ? `'${type}'` : 'none'} was given)`);
  }
}
