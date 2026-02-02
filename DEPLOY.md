# Deploy to https://invoice.benefitsystems.io

This is a static site (HTML, CSS, JS, images). No build step required.

## Option A: Vercel (recommended)

1. **Install Vercel CLI** (optional, for local deploy):
   ```bash
   npm i -g vercel
   ```

2. **Deploy**:
   - **From Git:** Push this repo to GitHub/GitLab, then go to [vercel.com](https://vercel.com) → New Project → Import repo → Deploy.
   - **From CLI:** In this folder run `vercel` and follow the prompts.

3. **Custom domain:** In the Vercel project → Settings → Domains → Add `invoice.benefitsystems.io`.
   - Vercel will show the DNS records (usually a CNAME to `cname.vercel-dns.com` or an A record).
   - In your DNS provider (where benefitsystems.io is managed), add:
     - **CNAME** `invoice` → `cname.vercel-dns.com`  
       or the exact target Vercel shows.
   - Wait for DNS to propagate; Vercel will issue SSL automatically.

## Option B: Netlify

1. Push the repo, then at [netlify.com](https://netlify.com): New site → Import from Git → select repo. Build command: leave empty. Publish directory: `.` (root).

2. Add domain: Site settings → Domain management → Add custom domain → `invoice.benefitsystems.io`. Add the CNAME record Netlify shows in your DNS.

## Option C: Your own server

1. Upload the whole project (all files in this folder, including `index.html`, `app.js`, `styles.css`, `BenefitLogo2.png`, etc.) to the server’s web root for `invoice.benefitsystems.io`.

2. Point the subdomain in DNS to that server (A or CNAME as you normally do).

3. Ensure the server serves `index.html` for `/` and that static files (`.js`, `.css`, `.png`) are served with correct MIME types.

---

**DNS reminder:** For `invoice.benefitsystems.io` you must have a DNS record (CNAME or A) pointing to your hosting provider. Whoever manages DNS for `benefitsystems.io` needs to add that record.
