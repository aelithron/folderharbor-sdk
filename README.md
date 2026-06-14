# FolderHarbor TypeScript SDK
A fully-featured TypeScript SDK for [FolderHarbor](https://fh.novatea.dev)! \
This was made for Hack Club [Macondo](https://macondo.hackclub.com/?ref=MYUG5) :3
## Installation
Run the correct command for your package manager:
- NPM: `npm install @folderharbor/sdk`
- Yarn: `yarn add @folderharbor/sdk`
- PNPM: `pnpm add @folderharbor/sdk`
- Bun: `bun install @folderharbor/sdk`
## Usage
To use this SDK in your own code, you need a running [FolderHarbor Server](https://fh.novatea.dev/server). \
(if you're just playing around, you can use the official demo, `https://demo.fh.novatea.dev`!)

Once you have one, you can follow either of these starting structures!
### With Username/Password
```ts
const client = new FolderHarbor({ server: "[your server address]" }); // set up the client
await client.auth.login({ username: "[your username]", password: "[your password]" }); // log in
// and you're ready to make calls! :3c
```
### With Token
This is if you already have a token for the FolderHarbor server, say if you are making a CLI tool and have the user's token stored on-device.
```ts
const client = new FolderHarbor({ server: "[your server address]", token: "[your token]" }); // set up and authenticate
// and you're ready to make calls!
```
## Features
- Easy setup and usage
- Full TypeScript types for methods
- Full JSDoc coverage for methods
- Proper error handling (with custom errors like `FHRequestError` and `FHAuthError`)
- Official way to interact with FolderHarbor servers!