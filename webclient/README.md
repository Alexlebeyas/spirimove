# Spiri-Move Web Client

## Recommended IDE Setup

- [VSCode](https://code.visualstudio.com/)
- [Eslint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint)
- [Prettier](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode)
  - Don't forget to change you default formatter to Prettier and check the Format On Save checkbox
- [Tailwind CSS IntelliSense](https://marketplace.visualstudio.com/items?itemName=bradlc.vscode-tailwindcss)
  - This works with Prettier to reorder the class names
- Absolute path auto import (change typescript.preferences.importModuleSpecifier to `non-relative`)

## Project Setup

You'll need to get [Node.js v18+](https://nodejs.org/en) installed on your local environement.

* Create your local environment

```sh
cp .env.sample .env.local
```

This will configure your app to talk to your local Django backend. If you want to point to the real production environment instead, edit `.env.local` and change the value of `VITE_SPIRI_MOVE_API_URL`: 

```
VITE_SPIRI_MOVE_API_URL="https://spiri-move-be.azurewebsites.net/"
```

* Install node dependencies 

```sh
npm install
```

### Compile and Hot-Reload for Development

```sh
npm run dev
```
