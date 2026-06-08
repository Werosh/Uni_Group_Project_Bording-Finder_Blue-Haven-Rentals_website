# Third-Party Licenses

Blue Haven Rentals is released under the [MIT License](./LICENSE). This document lists the open-source licenses used by **direct dependencies** and summarizes licenses present in the full dependency tree.

> Regenerate the full dependency tree report with:
> ```bash
> npx license-checker --summary
> npx license-checker --direct --csv
> ```

---

## Direct Dependencies

| Package | Version | License | Repository |
|---------|---------|---------|------------|
| `@tailwindcss/vite` | ^4.1.12 | MIT | [tailwindlabs/tailwindcss](https://github.com/tailwindlabs/tailwindcss) |
| `firebase` | ^12.2.1 | Apache-2.0 | [firebase/firebase-js-sdk](https://github.com/firebase/firebase-js-sdk) |
| `lucide-react` | ^0.542.0 | ISC | [lucide-icons/lucide](https://github.com/lucide-icons/lucide) |
| `react` | ^19.1.1 | MIT | [facebook/react](https://github.com/facebook/react) |
| `react-dom` | ^19.1.1 | MIT | [facebook/react](https://github.com/facebook/react) |
| `react-icons` | ^5.5.0 | MIT | [react-icons/react-icons](https://github.com/react-icons/react-icons) |
| `react-router-dom` | ^7.8.2 | MIT | [remix-run/react-router](https://github.com/remix-run/react-router) |
| `recharts` | ^3.2.1 | MIT | [recharts/recharts](https://github.com/recharts/recharts) |
| `tailwindcss` | ^4.1.12 | MIT | [tailwindlabs/tailwindcss](https://github.com/tailwindlabs/tailwindcss) |
| `@eslint/js` | ^9.33.0 | MIT | [eslint/eslint](https://github.com/eslint/eslint) |
| `@types/react` | ^19.1.10 | MIT | [DefinitelyTyped/DefinitelyTyped](https://github.com/DefinitelyTyped/DefinitelyTyped) |
| `@types/react-dom` | ^19.1.7 | MIT | [DefinitelyTyped/DefinitelyTyped](https://github.com/DefinitelyTyped/DefinitelyTyped) |
| `@vitejs/plugin-react` | ^5.0.0 | MIT | [vitejs/vite-plugin-react](https://github.com/vitejs/vite-plugin-react) |
| `eslint` | ^9.33.0 | MIT | [eslint/eslint](https://github.com/eslint/eslint) |
| `eslint-plugin-react-hooks` | ^5.2.0 | MIT | [facebook/react](https://github.com/facebook/react) |
| `eslint-plugin-react-refresh` | ^0.4.20 | MIT | [ArnaudBarre/eslint-plugin-react-refresh](https://github.com/ArnaudBarre/eslint-plugin-react-refresh) |
| `globals` | ^16.3.0 | MIT | [sindresorhus/globals](https://github.com/sindresorhus/globals) |
| `vite` | ^7.1.2 | MIT | [vitejs/vite](https://github.com/vitejs/vite) |

---

## Full Dependency Tree Summary

The following license types appear in the complete `npm` dependency tree (including transitive packages):

| License | Packages | Reference |
|---------|----------|-----------|
| MIT | 175 | [LICENSES/MIT.txt](./LICENSES/MIT.txt) |
| Apache-2.0 | 66 | [LICENSES/Apache-2.0.txt](./LICENSES/Apache-2.0.txt) |
| ISC | 31 | [LICENSES/ISC.txt](./LICENSES/ISC.txt) |
| BSD-3-Clause | 14 | [LICENSES/BSD-3-Clause.txt](./LICENSES/BSD-3-Clause.txt) |
| BSD-2-Clause | 6 | [LICENSES/BSD-2-Clause.txt](./LICENSES/BSD-2-Clause.txt) |
| BlueOak-1.0.0 | 2 | [LICENSES/BlueOak-1.0.0.txt](./LICENSES/BlueOak-1.0.0.txt) |
| MPL-2.0 | 2 | [LICENSES/MPL-2.0.txt](./LICENSES/MPL-2.0.txt) |
| Python-2.0 | 1 | [LICENSES/Python-2.0.txt](./LICENSES/Python-2.0.txt) |
| CC-BY-4.0 | 1 | [LICENSES/CC-BY-4.0.txt](./LICENSES/CC-BY-4.0.txt) |
| 0BSD | 1 | [LICENSES/0BSD.txt](./LICENSES/0BSD.txt) |
| MIT AND ISC | 1 | Dual-licensed (see package `victory-vendor`) |

Notable transitive dependencies by license:

- **Apache-2.0** — Firebase SDK, gRPC, ESLint config packages, `web-vitals`, `detect-libc`
- **ISC** — `lucide-react`, D3 modules, various Node.js utilities
- **MPL-2.0** — `lightningcss` (used by Tailwind CSS)
- **BSD-3-Clause** — `protobufjs`, `source-map-js`, `esquery`

---

## License Texts

Full text copies of each license type found in this project are available in the [`LICENSES/`](./LICENSES/) directory.

---

## Attribution

This project uses open-source software. We thank the authors and maintainers of all listed packages. If you believe attribution is missing or incorrect, please open an issue or pull request.
