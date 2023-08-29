<script>

export let selected = [null, null]
export let empty = false

import { units } from '../data/pieces'


    const unit = units[selected[1]?.type]
    let total = selected[1]?.total
</script>

{#if empty || !unit}
<section class='unitcard'>
  <h4>Select Troops</h4>
</section>
{:else}
      <section class='unitcard mustered'>
        <h3 data-capital>{unit.name}</h3> 
        <span>
          <code>{Math.round(total)} troops @ ({selected?.[0] ?? 0 % 8},{ Math.floor(selected?.[0] ?? 0 / 8)})</code>
        </span>
        {#if unit.abilities.length}
          <h4>Abilities: </h4>
          <span>{unit.abilities.join(', ')}</span>
        {/if}
        <h4>Stats:</h4>
        <span>Attack: {unit.attack}, Defense: {unit.defense}, Range: {unit.range}, Speed: {unit.speed}</span>
      </section>
{/if}
    


<style>
  .unitcard {
    position: absolute;
    left: 8px;
    top: 8px;
    border: 1px solid silver;
    border-radius: 10px;
    background: #f2f2f2;
    box-shadow:  20px 20px 60px #f1f1f1,
             -20px -20px 60px #ffffff;
    padding: 1rem;
    display: grid;
    grid-gap: 8px;
    color: navy;
}
.unitcard :is(h3) {
    margin: 2px 0;
}
.unitcard :is(h4) {
  margin: 2px 0;
  justify-self: end;
}
.unitcard :is([data-capital]) {
  text-transform: capitalize;
}
.unitcard :is(span) {
    color: royalblue;
    font-size: 12px;
}
.unitcard.mustered {
    grid-template-columns: min-content 125px;
    align-items: center;
}
</style>