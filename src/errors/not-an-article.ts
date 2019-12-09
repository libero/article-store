export default class NotAnArticle extends Error {
  constructor(type?: string | Array<string>) {
    const typeList = (typeof type === 'string') ? [type] : type;
    super(`Article type must be http://schema.org/Article (${typeList ? `'${typeList.join(', ')}'` : 'none'} was given)`);
  }
}
