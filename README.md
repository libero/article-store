<h1 align="center">
  <a href="https://libero.pub/">
    <img src="https://cdn.elifesciences.org/libero/logo/libero-logo-96px.svg" height="64px" alt="Libero">
  </a>
  <br>
  Article Store
</h1>

<div align="center">

<a href="https://github.com/libero/article-store/actions?query=branch%3Amaster+workflow%3ACI">
  <img src="https://img.shields.io/github/workflow/status/libero/article-store/CI/master?style=flat-square&logo=github"
    alt="Build status">
</a>
<a href="https://github.com/libero/publisher/issues?q=is%3Aissue+is%3Aopen+label%3Aarticle-store">
  <img src="https://img.shields.io/github/issues/libero/publisher/article-store?label=issues&logo=github&style=flat-square"
    alt="Issues">
</a>
<a href="https://hub.docker.com/r/liberoadmin/article-store&cacheSeconds=3600">
  <img src="https://img.shields.io/docker/pulls/liberoadmin/article-store?style=flat-square&logo=docker&logoColor=white"
    alt="Docker pulls">
</a>
<a href="LICENSE.md">
  <img src="https://img.shields.io/github/license/libero/article-store?style=flat-square&cacheSeconds=86400"
    alt="License">
</a>
<a href="https://libero.pub/join-slack">
  <img src="https://img.shields.io/badge/slack-libero--community-green?style=flat-square&logo=slack" alt="Slack">
</a>

</div>

<br><br>

This app provides a hypermedia API for storing articles ().

An article is an RDF graph, where the root node is a [`http://schema.org/Article`][schema:Article].

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

📙 Installation
---------------

The app is published on Docker Hub as [`liberoadmin/article-store`][Docker image].

As it is still under heavy development, there are not yet tagged releases. However, an image is available for every
commit.

<details>

<summary>Configuration</summary>

It requires the following environment variables when run:

| Name                | Description                           |
|---------------------|---------------------------------------|
| `DATABASE_HOST`     | PostgreSQL hostname, e.g. example.com |
| `DATABASE_NAME`     | Name of the database                  |
| `DATABASE_PASSWORD` | Password for the user                 |
| `DATABASE_PORT`     | PostgreSQL port, e.g. 5432            |
| `DATABASE_USER`     | PostgreSQL username                   |

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

⚒️ Local usage
--------------

<details>

<summary>Requirements</summary>

- [Docker]
- [GNU Bash]
- [GNU Make]
- [Node.js]

</details>

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

💁 Getting help
---------------

- Report a bug or request a feature on [GitHub][new issue].
- Ask a question on the [Libero Community Slack].
- Read the [code of conduct].

📜 License
----------

This software is released under the [MIT license][license].

[Docker]: https://www.docker.com/
[Docker image]: https://hub.docker.com/r/liberoadmin/article-store
[ESLint]: https://eslint.org/
[Code of conduct]: https://libero.pub/code-of-conduct
[GNU Bash]: https://www.gnu.org/software/bash/
[GNU Make]: https://www.gnu.org/software/make/
[Hydra vocabulary]: http://www.hydra-cg.com/spec/latest/core/
[Jest]: https://jestjs.io/
[Koa]: https://koajs.com/
[Libero API Specification]: https://libero.pub/api
[Libero Community Slack]: https://libero.pub/join-slack
[License]: LICENSE.md
[New issue]: https://github.com/libero/publisher/issues/new/choose
[Node.js]: https://nodejs.org/
[RDF 1.1 Primer]: https://www.w3.org/TR/rdf11-primer/
[RDF/JS]: https://rdf.js.org/
[RDF/JS data model]: https://rdf.js.org/data-model-spec/
[RDF/JS dataset]: https://rdf.js.org/dataset-spec/
[TypeScript]: https://www.typescriptlang.org/

[schema:Article]: https://schema.org/Article
