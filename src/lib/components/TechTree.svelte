<script lang='ts'>
import { units, type UnitType } from "../data/pieces";
import Tooltip from "./Tooltip.svelte";
  
  const useList = (unit: UnitType) => {
    return [
      `Attack: ${unit.attack}`,
      `Defense: ${unit.defense}`,
      `Speed: ${unit.speed}`,
      `Range: ${unit.range ?? 1}`,
      `Unit Cap: ${unit.cap}`,
      `Cooldown: ${unit.cooldown}`,
      " --- ",
      `Abilities: `,
      unit.abilities?.join(", "),
    ].filter((i) => !!i);
  };
</script>


    <details>
      <summary class='center'>
        Open Tech tree:
      </summary>
      <h6 class='center'>Mouse over to see unit stats below:</h6>
      <div class='guide'>
        {#each Object.values(units) as u}
            <Tooltip css={u.name} content={useList(u)}>
              <p class={u.name}>
                {u.name} &#x200B;
                <span
                  class={u.css}
                  role="img"
                  aria-label={u.name + "-icon"}
                >
                  &#x200B; {u.icon}
                </span>
              </p>
            </Tooltip>
          {/each}
      </div>
    </details>

<style>
  details {
    padding: 1rem;
    text-align: center;
  }
  h6 {
    margin: 0;
  }
  .guide {
    display: grid;
    gap: 4px 0;
    margin: 0 auto;
    width: fit-content;
    grid-template-columns: repeat(4 , 1fr);
    grid-template-rows: repeat(4, 1fr);
    grid-template-areas: 
    "conscript conscript conscript conscript"
    "laborer   soldier   soldier   miner"
    "engineer  rider     bowman   alchemist"
    "siege   warelephant   ...    pyromancer ";
    justify-content: center;
    padding: 4px;
}
.guide p {
    border: 1px solid steelblue;
    border-radius: 4px;
    padding: 0 3px;
    margin: 2px;
    text-transform: capitalize;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
}
</style>
