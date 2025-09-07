Love this kind of curiosity—deploying locally is a great way to feel the tangibility of your work. Here's a simple, no-frills way to get your Vite-based React calculator served over your local network from a Debian 11 VM.

---

## 🛠️ Step-by-Step: Local Network Deployment (Vite + Debian)

### 1. **Build the Vite Project**

On your dev machine (or wherever the code lives):

```bash
npm run build
```

This creates a `dist/` folder with static assets.

---

### 2. **Install a Static File Server on the Debian VM**

You’ve got options, but here’s the easiest:

#### Option A: `serve` (Node-based)

```bash
npm install -g serve
```

Then serve your app:

```bash
serve -s dist -l 3000
```

#### Option B: `lighttpd` (System-level, lightweight)

```bash
sudo apt update
sudo apt install lighttpd
```

Then:

- Copy your `dist/` folder to `/var/www/html/`
- Replace `/var/www/html/index.html` with your app’s `index.html`
- Restart the server:

  ```bash
  sudo systemctl restart lighttpd
  ```

---

### 3. **Copy Files to the VM**

From your dev machine:

```bash
scp -r dist/ username@<VM-IP>:/home/username/
```

Or use `rsync` if you want progress bars and resume capability.

---

### 4. **Access from Browser**

On any device in the same network:

```
http://<VM-IP>:3000
```

Or if using `lighttpd` (default port 80):

```
http://<VM-IP>
```

---

### 5. **Firewall Check (if needed)**

Make sure port 3000 (or 80) is open:

```bash
sudo ufw allow 3000
```

Or for port 80:

```bash
sudo ufw allow http
```

---

## 🧩 Bonus: Vite Dev Server (for quick preview)

If you just want to preview without building:

```bash
vite --host
```

This makes Vite listen on your local IP, not just `localhost`.

---

Let me know if you want to wrap this into a deploy capsule or script it for repeatability. You’re one step away from turning your semantic calculator into a shared experience.

---

To build and run your Vite app in production mode, here’s the clean sequence:

---

### 🏗️ Step 1: Build the production bundle

In your project root, run:

```bash
npm run build
```

This triggers `vite build`, which:

- Optimizes and minifies your code
- Strips out `console.log` and `debugger` (thanks to your `esbuild.drop` config)
- Outputs static assets to the `dist/` folder

---

### 🚀 Step 2: Preview the production build locally

To simulate how it’ll behave in production:

```bash
npm run preview
```

This spins up a local server that serves the `dist/` folder exactly as a static host would. Great for sanity checks before deploying.

---

### 🌐 Step 3: Deploy to production

Since Vite outputs static files, you can deploy to any static host:

- **Netlify / Vercel / GitHub Pages** — just point to the `dist/` folder
- **Cloudflare Pages / S3 / Firebase Hosting** — same deal
- **Your own server** — serve `dist/` via Nginx, Apache, or any static file server

If you want to serve it manually:

```bash
npx serve dist
```

Or install globally:

```bash
npm install -g serve
serve dist
```

---

