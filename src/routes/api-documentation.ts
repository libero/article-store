import { constants } from 'http2';
import { Next } from 'koa';
import { addAll } from 'rdf-dataset-ext';
import { toRdf } from 'rdf-literal';
import url from 'url';
import { AppContext, AppMiddleware } from '../app';
import {
  hydra, owl, rdf, schema,
} from '../namespaces';
import Routes from './index';

export default (): AppMiddleware => (
  async ({
    dataFactory: {
      blankNode, quad, literal, namedNode,
    }, request, response, router,
  }: AppContext, next: Next): Promise<void> => {
    const apiDocumentation = namedNode(
      url.resolve(request.origin, router.url(Routes.ApiDocumentation)),
    );
    const entryPoint = namedNode(url.resolve(request.origin, router.url(Routes.EntryPoint)));

    const quads = [
      quad(apiDocumentation, rdf.type, hydra.ApiDocumentation),
      quad(apiDocumentation, hydra.entrypoint, entryPoint),
    ];

    // properties
    quads.push(
      quad(schema('name'), rdf.type, rdf.Property),
      quad(hydra.manages, rdf.type, rdf.Property),
      quad(hydra.member, rdf.type, rdf.Property),
      quad(hydra.member, rdf.type, hydra.Link),
      quad(hydra.title, rdf.type, rdf.Property),
      quad(hydra.totalItems, rdf.type, rdf.Property),
    );

    // schema:EntryPoint
    const entryPointGet = blankNode();
    const entryPointName = blankNode();
    quads.push(
      quad(apiDocumentation, hydra.supportedClass, schema.EntryPoint),
      quad(schema.EntryPoint, rdf.type, hydra.Class),
      quad(schema.EntryPoint, hydra.title, literal('API entry point', 'en')),
      quad(schema.EntryPoint, hydra.supportedOperation, entryPointGet),
      quad(entryPointGet, rdf.type, hydra.Operation),
      quad(entryPointGet, hydra.title, literal('Get the entry point', 'en')),
      quad(entryPointGet, hydra.method, literal('GET')),
      quad(entryPointGet, hydra.expects, owl.Nothing),
      quad(entryPointGet, hydra.returns, schema.EntryPoint),
      quad(schema.EntryPoint, hydra.supportedProperty, entryPointName),
      quad(entryPointName, rdf.type, hydra.SupportedProperty),
      quad(entryPointName, hydra.title, literal('Name', 'en')),
      quad(entryPointName, hydra.property, schema('name')),
      quad(entryPointName, hydra.required, toRdf(true)),
      quad(entryPointName, hydra.readable, toRdf(true)),
      quad(entryPointName, hydra.writeable, toRdf(false)),
    );

    // schema:Article
    const articleName = blankNode();
    quads.push(
      quad(apiDocumentation, hydra.supportedClass, schema.Article),
      quad(schema.Article, rdf.type, hydra.Class),
      quad(schema.Article, hydra.title, literal('Article', 'en')),
      quad(schema.Article, hydra.supportedProperty, articleName),
      quad(articleName, rdf.type, hydra.SupportedProperty),
      quad(articleName, hydra.title, literal('Name', 'en')),
      quad(articleName, hydra.property, schema('name')),
      quad(articleName, hydra.required, toRdf(true)),
      quad(articleName, hydra.readable, toRdf(true)),
      quad(articleName, hydra.writeable, toRdf(true)),
    );

    // hydra:Collection
    const collectionGet = blankNode();
    const collectionAdd = blankNode();
    const collectionAdd201 = blankNode();
    const collectionName = blankNode();
    const collectionManages = blankNode();
    const collectionTotalItems = blankNode();
    const collectionMember = blankNode();
    quads.push(
      quad(apiDocumentation, hydra.supportedClass, hydra.Collection),
      quad(hydra.Collection, rdf.type, hydra.Class),
      quad(hydra.Collection, hydra.title, literal('Collection', 'en')),
      quad(hydra.Collection, hydra.supportedOperation, collectionGet),
      quad(collectionGet, rdf.type, hydra.Operation),
      quad(collectionGet, hydra.title, literal('Get the collection', 'en')),
      quad(collectionGet, hydra.method, literal('GET')),
      quad(collectionGet, hydra.expects, owl.Nothing),
      quad(collectionGet, hydra.returns, hydra.Collection),
      quad(hydra.Collection, hydra.supportedOperation, collectionAdd),
      quad(collectionAdd, rdf.type, hydra.Operation),
      quad(collectionAdd, hydra.title, literal('Add an article', 'en')),
      quad(collectionAdd, hydra.method, literal('POST')),
      quad(collectionAdd, hydra.expects, schema.Article),
      quad(collectionAdd, hydra.returns, owl.Nothing),
      quad(collectionAdd, hydra.possibleStatus, collectionAdd201),
      quad(collectionAdd201, hydra.statusCode, toRdf(constants.HTTP_STATUS_CREATED)),
      quad(collectionAdd201, hydra.description, literal('If the article was added successfully', 'en')),
      quad(hydra.Collection, hydra.supportedProperty, collectionName),
      quad(collectionName, rdf.type, hydra.SupportedProperty),
      quad(collectionName, hydra.title, literal('Title', 'en')),
      quad(collectionName, hydra.property, hydra.title),
      quad(hydra.title, rdf.type, rdf.Property),
      quad(collectionName, hydra.required, toRdf(true)),
      quad(collectionName, hydra.readable, toRdf(true)),
      quad(collectionName, hydra.writeable, toRdf(false)),
      quad(hydra.Collection, hydra.supportedProperty, collectionManages),
      quad(collectionManages, rdf.type, hydra.SupportedProperty),
      quad(collectionManages, hydra.title, literal('What the collection manages', 'en')),
      quad(collectionManages, hydra.property, hydra.manages),
      quad(collectionManages, hydra.required, toRdf(true)),
      quad(collectionManages, hydra.readable, toRdf(true)),
      quad(collectionManages, hydra.writeable, toRdf(false)),
      quad(hydra.Collection, hydra.supportedProperty, collectionTotalItems),
      quad(collectionTotalItems, rdf.type, hydra.SupportedProperty),
      quad(collectionTotalItems, hydra.title, literal('Total items', 'en')),
      quad(collectionTotalItems, hydra.property, hydra.totalItems),
      quad(hydra.totalItems, rdf.type, rdf.Property),
      quad(collectionTotalItems, hydra.required, toRdf(true)),
      quad(collectionTotalItems, hydra.readable, toRdf(true)),
      quad(collectionTotalItems, hydra.writeable, toRdf(false)),
      quad(hydra.Collection, hydra.supportedProperty, collectionMember),
      quad(collectionMember, rdf.type, hydra.SupportedProperty),
      quad(collectionMember, hydra.title, literal('Members of this collection', 'en')),
      quad(collectionMember, hydra.property, hydra.member),
      quad(hydra.member, rdf.type, rdf.Property),
      quad(hydra.member, rdf.type, hydra.Link),
      quad(collectionMember, hydra.required, toRdf(true)),
      quad(collectionMember, hydra.readable, toRdf(false)),
      quad(collectionMember, hydra.writeable, toRdf(false)),
    );

    addAll(response.dataset, quads);

    response.status = constants.HTTP_STATUS_OK;

    await next();
  }
);
