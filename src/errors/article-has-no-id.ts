export default class ArticleHasNoId extends Error {
  constructor() {
    super('Article must have an ID');
  }
}
