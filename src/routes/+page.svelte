<main class:dark={$darkMode}>
	<section class="hero">
		<div class="hero-left">
			<h1>
				Welcome to <span class="brand">Phaint</span>
			</h1>
			<p>
				Where mockups meet collaboration.<br>
				<b>Draw, design, and iterate with others, in real time.</b><br>
				Share, edit, and export—just like magic.
			</p>
			<div class="cta-group">
				<a href="/register" class="btn btn--primary">Try it Free</a>
				<a href="/about" class="btn btn--secondary">Learn More</a>
			</div>
			<ul class="features">
				<li>✍️ Hand-drawing & vector tools</li>
				<li>🧑‍🤝‍🧑 Multiplayer collaboration</li>
				<li>🔐 Fine-grained sharing & rights</li>
				<li>📄 Export as PDF, SVG, PNG</li>
			</ul>
		</div>
		<div class="hero-right">
			<!-- Replace src with your best playful/collaborative drawing or the actual app UI image -->
			<img src="/mockup-canvas-example.png" alt="PaintFlow UI example" class="mockup" loading="lazy" />
		</div>
	</section>
</main>

<script lang="ts">
	import { darkMode } from '$lib/stores/theme';
</script>

<style>
    :root {
        --bg-light: linear-gradient(120deg, #f2f7ff 0%, #ebeffa 100%);
        --bg-dark: linear-gradient(120deg, #1a1a2e 0%, #16213e 100%);
        --primary: #21a1b3;
        --primary-dark: #20b6b0;
        --accent-pink: #ffb6c1;
        --accent-yellow: #ffe08b;
        --brand-grad: linear-gradient(45deg, #43cbff 30%, #7ae7ff 52%, #ffb6c1 86%);
        --btn-grad: linear-gradient(90deg, #21a1b3 0%, #49d890 100%);
    }
    main {
        min-height: 100vh;
        padding: 0;
        margin: 0;
        background: transparent;
        transition: background 0.5s;
        display: flex;
        flex-direction: column;
        justify-content: center;
    }
    main.dark {
        background: var(--bg-dark);
    }
    .hero {
        width: 100%;
        display: flex;
        justify-content: center;
        align-items: stretch;
        max-width: 1400px;
        margin: 0 auto;
        min-height: 85vh;
        position: relative;
        z-index: 2;
        gap: 3.5vw;
    }
    .hero-left {
        flex: 1.1;
        display: flex;
        flex-direction: column;
        justify-content: center;
        padding: 4vw 2vw 2vw 5vw;
    }
    .hero-right {
        flex: 1.2;
        display: flex;
        align-items: center;
        justify-content: center;
        padding-right: 2vw;
    }
    h1 {
        font-size: 3.2rem;
        font-weight: 800;
        margin: 0 0 1vw 0;
        line-height: 1.08;
        letter-spacing: -0.03em;
    }
    h1 .brand {
        display: inline-block;
        background: var(--brand-grad);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
        text-fill-color: transparent;
    }
    .dark h1 .brand {
        background: linear-gradient(90deg, #43cbff, #ffe08b 70%, #ffb6c1 99%);
    }
    .hero p {
        font-size: 1.23rem;
        color: #323657d7;
        max-width: 580px;
        margin-bottom: 2vw;
        letter-spacing: 0.01em;
    }
    .dark .hero p {
        color: #ccdbe7;
    }
    .cta-group {
        display: flex;
        flex-direction: row;
        gap: 1rem;
        margin-bottom: 2vw;
    }
    .btn {
        padding: 0.85rem 2.25rem;
        border-radius: 40px;
        font-size: 1.1rem;
        font-weight: 600;
        transition: box-shadow 0.2s, background 0.2s, color 0.2s;
        box-shadow: 0 1px 6px rgba(73, 216, 144, 0.04);
        border: none;
        cursor: pointer;
        text-decoration: none;
        display: inline-block;
        letter-spacing: 0.01em;
    }

    .btn--primary {
        background: var(--btn-grad);
        color: white;
        box-shadow: 0 4px 18px 0 rgba(36, 166, 178, 0.13);
    }
    .btn--primary:hover {
        filter: brightness(0.97) saturate(1.2);
    }
    .btn--secondary {
        background: transparent;
        border: 2px solid var(--primary);
        color: var(--primary);
    }
    .btn--secondary:hover,
    .btn--secondary:focus {
        background: rgba(33, 161, 179, .08);
        border-color: var(--primary-dark);
        color: var(--primary-dark);
    }
    .features {
        margin: 2.8vw 0 0 0;
        padding: 0;
        list-style: none;
        color: #49506a;
        font-size: 1.08rem;
        line-height: 2;
        max-width: 410px;
    }
    .dark .features {
        color: #bdcde7;
    }
    .mockup {
        border-radius: 18px;
        box-shadow: 0 8px 42px 0 rgba(67, 203, 255, 0.18), 0 0 0 2px #fff8;
        width: 38vw;
        min-width: 320px;
        max-width: 510px;
        background: white;
        margin-top: 2vw;
        aspect-ratio: 16/11;
        display: block;
    }
    @media (max-width: 1000px) {
        .hero {
            flex-direction: column-reverse;
            align-items: center;
            padding: 0 0 4vw 0;
        }
        .hero-right, .hero-left {
            padding: 2vw 2vw;
            align-items: center;
            text-align: center;
        }
        .mockup {
            width: 90vw;
            min-width: 200px;
            max-width: 96vw;
            margin: 0 auto 1.7rem auto;
        }
        .features {
            margin-left: auto;
            margin-right: auto;
        }
    }
</style>
