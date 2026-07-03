# Ball Calculator 

Welcome to **Ball Calculator** — an interactive, physics-based calculator built with Astro, Tailwind CSS, and Matter.js. 

Instead of typing on a boring keypad, you spawn balls and use your device's **gyroscope** (or your finger!) to guide them into holes representing numbers and mathematical operators. 

## How to Play

1. **Spawn a Ball:** 
   - Tap the large **`+`** button to spawn a **Normal Ball**. 
   - Tap the small **`+`** button to spawn a **Mini Ball**.
2. **Move the Ball:** 
   - **Mobile Devices (HTTPS):** Tilt your phone! The ball will realistically roll across the screen based on the gravity sensed by your device's gyroscope.
   - **Desktop or HTTP local testing:** Drag your finger or mouse across the screen to manually tilt the gravity towards your touch.
3. **Calculate:** 
   - Guide the **Normal Ball** into any hole (numbers `0-9`, operators `+`, `-`, `*`, `/`, or `=`) to build your mathematical expression. The result will instantly show up on the floating display.
   - The **Mini Ball** is a special eraser. Guide it into the **`C`** (Clear) hole to reset the calculator and start a new operation. (It ignores all other holes).

## Technologies Used

- **Framework:** [Astro](https://astro.build/)
- **Physics Engine:** [Matter.js](https://brm.io/matter-js/)
- **Styling:** [Tailwind CSS v4](https://tailwindcss.com/)
- **Language:** TypeScript

## Development Setup

If you want to run this project locally, make sure you have Node.js installed.

1. **Install Dependencies:**
   ```bash
   npm install
   ```

2. **Start the Development Server:**
   ```bash
   npm run dev
   ```
   *Note: Astro will run on `localhost:4321` by default.*

3. **Build for Production:**
   ```bash
   npm run build
   ```

### A Note on Mobile Testing (Gyroscope)
Modern browsers like iOS Safari and Android Chrome block access to the gyroscope (`DeviceOrientationEvent`) unless the site is served over a secure **HTTPS** connection (or `localhost`). 
If you are testing on your phone over your local network (e.g., `http://X.X.X.X:XXXX`), the gyroscope will be blocked. Don't worry! We've implemented a **touch fallback**. Simply swipe and drag your finger across the screen to control gravity during local development. Once deployed to a secure HTTPS domain, the gyroscope will activate automatically!

## License
MIT
