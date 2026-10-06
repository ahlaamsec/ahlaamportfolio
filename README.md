# Ahlaam Abdallah portfolio

## Run locally
```
npm install
npm run dev
```
Open http://localhost:3000.

## Content
All static content lives in `content/data.ts`. Anything marked TODO is missing information, not invented.
- Writing piece: add to `fullWriting` (with `content: string[]`, one paragraph per entry) — gets its own page at `/writing/<slug>`.
- Cyber lab: append to `labs`. A `full: {...}` block (see the Apache entry) gets a full case-study page; evidence images go in `public/evidence/<slug>/`.
- Certificate: append to `certs`.
- PetanqueAI case study: `app/projects/petanqueai/page.tsx`.

## Password-protected editing (new)

The site now has a built-in editor: click the 🔒 button in the bottom-right corner of any page, enter your password, then click "Edit this site." Editable fields get a dashed outline — click in, type, click away, and it saves straight to the live site. No code, no redeploying.

**What's editable right now:** the homepage hero line, the About bio, the "off the clock" note, the CV leadership note, every writing piece's title and full text (all 100+ pieces), the PetanqueAI case study sections, and the findings box on any cyber lab entry that doesn't have a full write-up yet (SQLPad, Kioptrix, SecureShop, TryHackMe) — so you can fill those in directly on the live site once you have your notes.

**Extending it to more fields:** wrap any text in `<EditableText id="unique:id:here" value="the current text" multiline />` (drop `multiline` for single-line text) — see any of the files above for examples. Each `id` must be unique across the whole site.

### Required setup (this is not optional — the editor won't work without it)

This moved off pure static hosting to support saving, so it needs two things set up before it's deployed:

**1. A database for your edits (free) — Upstash Redis**
1. Go to https://upstash.com, sign up free, create a Redis database (any region close to you).
2. On the database's page, copy the **REST URL** and **REST Token**.

**2. Deploy on Vercel** (not Netlify/GitHub Pages — this needs a real server for the password check and saving, which plain static hosts can't do)
1. Push this project to a GitHub repo.
2. Import it at https://vercel.com/new.
3. Before the first deploy, add these Environment Variables in the Vercel project settings:
   - `EDIT_PASSWORD` — whatever password you want to log in with.
   - `EDIT_SECRET` — any long random string (this signs your login session; generate one at e.g. https://1password.com/password-generator or just mash the keyboard for 40+ characters).
   - `UPSTASH_REDIS_REST_URL` — from step 1.
   - `UPSTASH_REDIS_REST_TOKEN` — from step 1.
4. Deploy. Your edits will now persist permanently, and only someone with your password can make them.

**If you skip this setup:** the site still works perfectly as a normal read-only portfolio — the 🔒 button will just say "Wrong password" / fail to save, since there's nothing to check against. Nothing breaks either way.

## Adding brand-new writeups (not just editing existing ones)

Once logged in (via the 🔒 button), a second floating button appears — a **+** near the bottom-right. Click it, pick **Writing** or **Cyber Lab**, fill in the form, hit Publish, and you're taken straight to the new page at its own URL (e.g. `/writing/your-title-here`). It shows up immediately in the Writing Archive and Cyber Lab listings, searchable and filterable like everything else.

- **Writing**: title, category, type, tags, and the content itself (separate paragraphs with a blank line — same convention as everything else on the site). Reading time is calculated automatically.
- **Cyber Lab**: title, platform, status, tools, objective, and findings — same layout as SQLPad/Kioptrix/SecureShop/TryHackMe currently use, so a lab you add this way gets the same "objective / tools / findings" page, editable later through the same inline-edit system.

New entries are stored in the same Upstash Redis database as your text edits, so they need the same setup (see above) to actually save — without it, Publish will show an error instead of silently failing.

### How it works, briefly
- Your password check happens server-side (`app/api/auth/route.ts`) and never touches the browser in plain text — a signed, expiring session cookie (12 hours) proves you're logged in.
- All overridden text lives in your Upstash Redis as one JSON object, fetched once per page load.
- Anyone without the password sees the original text from `content/data.ts` — the site works exactly the same for visitors whether or not editing is configured.
