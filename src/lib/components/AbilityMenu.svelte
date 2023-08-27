<script lang='ts'>
  export let abilities: string[] = []
</script>

<div>
  {#each abilities as ability}
    <div role='menu' tabindex='0' on:mouseup={() => console.log(ability)}>{ability}</div>
  {/each}
</div>

<style>

</style>

