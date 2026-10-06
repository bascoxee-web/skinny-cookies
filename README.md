# Skinny Cookies

React storefront for Skinny Cookies, built with Vite. The product images and brand assets are in `client/public/`.

## Local development

```sh
npm ci
npm run dev
```

## Validation and deployment

```sh
npm run check
npm run build
```

Deploy on Vercel with the root directory at the repository root, build command `npm run build`, and output directory `dist/public`. Order buttons open the Sweets section of PZZA&'s live menu (`SWEETS_MENU`) and PZZA&'s DoorDash store (`DOORDASH_URL`), both set at the top of `client/src/pages/Home.tsx`. Menu prices there mirror the in-store menu; update them when PZZA&'s menu changes.
