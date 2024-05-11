# Nodejs libraries universal boilerplate

## Overview
This repository hosts npm libraries for kick-starting a NestJS application.

## Prerequisites
- Node.js 20.x
- Yarn 4 with Corepack

## Installation

### Node.js
Install Node.js version 20.x from the official website: https://nodejs.org/

### Yarn with Corepack
Enable Corepack to manage Yarn installations:

```bash
corepack enable
yarn set version 4
```

## Using TurboRepo

TurboRepo is used to manage and scale monorepos efficiently.
Learn more about TurboRepo and how to use it here: https://turborepo.org/docs

## Committing Code

We are using Commitlint and Husky to ensure commit standards:

- Commitlint checks if your commit messages meet the conventional commit format.
- Husky enforces these rules pre-commit, making sure bad commits are never pushed.

