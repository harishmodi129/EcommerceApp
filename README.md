# ShopApp — E-Commerce Web Application

A basic e-commerce web application where users can browse products, view detailed product information, and add items to a cart. Built with React JS class components, MobX, Context API, and React Router v6.

---

## GitHub Setup & Run Instructions

### Prerequisites

Make sure you have the following installed before proceeding:

- [Node.js](https://nodejs.org/) v16 or higher — verify with `node -v`
- [npm](https://www.npmjs.com/) v8 or higher — verify with `npm -v`
- [Git](https://git-scm.com/) — verify with `git --version`
- Google Chrome (required for Cypress E2E tests)

### Step 1 — Clone the Repository

```bash
git clone <your-github-repo-url>
cd my-app
```

### Step 2 — Install Dependencies

```bash
npm install
```

> If you see peer dependency warnings, run: `npm install --legacy-peer-deps`

### Step 3 — Start the Application

```bash
npm start
```

The app will open automatically at [http://localhost:3000](http://localhost:3000).

### Step 4 — Run E2E Tests

Open a **second terminal** (keep `npm start` running in the first one):

```bash

npx cypress run --browser chrome


npx cypress open --browser chrome
```

> All 20 tests should pass. Expected output:
>
> ```
> √  cart.cy.js          8/8 passing
> √  home.cy.js          5/5 passing
> √  ProductDetail.cy.js 7/7 passing
> All specs passed!      20/20
> ```

---

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Architecture Decisions](#architecture-decisions)
- [State Management](#state-management)
- [Routing](#routing)
- [API Integration](#api-integration)
- [Cart Persistence](#cart-persistence)
- [Animations](#animations)
- [E2E Testing](#e2e-testing)
- [Assumptions](#assumptions)
- [Limitations](#limitations)
- [Additional Features](#additional-features)

---

## Features

- Browse a responsive grid of products fetched from a public API
- View detailed product information on a dedicated page
- Add items to cart from the Product Detail page
- Cart item count and total value shown persistently in the footer
- Cart state persisted in `localStorage` across page refreshes
- Smooth page transition and cart animations
- Skeleton loading placeholders while products are fetching
- 20 automated E2E tests with Cypress

---

## Tech Stack

| Layer             | Technology                                          | Reason                                                   |
| ----------------- | --------------------------------------------------- | -------------------------------------------------------- |
| UI                | React JS (class components)                         | Required by assignment spec                              |
| Routing           | React Router v6                                     | Required by assignment spec                              |
| State Management  | MobX + React Context API                            | Required by assignment spec                              |
| Data Fetching     | Native `fetch` API                                  | `got` is Node.js-only, incompatible with browser/webpack |
| Data Source       | [Platzi Fake Store API](https://fakeapi.platzi.com) | Required by assignment spec                              |
| Persistence       | `localStorage`                                      | Bonus requirement                                        |
| Testing           | Cypress                                             | Bonus requirement                                        |
| Bootstrapped with | Create React App (CRA)                              | Required by assignment spec                              |

---

## Project Structure

```
my-app/
├── public/
├── src/
│   ├── components/
│   │   ├── Footer.js          # Fixed footer showing cart count and total
│   │   ├── HomePage.js        # Product grid listing page
│   │   ├── ProductCard.js     # Individual product card component
│   │   ├── ProductDetail.js   # Product detail page
│   │   └── SkeletonCard.js    # Shimmer loading placeholder
│   ├── context/
│   │   └── CartContext.js     # React Context + Provider wrapping the MobX store
│   ├── hocs/
│   │   └── withRouter.js      # HOC to inject React Router hooks into class components
│   ├── store/
│   │   └── CartStore.js       # MobX observable store (items, addItem, totalItems, totalPrice)
│   ├── apiClient.js           # Native fetch wrapper for Platzi Fake Store API
│   ├── App.js                 # Route definitions + Footer mount
│   ├── index.css              # Global styles + animation keyframes
│   └── index.js               # Entry point — wraps app in CartProvider
├── cypress/
│   ├── e2e/
│   │   ├── home.cy.js         # Home page tests
│   │   ├── productDetail.cy.js # Product detail page tests
│   │   └── cart.cy.js         # Cart functionality tests
│   └── support/
│       ├── e2e.js             # Imports custom commands
│       └── commands.js        # Custom Cypress commands
├── cypress.config.js          # Cypress configuration
└── package.json
```

---

## Architecture Decisions

### Why Class Components?

The assignment explicitly requires React class components. This means all state is managed via `this.state` and `setState()`, and lifecycle methods (`componentDidMount`, `componentDidUpdate`, `componentWillUnmount`) are used instead of hooks.

### Why `withRouter` HOC?

React Router v6 exposes navigation only through hooks (`useNavigate`, `useParams`, `useLocation`). Hooks cannot be called inside class components. The `withRouter` HOC solves this by wrapping each class component inside a functional component that calls the hooks and passes their values down as props:

```
withRouter(ProductDetailPage)
    └── functional wrapper → calls useNavigate(), useParams(), useLocation()
            └── renders <ProductDetailPage navigate={} params={} location={} />
```

### Why `location.state` for Product Data?

The requirement explicitly states product data must **not** be re-fetched on the detail page. The product object is passed through React Router's navigation state when navigating:

```javascript
navigate(`/product/${product.id}/details`, { state: { product } });

const product = this.props.location?.state?.product ?? null;
```

If a user visits the detail URL directly without navigating from the home page, `location.state` will be `null` and a "Product details not available" message is shown with a link back to home.

### Why Native `fetch` Instead of `got`?

The `got` library uses Node.js core modules (`http`, `https`) which do not exist in the browser. Webpack cannot bundle them for a browser environment, causing a `Module not found` error. The native `fetch` API is built into all modern browsers and requires no installation.

---

## State Management

Cart state is managed using **MobX** as the reactive store and **React Context API** as the delivery mechanism across the component tree.

```
CartStore (MobX — single instance, singleton)
    └── CartContext.Provider (wraps entire app in index.js)
            └── any class component reads store via:
                static contextType = CartContext;
                // then this.context gives access to the store
```

### CartStore Internals

```javascript
class CartStore {
  items = [];

  addItem(product) { ... }
  get totalItems() { ... }
  get totalPrice() { ... }
}
```

`makeAutoObservable` in the constructor automatically marks arrays as observable, methods as actions, and getters as computed values. Components wrapped with `observer()` from `mobx-react` automatically re-render when observed values change.

---

## Routing

| Path                   | Component           | Description          |
| ---------------------- | ------------------- | -------------------- |
| `/`                    | `HomePage`          | Product grid listing |
| `/product/:id/details` | `ProductDetailPage` | Product detail view  |

`Footer` is rendered **outside** `<Routes>` in `App.js` so it stays mounted and visible across all route changes without remounting or losing its state.

---

## API Integration

Products are fetched from the [Platzi Fake Store API](https://fakeapi.platzi.com):

```
Base URL: https://api.escuelajs.co/api/v1

GET /products?limit=60                          → fetch all products
GET /products?categoryId={id}&limit=60          → fetch by category
```

Error handling shows a user-friendly error message with a Retry button if the network request fails.

---

## Cart Persistence

Cart state is saved to `localStorage` under the key `shopapp_cart_v2` on every `addItem` call. On app startup, `CartStore` reads from `localStorage` and restores the previous cart:

```javascript

_persist() {
  localStorage.setItem("shopapp_cart_v2", JSON.stringify(this.items));
}


_hydrate() {
  const raw = localStorage.getItem("shopapp_cart_v2");
  if (raw) this.items = JSON.parse(raw);
}
```

---

## Animations

All animation classes are defined in `index.css` using CSS keyframes:

| Class            | Where Used                 | Effect                                      |
| ---------------- | -------------------------- | ------------------------------------------- |
| `fade-in-up`     | Product cards on home page | Fade + slide up on load, staggered per card |
| `slide-in-right` | Product detail page        | Slides in from right on navigation          |
| `pulse-green`    | "Added to Cart" button     | Scale pulse when item is added              |
| `bump`           | Cart badge in footer       | Scale bump when item count increases        |
| `skeleton`       | Loading placeholders       | Shimmer sweep while API is loading          |

---

## E2E Testing

Tests are written with [Cypress](https://www.cypress.io/) v13.6.0.

### Test Coverage

| File                  | Tests | What is Tested                                                                                                                                                                                                |
| --------------------- | ----- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `home.cy.js`          | 5     | Header renders, skeleton shows while loading, product grid appears, card shows title and price, clicking card navigates to detail page                                                                        |
| `productDetail.cy.js` | 7     | Detail content visible, title not empty, price has $ sign, image visible, Add to Cart button present, back button goes home, direct URL shows not-found                                                       |
| `cart.cy.js`          | 8     | Footer visible, initial count is 0, count increments on add, total updates on add, button shows success state, button reverts after 1.4s, duplicate adds increment quantity, cart persists after page refresh |

**Total: 20 tests — all passing**

### Custom Commands

```javascript
cy.waitForProducts();
cy.openFirstProduct();
```

---

## Assumptions

1. **Product data availability** — It is assumed the Platzi Fake Store API is available and returns data in the expected shape (`id`, `title`, `price`, `description`, `images`, `category`). If the API changes its schema, image cleaning or price formatting may break.

2. **Image URL format** — The API sometimes returns image URLs wrapped in array brackets or quotes (e.g. `["https://..."]`). A `_cleanImageUrl` helper strips these characters. It is assumed all images follow this pattern.

3. **No authentication** — The app makes only public GET requests. No login or API key is required.

4. **Single cart per browser** — Cart state is stored in `localStorage` which is per-browser, per-domain. No server-side cart sync is implemented.

5. **Product navigation via state** — Since the requirement says not to re-fetch product data on the detail page, navigating directly to `/product/:id/details` without passing `location.state` will show a "not available" screen. This is intentional.

6. **Chrome for Cypress** — Cypress tests are configured to run in Chrome. Electron (Cypress default) has known IPC issues on Windows 10.

---

## Limitations

1. **No category filter UI** — The `fetchProductsByCategory` function exists in `apiClient.js` but no filter UI is built, as the requirement states filters should not be applied and should not persist across refresh or navigation.

2. **No cart removal** — Users can only add items to the cart. The requirement explicitly disallows removing items.

3. **No cart page** — Cart is visible only via the footer summary. There is no dedicated `/cart` route, as the requirement disallows it.

4. **Direct URL to detail page shows empty state** — Because product data is passed via `location.state` (not re-fetched), bookmarking or directly visiting a product detail URL will show a not-found message.

5. **Image errors** — Some product images from the API are broken URLs. These fall back to a placeholder image via the `onError` handler on each `<img>` tag.

6. **No TypeScript** — The requirement explicitly disallows TypeScript. The entire codebase is plain JavaScript.

---

## Additional Features

These go beyond the base requirements:

1. **Skeleton loading UI** — While products are being fetched, shimmer skeleton cards are shown in the grid instead of a blank screen or spinner.

2. **Hover animations on product cards** — Cards lift with a shadow and the product image zooms in slightly on mouse hover.

3. **Multi-image gallery on detail page** — If a product has more than one image, thumbnail navigation is shown below the main image. Clicking a thumbnail switches the main image.

4. **Success feedback on Add to Cart** — The button turns green and shows "✓ Added to Cart!" for 1.4 seconds after clicking, then reverts. This gives clear visual confirmation.

5. **Cart badge bump animation** — The item count badge in the footer plays a scale animation each time the count increases.

6. **Staggered product card animations** — Each product card animates in with a slight delay relative to its position in the grid, creating a cascade effect on page load.

7. **Error state with retry** — If the API call fails, an error message is shown with a Retry button that re-triggers the fetch.

8. **Responsive layout** — The product grid uses CSS `auto-fill` with `minmax` so it adapts from 1 column on mobile to 4+ columns on wide screens. The product detail page switches from a 2-column to 1-column layout on screens below 640px.
