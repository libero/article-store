export default class ArticeHasNoId extends Error {
  constructor() {
    super('Article must have an ID');
  }
}
