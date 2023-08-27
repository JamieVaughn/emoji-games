<script lang="ts">
	export let setDimension: (num: number) => void;

	const setDOMDimension = (num: number) => {
		setDimension(Number(num));
		document.documentElement.style.setProperty('--grid-columns', String(num));
		document.documentElement.style.setProperty('--grid-lines', String(num));
	};

	const handleDifficulty = (e: SubmitEvent) => {
		e.preventDefault();
		for (const input of e.target) {
      console.log(input.id, input.value, input.checked)
			if (input.checked) {
				setDOMDimension(input.valueAsNumber);
			}
		}
	};
</script>

<form class="settings" on:submit={handleDifficulty}>
	Choose difficulty:
	<input type="radio" id="easy" name="difficulty" value="8" checked />
	<label for="easy"> Easy </label>
	<input type="radio" id="medium" name="difficulty" value="12" />
	<label for="medium"> Medium </label>
	<input type="radio" id="hard" name="difficulty" value="20" />
	<label for="hard"> Hard </label>
	<button type="submit" class="startBtn"> Start Game </button>
</form>

<style>
	.startBtn:active {
		transform: translateY(2px) scale(0.97);
	}
	.settings {
		margin: 0 auto;
		text-align: center;
	}
	.settings :is(input[type='radio']) {
		display: none;
	}
	.settings input:checked + label {
		background-color: skyblue;
	}
</style>
