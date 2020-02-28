[![Libero](https://cdn.elifesciences.org/libero/logo/libero-logo-96px.svg)](https://libero.pub/)

Article Store
=============

[![Build status](https://img.shields.io/github/workflow/status/libero/article-store/CI/master?style=flat-square&logo=github)](https://github.com/libero/article-store/actions?query=branch%3Amaster+workflow%3ACI)
[![Docker pulls](https://img.shields.io/docker/pulls/liberoadmin/article-store?style=flat-square&logo=docker&logoColor=white)](https://hub.docker.com/r/liberoadmin/article-store)
[![License](https://img.shields.io/github/license/libero/article-store?style=flat-square)](LICENSE.md)

This app provides a hypermedia API for storing articles ().

An article is an RDF graph, where the root node is a  [`http://schema.org/Article`](https://schema.org/Article).

It uses the [Hydra vocabulary](http://www.hydra-cg.com/spec/latest/core/), and follows the [Libero API](https://libero.pub/api) standard.

It's written in [TypeScript](https://www.typescriptlang.org/), uses the [Koa framework](https://koajs.com/), and various [RDF/JS libraries](https://rdf.js.org/).

<details>

<summary>Further reading</summary>

- [Libero API Specification](https://libero.pub/api)
- [RDF 1.1 Primer](https://www.w3.org/TR/rdf11-primer/)
- [Hydra Core Vocabulary](https://www.hydra-cg.com/spec/latest/core/)
- [RDF JavaScript Libraries](https://rdf.js.org/)
  - [Data Model Specification](https://rdf.js.org/data-model-spec/)
  - [Dataset Specification](https://rdf.js.org/dataset-spec/)

</details>

Installation
------------

The app is published on Docker Hub as [`liberoadmin/article-store`](https://hub.docker.com/r/liberoadmin/article-store).

As it is still under heavy development, there are not yet tagged releases. However, an image is available for every commit.

<details>

<summary>Configuration</summary>

It requires the following environment variables when run:

| Name                | Description                           |
|---------------------|---------------------------------------|
| `DATABASE_HOST`     | PostgreSQL hostname, e.g. example.com |
| `DATABASE_NAME`     | Name of the database                  |
| `DATABASE_PASSWORD` | Password for the user                 |
| `DATABASE_PORT`     | PostgreSQL port, e.g. 5432            |
| `DATABASE_USER`     | PostgreSQL Username                   |

Port `8080` is exposed.

</details>

<details>

<summary>Docker Compose example</summary>

```yaml
services:
  app:
    image: liberoadmin/article-store:latest
    environment:
      DATABASE_NAME: article-store
      DATABASE_USER: user
      DATABASE_PASSWORD: secret
      DATABASE_HOST: example.com
      DATABASE_PORT: 5432
    ports:
      - '8080:8080'
```

</details>

Local usage
-----------

<details>

<summary>Requirements</summary>

- [Docker](https://www.docker.com/)
- [GNU Bash](https://www.gnu.org/software/bash/)
- [GNU Make](https://www.gnu.org/software/make/)
- [Node.js](https://nodejs.org/) (for development)

</details>

To build and run the app for development, execute:

```shell
make dev
```

You can now access the entry point at <http://localhost:8080>, or view the console at <http://localhost:8081>.

### Running the tests

To run all of the tests, execute:

```shell
make test
```

The tests can also be run in separate suites:

```shell
make unit-test
make integration-test
```

### Linting

The code can be linted by executing:

```shell
make lint
```

And to automatically fix, where possible:

```shell
make fix
```

Getting help
------------

- Report a bug or request a feature on [GitHub](https://github.com/libero/publisher/issues/new/choose).
- Ask a question on the [Libero Community Slack](https://libero.pub/join-slack).
- Read the [code of conduct](https://libero.pub/code-of-conduct).

License
-------

This software is released under the [MIT license](LICENSE.md).
