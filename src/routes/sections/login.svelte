<script lang="ts">
	import { baseImageRoute } from '../stores';

	let email: string = '';
	let password: string = '';
</script>

<div class="auth-container">
	<div class="form-header">
		<img src="{baseImageRoute}/logo.avif" alt="Company Logo" class="logo" />
		<p class="form-message">Acceso exclusivo para administradores</p>
	</div>
	<form class="auth-form" method="post" action="?/login">
		<div class="input-group">
			<label for="email">Correo Electrónico</label>
			<input
				type="email"
				id="email"
				name="email"
				bind:value={email}
				placeholder="Ingresa tu correo"
				required
			/>
		</div>
		<div class="input-group">
			<label for="password">Contraseña</label>
			<input
				type="password"
				id="password"
				name="password"
				bind:value={password}
				placeholder="Ingresa tu contraseña"
				required
			/>
		</div>
		<button type="submit" class="submit-button">Iniciar Sesión</button>
	</form>
</div>

<style>
	/* General Layout */
	.auth-container {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		min-height: 100vh;
		padding: 2rem;
		background-color: #000c25;
		color: #fff;
		font-family: 'Arial', sans-serif;
	}

	/* Header Section */
	.form-header {
		text-align: center;
		margin-bottom: 1.75rem;
	}

	.logo {
		width: 150px;
		margin-bottom: 1rem;
	}

	.form-message {
		font-size: 1.1rem;
		font-weight: 300;
		color: #ccc;
	}

	/* Form Styles */
	.auth-form {
		padding: 2rem;
		border-radius: 12px;
		box-shadow: 0 0 10px rgba(255, 255, 255, 0.5);
		width: 100%;
		max-width: 400px;
		display: flex;
		flex-direction: column;
		color: #222;

		background-color: #fffffff0;
		backdrop-filter: blur(5px);
		-webkit-backdrop-filter: blur(5px);
	}

	.input-group {
		margin-bottom: 1.5rem;
	}

	.input-group label {
		display: block;
		font-weight: 600;
		margin-bottom: 0.5rem;
	}

	.input-group input {
		width: 100%;
		padding: 0.75rem;
		font-size: 1rem;
		border: 1px solid #ccc;
		border-radius: 8px;
		transition: border-color 0.3s, box-shadow 0.3s;
	}

	.input-group input::placeholder {
		color: inherit;
		filter: opacity(0.8);
	}

	.input-group input:focus {
		border-color: #f27931;
		box-shadow: 0 0 4px #f27931;
		outline: none;
	}

	/* Submit Button */
	.submit-button {
		background-color: #f27931;
		color: #fff;
		font-size: 1rem;
		font-weight: bold;
		border: none;
		border-radius: 8px;
		padding: 0.75rem;
		cursor: pointer;
		transition: background-color 0.3s, box-shadow 0.3s;
	}

	.submit-button:hover {
		background-color: #e36b29;
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
	}

	.submit-button:focus {
		outline: none;
		box-shadow: 0 0 4px #f27931;
	}

	/* Responsive Design */
	@media (max-width: 768px) {
		.auth-container {
			padding: 1rem;
		}

		.form-header {
			margin-bottom: 1.5rem;
		}

		.auth-form {
			padding: 1.5rem;
			background-color: transparent;
			color: #eee;
			box-shadow: none;
		}
	}
</style>
