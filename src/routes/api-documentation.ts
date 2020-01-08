import clownface, { Clownface } from 'clownface';
import { constants } from 'http2';
import { Next } from 'koa';
import { NamedNode } from 'rdf-js';
import { toRdf } from 'rdf-literal';
import url from 'url';
import { AppContext, AppMiddleware } from '../app';
import {
  hydra, owl, rdf, schema,
} from '../namespaces';
import Routes from './index';

export default (): AppMiddleware => (
  async ({
    dataFactory: { literal, namedNode }, request, response, router,
  }: AppContext, next: Next): Promise<void> => {
    const createNamedNode = (route: Routes): NamedNode => namedNode(url.resolve(request.origin, router.url(route)));

    const graph = clownface({
      dataset: response.dataset,
      term: createNamedNode(Routes.ApiDocumentation),
    });

    graph.addOut(rdf.type, hydra.ApiDocumentation);
    graph.addOut(hydra.entrypoint, createNamedNode(Routes.EntryPoint));

    graph.addOut(hydra.supportedClass, schema.EntryPoint, (entryPoint: Clownface): void => {
      entryPoint.addOut(rdf.type, hydra.Class);
      entryPoint.addOut(hydra.title, literal('API entry point', 'en'));

      entryPoint.addOut(hydra.supportedOperation, (get: Clownface): void => {
        get.addOut(rdf.type, hydra.Operation);
        get.addOut(rdf.type, schema.DownloadAction);
        get.addOut(hydra.title, literal('Get the entry point', 'en'));
        get.addOut(hydra.method, literal('GET'));
        get.addOut(hydra.expects, owl.Nothing);
        get.addOut(hydra.returns, schema.EntryPoint);
      });

      entryPoint.addOut(hydra.supportedProperty, (name: Clownface): void => {
        name.addOut(rdf.type, hydra.SupportedProperty);
        name.addOut(hydra.title, literal('Name', 'en'));
        name.addOut(hydra.property, schema('name'), (property: Clownface): void => {
          property.addOut(rdf.type, rdf.Property);
        });
        name.addOut(hydra.required, true);
        name.addOut(hydra.readable, true);
        name.addOut(hydra.writeable, toRdf(false));
      });

      entryPoint.addOut(hydra.supportedProperty, (collection: Clownface): void => {
        collection.addOut(rdf.type, hydra.SupportedProperty);
        collection.addOut(hydra.title, literal('Collection', 'en'));
        collection.addOut(hydra.property, hydra.collection, (property: Clownface): void => {
          property.addOut(rdf.type, rdf.Property);
          property.addOut(rdf.type, hydra.Link);
        });
        collection.addOut(hydra.required, true);
        collection.addOut(hydra.readable, true);
        collection.addOut(hydra.writeable, toRdf(false));
      });
    });

    graph.addOut(hydra.supportedClass, schema.Article, (article: Clownface): void => {
      article.addOut(rdf.type, hydra.Class);
      article.addOut(hydra.title, literal('Article', 'en'));

      article.addOut(hydra.supportedProperty, (name: Clownface): void => {
        name.addOut(rdf.type, hydra.SupportedProperty);
        name.addOut(hydra.title, literal('Name', 'en'));
        name.addOut(hydra.property, schema('name'), (property: Clownface): void => {
          property.addOut(rdf.type, rdf.Property);
        });
        name.addOut(hydra.required, true);
        name.addOut(hydra.readable, true);
        name.addOut(hydra.writeable, true);
      });
    });

    graph.addOut(hydra.supportedClass, hydra.Collection, (collection: Clownface): void => {
      collection.addOut(rdf.type, hydra.Class);
      collection.addOut(hydra.title, literal('Collection', 'en'));

      collection.addOut(hydra.supportedOperation, (get: Clownface): void => {
        get.addOut(rdf.type, hydra.Operation);
        get.addOut(rdf.type, schema.DownloadAction);
        get.addOut(hydra.title, literal('Get the collection', 'en'));
        get.addOut(hydra.method, literal('GET'));
        get.addOut(hydra.expects, owl.Nothing);
        get.addOut(hydra.returns, hydra.Collection);
      });

      collection.addOut(hydra.supportedOperation, (add: Clownface): void => {
        add.addOut(rdf.type, hydra.Operation);
        add.addOut(rdf.type, schema.AddAction);
        add.addOut(hydra.title, literal('Add an article', 'en'));
        add.addOut(hydra.method, literal('POST'));
        add.addOut(hydra.expects, schema.Article);
        add.addOut(hydra.returns, owl.Nothing);
        add.addOut(hydra.possibleStatus, (status: Clownface): void => {
          status.addOut(hydra.statusCode, constants.HTTP_STATUS_CREATED);
          status.addOut(hydra.description, literal('If the article was added successfully', 'en'));
        });
      });

      collection.addOut(hydra.supportedProperty, (name: Clownface): void => {
        name.addOut(rdf.type, hydra.SupportedProperty);
        name.addOut(hydra.title, literal('Title', 'en'));
        name.addOut(hydra.property, hydra.title, (property: Clownface): void => {
          property.addOut(rdf.type, rdf.Property);
        });
        name.addOut(hydra.required, true);
        name.addOut(hydra.readable, true);
        name.addOut(hydra.writeable, toRdf(false));
      });

      collection.addOut(hydra.supportedProperty, (manages: Clownface): void => {
        manages.addOut(rdf.type, hydra.SupportedProperty);
        manages.addOut(hydra.title, literal('What the collection manages', 'en'));
        manages.addOut(hydra.property, hydra.manages, (property: Clownface): void => {
          property.addOut(rdf.type, rdf.Property);
        });
        manages.addOut(hydra.required, true);
        manages.addOut(hydra.readable, true);
        manages.addOut(hydra.writeable, toRdf(false));
      });

      collection.addOut(hydra.supportedProperty, (totalItems: Clownface): void => {
        totalItems.addOut(rdf.type, hydra.SupportedProperty);
        totalItems.addOut(hydra.title, literal('Total items', 'en'));
        totalItems.addOut(hydra.property, hydra.totalItems, (property: Clownface): void => {
          property.addOut(rdf.type, rdf.Property);
        });
        totalItems.addOut(hydra.required, true);
        totalItems.addOut(hydra.readable, true);
        totalItems.addOut(hydra.writeable, toRdf(false));
      });

      collection.addOut(hydra.supportedProperty, (members: Clownface): void => {
        members.addOut(rdf.type, hydra.SupportedProperty);
        members.addOut(hydra.title, literal('Members of this collection', 'en'));
        members.addOut(hydra.property, hydra.members, (property: Clownface): void => {
          property.addOut(rdf.type, rdf.Property);
          property.addOut(rdf.type, hydra.Link);
        });
        members.addOut(hydra.required, true);
        members.addOut(hydra.readable, true);
        members.addOut(hydra.writeable, toRdf(false));
      });
    });

    response.status = constants.HTTP_STATUS_OK;

    await next();
  }
);
