[![Libero][Libero logo]][Libero]  
  
Article Store
=============

[![Build status][Build badge]][Build]
[![Open issues][Open issues badge]][Open issues]
[![Docker pulls][Docker pulls badge]][Docker image]
[![License][License badge]][License]
[![Slack][Slack badge]][Libero Community Slack]

This app provides a HTTP API for creating, maintaining and reading articles.

An article is an [RDF graph], where the root node is a [`http://schema.org/Article`][schema:Article].

It can be represented in [JSON-LD] like: 

```json
{
  "@context": {
    "@vocab": "http://schema.org/"
  },
  "@id": "http://example.com/my-article-store/articles/1234567890",
  "@type": "Article",
  "name": "My article",
  [...]
}
```

It uses the [Hydra vocabulary], and follows the [Libero API specification].

It's written in [TypeScript], uses the [Koa framework][Koa], and various
[RDF/JS libraries][RDF/JS].

<details>

<summary>Further reading</summary>

- [Libero API Specification]
- [RDF 1.1 Primer]
- [Hydra Core Vocabulary][Hydra vocabulary]
- [RDF JavaScript Libraries][RDF/JS]
  - [Data Model Specification][RDF/JS data model]
  - [Dataset Specification][RDF/JS dataset]

</details>

Table of contents
-----------------

1. [Installation](#installation)
2. [Development](#development)
3. [Getting help](#getting-help)
4. [License](#license)

---

Installation
------------

The app is published on Docker Hub as [`liberoadmin/article-store`][Docker image].

As it is still under heavy development, there are not yet tagged releases. However, an image is available for every
commit.

### Running an Article Store

1. Start a PostgreSQL container by executing:

   ```shell
   docker run -d --name article-store-database \
     -e "POSTGRES_DB=article-store" \
     -e "POSTGRES_USER=user" \
     postgres:11.5-alpine
   ```

2. Run the database creation with an ephemeral Article Store container:

   ```shell
   docker run --rm \
     --link article-store-database \
     -e "DATABASE_HOST=article-store-database" \
     -e "DATABASE_NAME=article-store" \
     -e "DATABASE_USER=user" \
     liberoadmin/article-store:latest npm run initdb
   ```

3. Run an Article Store container and link it to the database container:

   ```shell
   docker run \
     --link article-store-database \
     -e "DATABASE_HOST=article-store-database" \
     -e "DATABASE_NAME=article-store" \
     -e "DATABASE_USER=user" \
     -p 8080:8080 \
     liberoadmin/article-store:latest
   ```

4. Access the Article Store entry point:

   ```shell
   curl --verbose localhost:8080
   ```

### Configuration

The following environment variables can be set:

#### `DATABASE_HOST`

This variable is mandatory is the PostgreSQL hostname.

#### `DATABASE_NAME`

This variable is mandatory and is the name of the PostgreSQL database.

#### `DATABASE_USER`

This variable is mandatory and is the name of the PostgreSQL user.

#### `DATABASE_PASSWORD`

This variable is optional and is the password of the PostgreSQL user (default is blank).

#### `DATABASE_PORT`

This variable is optional and is the PostgreSQL port (default `5432`).

Development
-----------

<details>

<summary>Requirements</summary>

- [Docker]
- [GNU Bash]
- [GNU Make]
- [Node.js]

</details>

The project contains a [Makefile] which uses [Docker Compose] for development and testing.

You can find the possible commands by executing:

```shell
make help
```

### Running the app

To build and run the app for development, execute:

```shell
make dev
```

You can now access the entry point at <http://localhost:8080>, or view the console at <http://localhost:8081>.

<details>

<summary>Rebuilding the container</summary>

Code is attached to the containers as volumes so most updates are visible without a need to rebuild the container.
However, changes to NPM dependencies, for example, require a rebuild. So you may need to execute

```shell
make build
```

before running further commands.

</details>

### Running the tests

The app is tested using [Jest]. It can be run by executing: 

```shell
make test
```

The tests can also be run in separate suites:

```shell
make unit-test
make integration-test
```

Integration tests are separated using the `@group integration` annotation, and can access a PostgreSQL instance. 

### Linting

The app is linted using [ESLint]. It can be run by executing:

```shell
make lint
```

Problems can be automatically fix, where possible, by executing:

```shell
make fix
```

Getting help
------------

- Report a bug or request a feature on [GitHub][new issue].
- Ask a question on the [Libero Community Slack].
- Read the [code of conduct].

License
-------

This software is released under the [MIT license][license]. Copyright © 2019 [eLife Sciences Publications, Ltd][eLife].

[Build]: https://github.com/libero/article-store/actions?query=branch%3Amaster+workflow%3ACI
[Build badge]: https://flat.badgen.net/github/checks/libero/article-store?label=build&icon=github
[Docker]: https://www.docker.com/
[Docker Compose]: https://docs.docker.com/compose/
[Docker image]: https://hub.docker.com/r/liberoadmin/article-store
[Docker pulls badge]: https://flat.badgen.net/docker/pulls/liberoadmin/article-store?icon=docker
[eLife]: https://elifesciences.org/
[ESLint]: https://eslint.org/
[Code of conduct]: https://libero.pub/code-of-conduct
[GNU Bash]: https://www.gnu.org/software/bash/
[GNU Make]: https://www.gnu.org/software/make/
[Hydra vocabulary]: http://www.hydra-cg.com/spec/latest/core/
[Jest]: https://jestjs.io/
[JSON-LD]: https://json-ld.org/
[Koa]: https://koajs.com/
[Libero]: https://libero.pub/
[Libero API Specification]: https://libero.pub/api
[Libero Community Slack]: https://libero.pub/join-slack
[Libero logo]: https://cdn.elifesciences.org/libero/logo/libero-logo-96px.svg
[License]: LICENSE.md
[License badge]: https://flat.badgen.net/badge/license/MIT/blue
[Makefile]: Makefile
[New issue]: https://github.com/libero/publisher/issues/new/choose
[Node.js]: https://nodejs.org/
[Open issues]: https://github.com/libero/publisher/issues?q=is%3Aissue+is%3Aopen+label%3Aarticle-store
[Open issues badge]: https://flat.badgen.net/github/label-issues/libero/publisher/article-store/open?icon=github&label=open%20issues&color=pink
[RDF 1.1 Primer]: https://www.w3.org/TR/rdf11-primer/
[RDF graph]: https://www.w3.org/TR/rdf11-concepts/#section-rdf-graph
[RDF/JS]: https://rdf.js.org/
[RDF/JS data model]: https://rdf.js.org/data-model-spec/
[RDF/JS dataset]: https://rdf.js.org/dataset-spec/
[Slack badge]: https://flat.badgen.net/badge/icon/libero-community?icon=slack&label=slack&color=orange
[TypeScript]: https://www.typescriptlang.org/

[schema:Article]: https://schema.org/Article
