# npm-diff.app

[![Powered by Vercel](https://badgen.net/badge/vercel/npm-diff.app/black?icon=zeit)](https://npm-diff.app/)
[![Node.js CI](https://github.com/oBusk/npm-diff.app/actions/workflows/nodejs.yml/badge.svg)](https://github.com/oBusk/npm-diff.app/actions/workflows/nodejs.yml)
[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg)](https://github.com/prettier/prettier)
[![Dependabot: enabled](https://badgen.net/badge/dependabot/enabled/green?icon=dependabot)](https://github.com/oBusk/npm-diff.app/network/updates)

> 📦🔃 Inspect changes between npm packages in a webapp

## Install

```bash
pnpm install
```

## Development

Package search/autocomplete uses Algolia's `npm-search` index and needs
credentials in `.env.local`:

```
NEXT_PUBLIC_ALGOLIA_APP_ID=
NEXT_PUBLIC_ALGOLIA_API_KEY=
NEXT_PUBLIC_ALGOLIA_INDEX_NAME=
```

If the project is linked to Vercel, `vercel env pull` will fetch these for you.

```
pnpm run dev
```

## Deployment

Deployed automagically using [Vercel](https://vercel.com/)

[https://npm-diff.app/](https://npm-diff.app/)

## License

ISC © Oscar Busk
