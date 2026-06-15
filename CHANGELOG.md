# Changelog
This is mostly just a placeholder until I build these into [fh.novatea.dev](https://fh.novatea.dev)! :3 \
This SDK will stay pegged to the [server's version](https://fh.novatea.dev/server) for the first two numbers, but the patch version may change.
## v1.1.2
Added more return data to `client.auth.login()` and `client.auth.register()` calls! This was already being returned by the server, I just forgot initially.
## v1.1.1
- Fixed a bug where the custom errors (`errors.ts`) weren't having their types bundled in the release
- Fixed a mis-typed prototype in `FHPermissionError`
## v1.1.0
Initial release, full route coverage parity with FolderHarbor Server [v1.1.0](https://github.com/aelithron/folderharbor/releases/tag/server%2Fv1.1.0)!