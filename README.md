# Provenant Website (`provenant.net`)

Static corporate website for [Provenant](https://provenant.net), built with Jekyll and deployed automatically to GitHub Pages.

---

## 1. Overview & Architecture

```
[Visitor Browser]
       │
       ├─► Static Content & Assets (GitHub Pages / CDN)
       │     • Jekyll 4.x static site generator
       │     • Automated deployment via GitHub Actions
       │
       └─► Contact Form Submission (`/contact`)
             │
             ├─► 1. Cloudflare Turnstile Widget (Bot Defense)
             │      • In-browser challenge validation
             │      • Produces single-use `cf-turnstile-response` token
             │
             └─► 2. POST https://inbound-inquiries.provenant.net/contact
                    • Managed via CDK in `origin-infrastructure/utils/website-contact-form`
                    • Amazon API Gateway (HTTP API) with route-level rate limiting
                    • AWS Lambda (Node.js 24) verifies token with Cloudflare API
                    • Dispatches email notifications via Amazon SES to `info@provenant.net`
```

---

## 2. Contact Form & Anti-Bot Protection

The contact page (`contact.html`) integrates Cloudflare Turnstile and an AWS serverless backend to eliminate form spam without intrusive CAPTCHAs.

### Frontend Integration (`contact.html` & `assets/js/contact.js`)

1. **Turnstile Script & Widget**:
   The Cloudflare Turnstile API script is loaded asynchronously in `contact.html`:
   ```html
   <script src="https://challenges.cloudflare.com/turnstile/v0/api.js" async defer></script>
   ```
   The widget is mounted inside the form:
   ```html
   <div class="cf-turnstile" data-sitekey="<TURNSTILE_SITE_KEY>" data-theme="light"></div>
   ```

2. **Submission Flow**:
   - `assets/js/contact.js` captures form submit events.
   - Extracts the user inputs and `cf-turnstile-response` token.
   - Submits JSON payload to the API endpoint (`https://inbound-inquiries.provenant.net/contact`).
   - If submission fails, `turnstile.reset()` is invoked automatically to issue a fresh token for immediate retry.
   - The API URL can be overridden in development environments via `window.CONTACT_API_URL`.

### Backend Infrastructure (`origin-infrastructure`)

The backend stack is managed as Infrastructure as Code using AWS CDK in the `origin-infrastructure` repository under:
```
utils/website-contact-form/
├── README.md
└── cdk/
    ├── bin/cdk.ts
    ├── lib/website-contact-form-stack.ts
    └── lambda/contact-handler/index.ts
```

- **Amazon API Gateway**: HTTP API with CORS restricted to `https://provenant.net` and `https://www.provenant.net`. Throttling is configured at 2 req/s (burst 5) at the edge.
- **AWS Lambda**: Node.js 24 runtime with reserved concurrency capped at 2. Validates payload fields, verifies the Turnstile token against `https://challenges.cloudflare.com/turnstile/v0/siteverify`, and formats the SES email.
- **AWS Secrets Manager**: Stores the Turnstile secret key under `website-contact-form/turnstile-secret`. The Lambda retrieves and caches this key in memory across warm invocations.
- **Amazon SES**: Sends inquiry notifications to `info@provenant.net` with identity-scoped IAM permissions.

---

## 3. GLEIF & KERI `.well-known` Discovery

Provenant publishes its Qualified vLEI Issuer (QVI) discovery surface at `/.well-known` adhering to the GLEIF discovery convention.

### Source Assets & Generation

- **Source of truth (`well-known-assets/`)**: Contains raw JSON definitions organized by resource type:
  - `well-known-assets/aid/`: QVI and Root AIDs (e.g., Provenant QVI, GLEIF Root).
  - `well-known-assets/schema/`: vLEI credential schemas.
  - `well-known-assets/witness/`: Witness inception events and endpoints.
- **Generator script (`scripts/build-wellknown.py`)**: Compiles `well-known-assets/` into:
  - `/.well-known/host-meta.json`: RFC 6415 machine discovery entry point.
  - `/.well-known/oobi/index.json`: Full catalog inventory.
  - `/.well-known/oobi/<SAID>/index.json`: Type-agnostic direct OOBI resolution.
  - `/.well-known/index.html`: Human-readable landing page.

### How to Update Discovery Resources

When adding or updating identifiers, witnesses, or schemas:
1. Add or edit the source files under `well-known-assets/<type>/<SAID>/index.json`.
2. Re-compile the discovery directory:
   ```bash
   python3 scripts/build-wellknown.py --host https://provenant.net
   ```
3. Commit both the updated source in `well-known-assets/` and the compiled files in `.well-known/`.

---

## 4. Local Development

### Prerequisites

- Ruby 3.3+
- Bundler (`gem install bundler`)

### Setup & Run

1. Clone repository and install Ruby dependencies:
   ```bash
   bundle install
   ```

2. Start the local Jekyll server:
   ```bash
   bundle exec jekyll serve
   ```

3. Open `http://localhost:4000` in your browser.

*Note: The Turnstile widget configured for `provenant-website` includes `localhost` in its allowed domain list, allowing end-to-end form verification during local development.*

---

## 5. Deployment & CI/CD

Deployment is fully automated through GitHub Actions (`.github/workflows/deploy.yml`):

- **Trigger**: Every push to the default branch (`main`) (or a manual `workflow_dispatch`).
- **Build**: Compiles Jekyll assets with `bundle exec jekyll build --destination ./_site`.
- **Deploy**: Packages and uploads the `_site/` directory to GitHub Pages using `actions/deploy-pages` (with `include-hidden-files: true` to publish `/.well-known`).

### DNS Configuration (Route 53)

Authoritative DNS for `provenant.net` is managed in AWS Route 53:

- **Apex (`provenant.net`)**: A records pointing to GitHub Pages Anycast IPs:
  - `185.199.108.153`
  - `185.199.109.153`
  - `185.199.110.153`
  - `185.199.111.153`
- **Subdomain (`www.provenant.net`)**: CNAME pointing to `provenant-dev.github.io`.
- **API Subdomain (`inbound-inquiries.provenant.net`)**: Managed by the CDK stack in `origin-infrastructure`.
