# Security notes

Checked against the 20-point website security list.

| # | Check | Status |
|---|-------|--------|
| 1 | API keys hidden | Only in Vercel environment variables. Nothing in the code. `.env.example` shows the names. |
| 2 | Environment variables | `EDIT_SECRET` must be 16+ characters or login is refused (a blank secret would let anyone forge a login). |
| 3 | Keys in git | `.gitignore` blocks `.env` files. Run `git log -p | grep -i token` once before making the repo public. |
| 4, 5 | Admin routes and auth | Every route that changes anything checks the signed login cookie. |
| 6 | Permissions | One editor account. Visitors can only read and send the contact form. |
| 7, 8 | Input and XSS | React escapes all text. No raw HTML is ever injected. Uploaded images are PNG, JPG, WebP or GIF only (no SVG). |
| 9 | SQL injection | No SQL. Data is stored in Upstash Redis through its REST API. |
| 10 | Database rules | The Upstash token lives only on the server. |
| 11 | Rate limiting | Login: 5 wrong tries, then a 15 minute pause. Contact form: one message per 30 seconds per visitor. |
| 12 | Spend caps | Set a monthly budget in Upstash, Vercel and Resend. The site caps message size and count. |
| 13 | File uploads | Type, 15 MB size and 40 file limits. Images are served with a sandbox policy. |
| 14 | CSRF | Cookie is SameSite=Strict and a middleware rejects changing requests from other sites. |
| 15 | CORS | No cross-origin access is allowed. |
| 16 | HTTPS | Vercel forces it. HSTS header is set. |
| 17 | Security headers | CSP, HSTS, nosniff, frame denial, referrer and permissions policies. |
| 18 | Cookies | HttpOnly, Secure, SameSite=Strict, 12 hour expiry. |
| 19 | Debug mode | Off in production builds. The `X-Powered-By` header is removed. |
| 20 | Production settings | Run `npm audit` after each deploy. |

Known limits: the login throttle is per server instance, so it is a speed bump and a strong password is the real protection. Logging out clears the cookie in your browser but a copied cookie stays valid until its 12 hours end. The CSP allows inline scripts because Next.js needs them.
