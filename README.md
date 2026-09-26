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

Deploy on Vercel with the root directory at the repository root, build command `npm run build`, and output directory `dist/public`. The checkout cart links to the PZZA& Shopify storefront configured in `client/src/pages/Home.tsx`.
