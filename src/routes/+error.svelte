<div>
	<h1>404</h1>
	<h2>Page Not Found</h2>
	<a href="/">Go to Homepage</a>
</div>

<style>
	*,
	*::before,
	*::after {
		margin: 0;
		padding: 0;
		box-sizing: border-box;
		font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen,
			Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
	}

	*:focus-visible {
		outline: solid 0.25rem var(--content);
		outline-offset: 0.35rem;
		border-radius: 5px;
	}

	:global(body) {
		margin: 0;
		padding: 0;
	}

	div {
		display: grid;
		justify-items: center;
		align-content: start;
		min-height: 100vh;
		min-height: 100dvh;

		color: rgb(245, 245, 255);
		background: rgb(24, 26, 32);
	}

	h1 {
		margin-top: 5rem;
		font-size: 5rem;
	}

	h2 {
		font-size: 1.25rem;
	}

	a {
		padding: 0.325em 0.75em;
		margin-top: 2rem;
		border-radius: 10px;

		font-weight: 700;
		font-size: 1.1rem;
		white-space: nowrap;
		text-decoration: none;

		transition: 0.2s all;
		border: 1px solid rgb(65, 10, 216);
		background-color: rgba(65, 10, 216, 0.7);
		color: inherit;
	}

	a:hover,
	a:focus-visible {
		background-color: rgb(65, 10, 216);
	}
</style>
