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

The site now has a built-in editor: log in at `/admin` (the first time, you create your password there), then press "Edit this site" in the bar at the bottom-right. Editable fields get a dashed outline — click in, type, click away, and it saves straight to the live site. No code, no redeploying.

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
   - `EDIT_PASSWORD` — optional. Leave it out and create your password on `/admin` instead (see "Your admin password" below).
   - `EDIT_SECRET` — any long random string (this signs your login session; generate one at e.g. https://1password.com/password-generator or just mash the keyboard for 40+ characters).
   - `UPSTASH_REDIS_REST_URL` — from step 1.
   - `UPSTASH_REDIS_REST_TOKEN` — from step 1.
4. Deploy. Your edits will now persist permanently, and only someone with your password can make them.

**If you skip this setup:** the site still works perfectly as a normal read-only portfolio — `/admin` will warn that storage is not connected and nothing can be saved. Nothing breaks either way.

## Adding brand-new writeups (not just editing existing ones)

Once logged in (at `/admin`), a second floating button appears — a **+** near the bottom-right. Click it, pick **Writing** or **Cyber Lab**, fill in the form, hit Publish, and you're taken straight to the new page at its own URL (e.g. `/writing/your-title-here`). It shows up immediately in the Writing Archive and Cyber Lab listings, searchable and filterable like everything else.

- **Writing**: title, category, type, tags, and the content itself (separate paragraphs with a blank line — same convention as everything else on the site). Reading time is calculated automatically.
- **Cyber Lab**: title, platform, status, tools, objective, and findings — same layout as SQLPad/Kioptrix/SecureShop/TryHackMe currently use, so a lab you add this way gets the same "objective / tools / findings" page, editable later through the same inline-edit system.

New entries are stored in the same Upstash Redis database as your text edits, so they need the same setup (see above) to actually save — without it, Publish will show an error instead of silently failing.

## Deleting entries (including built-in ones)

Every writing piece and cyber lab entry now has a **Delete this entry** button at the bottom of its page when you're logged in and editing — and the Writing Archive / Cyber Lab listings have a **Manage entries** button that adds a Delete next to each item, so you don't have to open every page one by one.

- **Entries you added yourself** (through + or Upload) are removed for good.
- **Built-in entries** (anything that shipped with the site — including, yes, the Sudan diary entries, or any other original piece) can't be erased from the source code at runtime, so deleting one **hides** it instead. It disappears from every listing and its direct URL stops working, but it's recoverable.
- **To recover something**, log in and open **Trash** (a link appears next to Log out once you're authenticated). It lists every hidden built-in entry with a one-click **Restore**.

## Images that stay where you put them

The Apache cyber lab write-up no longer dumps all its screenshots in one gallery at the bottom — each one now sits directly under the paragraph it illustrates (recon screenshots under Reconnaissance, exploit screenshots under Exploitation, and so on), the way the original report reads. Anything uploaded through the new uploader (below) gets this same treatment automatically.

## Uploading a docx (or a whole folder of them)

A second floating button (⇪, above the lock icon) opens the uploader once you're logged in. Pick individual files or an entire folder — it accepts `.docx`, `.md`, and `.txt`.

What happens to a `.docx`: the text and embedded images are pulled out **in the order they appear in the document** — a paragraph, then the screenshot below it, then the next paragraph — and turned into the site's content format. Headings, bullet lists, and inline images are all preserved in place; nothing gets shuffled to an end gallery.

After parsing, each file shows up as a draft in a short review list: confirm or change the title, category/platform, type, and tags, choose Writing or Cyber Lab, then **Publish this one**. Nothing goes live until you hit publish — you can discard anything that didn't parse the way you wanted.

Images are embedded directly in the saved content (as data), so no extra file storage service is needed beyond the Upstash database already set up above. For a very large batch of high-resolution images this will make entries heavier to store — compress screenshots before uploading if you're adding a lot of them.

**Not supported yet:** `.pdf` uploads, and tables are flattened to plain text rather than rendered as real tables. Say the word if you want either added.

## Editing coverage

Virtually every piece of substantive text on the site is now editable: the homepage hero line and tags, both About paragraphs, the full skills list, every research question list, every experience entry (home and CV), the CV leadership note, education lines, languages, every writing piece's title and full body (images included), every cyber lab's objective/findings, the PetanqueAI case study, and the footer line.

Left as plain structural chrome (not editable, on purpose): nav menu labels, button labels like "Download CV", and back-links like "← Writing Archive." Making those editable risks breaking navigation for no real benefit — but if you want any specific one opened up, tell me which and I'll wire it in.

### How it works, briefly
- Your password check happens server-side (`app/api/auth/route.ts`) and never touches the browser in plain text — a signed, expiring session cookie (12 hours) proves you're logged in.
- All overridden text lives in your Upstash Redis as one JSON object, fetched once per page load.
- Anyone without the password sees the original text from `content/data.ts` — the site works exactly the same for visitors whether or not editing is configured.

## Editing write-ups (block editor)

Log in at /admin, press **Edit pages in place**, then open any write-up or lab. Every paragraph, heading, bullet and picture is its own block. Each block has up/down arrows and a delete button. The faint **+ Text / + Heading / + Image** row between blocks inserts something at that exact spot. **Add a document at the end** reads a .docx, .md or .txt file and appends it with its pictures in the original order.

## Profile photo

When logged in, click the photo card on the home page and pick a picture. Click again to change it, or use Remove.

## Report (standard format)

The **+** button has a "Report (standard format)" tab with the sections Objective, Environment, Reconnaissance, Methodology, Findings, Evidence, Technical notes, What I learned and Full write-up. Each section takes text, headings and screenshots in whatever order you place them. Empty sections are left out.

## Images and size limits

Pictures are shrunk in the browser and stored in the database, then shown from /api/image/... so pages stay light. Vercel limits a single upload request to about 4.5 MB, so a Word file with many large screenshots should be split or compressed first.

## Theme, menu text and settings (⚙)

When logged in, the ⚙ button opens colors (four presets plus a picker for each color) and the header and menu text. Changes show at once and save automatically.

## Home page additions

- **Currently**: three lines (Reading, Building, Learning). They only appear to visitors once you fill them in through Edit mode.
- **From the archive**: four featured essays, plus links to the one-page writing sample and the RSS feed (/feed.xml).
- **Send a message**: a contact form. Messages are stored and you read them at /inbox after logging in. For an email copy as well, add RESEND_API_KEY and CONTACT_TO (and optionally CONTACT_FROM) in Vercel.
- **Writing pages**: reading time, previous and next links, and share previews. Set SITE_URL in Vercel to your real address so the preview links are correct.
- **/writing-sample**: your security-warning essay laid out for one printed page. Use "Save as PDF" in the print dialog.

## Look and feel

The design is deliberately plain: serif headings, flat sections with thin rules instead of boxed cards, text links instead of glowing buttons, and no gradients. Colors still come from the Settings panel.

## Owner dashboard (/admin)

Go to `/admin` (or press **Dashboard** in the editor bar) and log in with your edit password. Everything about the site is run from here:

- **Visitors**: people on the site right now, visitors today / last 7 / 30 / 90 days / all time, a visitors-per-day chart (with a table view), most viewed pages, which sites sent people to you, countries and devices.
- **Write-ups & labs**: every entry in one searchable list. Start a new write-up or lab report, upload Word/Markdown files, open any entry straight in edit mode, change its title, category, type, date, tags, platform, status, objective or tools under **Details**, hide or delete it, and restore hidden ones.
- **Home page**: show or hide each home-page section, pick the four featured essays, and edit the scrolling strip, tools list, terminal lines and "Currently".
- **Profile & CV**: profile photo, upload a new CV PDF (up to 3 MB), and your name, handle, location, email, phone, GitHub and LinkedIn.
- **Design**: colours and presets, headings and body fonts, text size, capital or normal-case headings, and the menu text.
- **Messages**: what people sent through the contact form, with Reply by email.
- **All edits**: every change you have ever saved, each with an **Undo** that puts the original back.
- **Password**: change your login password (you need the current one). It is stored only as a salted hash, never as plain text.

In edit mode every heading, paragraph and button label on the home, CV, Writing and Cyber Lab pages can now be clicked and changed, including lab titles, objectives and tools.

### How visitors are counted

Counting happens on your own server and in the same Upstash database, so there is no outside tracker and no cookie banner is needed. A visitor is a one-way daily fingerprint of IP address and browser, so the same person counts once per day and cannot be followed from day to day; raw IP addresses are never stored. Bots, your own visits while logged in, the dashboard itself, and browsers with "Do Not Track" or Global Privacy Control switched on are not counted. Countries only appear on Vercel (they come from Vercel's location header). Daily numbers are kept for about 13 months.

### Your admin password

You don't need `EDIT_PASSWORD` in Vercel any more. When no password exists, `/admin` shows **Create your admin password**. Choose one (at least 10 characters) and you are logged in. From then on you log in at `/admin` with it, and you can change it under the **Password** tab. Visitors no longer see any login button on the site. Logging in only happens at `/admin`.

Create your password straight after deploying. Until you do, whoever opens `/admin` first could create it. If `/admin` asks you to log in when you never set a password, someone else did: use the reset below.

`EDIT_SECRET` and the two Upstash settings are still required.

### Forgot your password?

In Vercel, open the project and go to **Settings → Environment Variables**:
- If `EDIT_PASSWORD` is there, **delete it**. `/admin` will then offer to create a new password.
- If it isn't there, **add it** with a new password. That becomes your password.

Then **Redeploy** the latest deployment. Adding, changing or removing `EDIT_PASSWORD` always resets the password made on `/admin`.
