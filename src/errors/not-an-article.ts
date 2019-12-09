export default class NotAnArticle extends Error {
  constructor(types: Array<string> = []) {
    super(`Article type must be http://schema.org/Article (${types.length ? `'${types.join(', ')}'` : 'none'} was given)`);
  }
}
