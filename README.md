# Happy Birthday, Manal Jasmine 🌸

A premium, cinematic birthday website. Just open `index.html` in any browser — no build step, no install.

## What's inside
- **Loader → Gate screen** — "Open Your Surprise" triggers confetti, floating hearts, and reveals the full site.
- **Hero** — heartfelt lines that fade in one by one as you scroll.
- **3D-style cake** — lit candles you can blow out with the button, *or* by actually blowing into your microphone (it'll ask permission; the button always works if you skip that).
- **Memory Garden** — 5 flowers that bloom into memory cards on hover. Swap the placeholders for real photos (see below).
- **12 floating "Reasons You're Amazing" cards.**
- **A full handwritten-style letter.**
- **Hour-by-hour animated timeline** (morning → night).
- **Interactive gift box**, finale fireworks, and a closing message.
- **Bonus extras** I added beyond the original brief:
  - Background music — a soft generative piano loop (Web Audio API), so it works with zero downloads. Tap the ♪ button top-right.
  - A live **countdown to her next birthday**.
  - A **"leave a wish" wall** — anyone viewing the page can type a note that floats across the screen.
  - Ambient canvas background with twinkling stars, drifting petals, and fireflies running the whole length of the page.
  - A scroll-progress "vine" on the right edge.
  - A soft cursor glow on desktop.

## Adding her real photos
Open `index.html`, find the **Memory Garden** section, and look for the five `<div class="ph-img ph1">Photo 1</div>` blocks. Replace each with:
```html
<img src="assets/images/photo1.jpg" alt="A memory" class="ph-img-real">
```
Then drop your files into `assets/images/`. (Add `.ph-img-real{width:100%;height:120px;object-fit:cover;border-radius:12px;}` to `style.css` if you do this.)

## Using your own music instead of the generated piano loop
The current track is synthesized in the browser (`initMusic()` in `script.js`) so there's nothing to download. If you'd rather use a real song:
1. Put an mp3 at `assets/music/birthday-song.mp3`.
2. In `index.html`, add `<audio id="bg-audio" loop src="assets/music/birthday-song.mp3"></audio>` near the top of `<body>`.
3. In `script.js`, inside `initMusic()`, replace the Web Audio engine calls with `document.getElementById('bg-audio').play()` / `.pause()`.

## Folder structure
```
index.html
style.css
script.js
assets/
  music/   ← drop an mp3 here if you want real music (see above)
  images/  ← her real photos go here
  icons/   ← optional, for any custom icons
```

Everything is commented in `style.css` and `script.js` so you can retune colors, timing, and text without digging through the whole file.
