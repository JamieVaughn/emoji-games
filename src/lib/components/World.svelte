<script lang='ts'>
import { units } from "../data/pieces";
import AbilityMenu from "./AbilityMenu.svelte";
import UnitCard from './UnitCard.svelte'
import { canReach, draw, isEdge, growthFactor } from "../helpers";
import { onDestroy, onMount } from "svelte";
import type { TroopType } from "$lib/types";

// type Props = delay: number, dimension: number, resources: Array<{}>, playing: boolean
export let delay: number, dimension: number, board: () => any[], resources: { [key: number]: string }, playing: boolean;
const decay = false;
  let world: HTMLDivElement // ref for world component
  // state
  let inspect = false
  let apm = 0 // increment for every user input event
  let forts = [0]
  let muster: [any, any] = [null, null] // [index, total]
  let selected: any = null
  let busy: Array<{id: number, type: string, ability: string[], total?: number}> = [] // 
  let troops: Array<TroopType> = Array(dimension ** 2)
    .fill(0)
    .map((_, i) => ({ type: "c", total: i === 0 ? 1 : 0, player: 1 }))
  // const [boost, setBoost] = createSignal(1)

  // derived state
  const mode = () => dimension === 8 ? 'easy' : dimension === 12 ? 'med' : 'hard'

  const drawCallback = () => {
    tick = tick + Number(playing)
  }
  // world clock
  let tick = 0
  let interval1: NodeJS.Timeout
  let interval2: NodeJS.Timeout
  onMount(() => {
  interval1 = setInterval(() => {
    if(!playing) return;
    drawCallback()
    troops = troops?.map((unit, id) => {
        let cap = units[unit.type].cap;
        if (unit.total < 0) {
          unit.total = 0
          return unit;
        }
        if (forts.includes(id)) {
          let delta = growthFactor(cap, unit.total);
          unit.total += delta;
          return unit;
        }
        if (decay) {
          return (unit.total -= Math.floor(Math.random() * 1.1)), unit;
        }
        return unit;
      });
  }, delay * 3 || 3000)
  interval2 = setInterval(() => {
    if(true) return
    console.log(`World Clock: ${playing ? tick : `paused: ${tick}`} seconds`)
    console.log(`Troops: `, {muster, busy, selected})
    if(inspect) {
      // console.log(`APM: ${(apm / (tick/60)).toFixed(1)}`)
      console.log(`board: ${dimension}x${dimension} => ${troops.length}`, {board: board()})
      console.log('resources', resources)
    }
  }, 10_000)
  })

  onDestroy(() => {
    clearInterval(interval1)
    clearInterval(interval2)
  })
  
  const useInspect = (e: MouseEvent) => {
    if (e.shiftKey) inspect = !inspect
  }

  const animationFrame = draw(0, {drawCallback, fps: 0.33} )

  onDestroy(() => {
    cancelAnimationFrame(animationFrame)
  })
  
  const deployMusteredTroops = (e: MouseEvent, unit: TroopType, target: any) => {
    // e.preventDefault();
    console.log('sel', target, unit, muster[1])
    selected = [target, muster[1]];
    // console.log('Muster', ...muster)
    // console.log('Target', target, unit)
    const pos = muster[0];
    console.log('deploy', e, target)
    if (!(typeof target === "number") || !(typeof pos === "number")) return;
    if (isEdge(pos, target, dimension)) return;
    if (
      target === pos ||
      troops[target].type !== unit.type ||
      troops[target].total >= units[troops[target].type].cap
    ) {
      muster = [null, null];
    }
    let delta: number;
    if (troops[target].total + unit.total >= units[unit.type].cap) {
      delta = units[unit.type].cap - unit.total;
    }
    const { type, total: quantity, player} = muster[1]
    if (type !== unit.type && player === unit.player) return;
    if (player !== unit.player) return console.log("Battles not yet supported");
    // console.log('edge', isEdge(pos, target, dimension), 'same', target === pos)

    if (canReach(muster).has(target)) {
      troops = troops.map((u, idx) => {
          if (idx === pos) {
            u.total -= delta ?? quantity;
            return u;
          } else if (idx === target) {
            u.total += delta ?? quantity;
            return u;
          } else {
            return u;
          }
        })
      
      muster = [null, null]
    }
    activateAbility(e, unit, target)
  };

  const musterTroops = (unit: TroopType, id: number) => {
    console.log('muster', {id, unit, busy});
    if (busy.find((a) => a.id === id)) return;
    if (typeof id === "number" && unit.total > 0) {
      muster = [id, unit]
      selected = [id, unit]
    }
  };

  const applyCooldown = (id: number, unit: TroopType, domref: HTMLElement | null) => {
    if(!domref) return;
    busy = busy.concat({ ...unit, id })
    let cd = units[unit.type].cooldown
    domref.style.setProperty("animation-duration", cd + "s");
    let timeout: NodeJS.Timeout = setTimeout(() => {
      busy = busy.filter((a) => a.id !== id)
      return clearTimeout(timeout)
    }, cd * 1000);
  }

  const activateAbility = (e, unit, id: number) => {
    e.preventDefault();
    selected = [id, unit]
    if (busy.find(a => (a.id === id))) return;
    let troopEl = document.querySelector('.selected') // e.target.children.length ? e.target.children[1] : e.currentTarget
    console.log('activate', id, unit, troopEl);
    if (typeof id === "number" && unit.total > 0) applyCooldown(id, unit, troopEl)
  };

  const isReachableZone = (target: number, css: 'deploy' | 'build') => {
    if(canReach(muster).has(target)) console.log('reachable', muster, canReach(muster), target, )
    if (muster?.[0] === null) return "";
    if (muster?.[0] === target) return 'muster'
    if (canReach(muster).has(target)) return css;
    return "";
  };

  const delegateAPM = (e: MouseEvent) => {
    e.preventDefault()
    apm = apm + 1
    selected = null
  }

  const handleCellClick = (e: MouseEvent, unit: TroopType, i: number) => {
    console.log( {i: i(), muster: muster[0], reach: canReach(muster)})
    selected = [i, unit]
    if(troops[i]?.total === 0 && !canReach(muster).has(i)) {
      muster = [null, null]
      return
    }
    if(muster.every(m => m?.valueOf)) {
      deployMusteredTroops(e, unit, i())
      muster = [null, null]
    } else {
      musterTroops(unit, i)
    }
  }

</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
<div class='worldwrapper' on:contextmenu={delegateAPM} on:click={delegateAPM} on:doubleclick={delegateAPM}>
  <div class='world' bind:this={world}>
    <div class='backboard' />
    <section
      class={`${mode()} grid`}
      role='menu'
      tabindex='0'
      on:keydown={e => e.shiftKey ? console.log(troops) : null}
      on:click={e => e.shiftKey ? console.log(troops) : null}
      on:contextmenu={(e) => e.preventDefault()}
    >
      {#each troops as unit, i}
            <div
              class:cell={true}
              class:king={forts.includes(i)}
              class={isReachableZone(i, 'deploy')}
              on:click={(e) => handleCellClick(e, unit, i)}
              on:dragstart={(e) => {console.log('dragstart')}}
              on:dragend={(e) => {console.log('endcap', e); deployMusteredTroops(e, unit, i) }}
              on:drop={e => {if(isReachableZone(i, 'deploy')) {deployMusteredTroops(e, unit, i);}}}
              on:dragover={e => e.preventDefault()}
            >
            <span style={'opacity: 0.7'}>{i}</span>
              {#if troops && unit.total > 0}
                <div
                  class:selected={selected?.[0] === i}
                  class:oncooldown={busy.find(a => a.id === i)}
                  class='troop'
                  on:click={(e) => { e.stopPropagation(); selected = [i, unit] }}
                  on:mousedown={(e) => { e.stopPropagation(); musterTroops(unit, i) }}
                  draggable='true'
                  on:contextmenu={e => {e.preventDefault(); busy = busy.concat({...unit, id: i})}}
                >
                  <span>{Math.round(troops[i].total)}</span>
                  <span class={units[unit.type].css}>
                    {units[unit.type].icon}
                  </span>
                </div>
                {#if !busy?.find(a => Number(a.id) === i) && false}
                  <AbilityMenu 
                    abilities={units[unit.type].abilities} 
                    on:contextmenu={(e) => {e.preventDefault(); activateAbility(e, unit, i)}} 
                  />
                {/if}
              {/if}
              {#if typeof resources?.[i] === "string"}
                <span class={`feature ${resources[i]}`}>
                  {resources[i]}
                </span> 
              {/if}
            </div>
      {/each}
    </section>
  </div>
  <div on:mouseenter={useInspect}>
    {#if troops && selected}
      <UnitCard selected={selected} />
    {:else}
      <UnitCard empty={true} />
    {/if}
  </div>
</div>


<style>
  .worldwrapper {
    min-height: calc(100vh - 375px);
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 2rem;
    background: #dedede;
}
.world {
    transform: rotateX(60deg) rotateY(0deg) rotateZ(-50deg);
}
.backboard {
    position: absolute;
    padding: var(--board-padding);
    background: center / cover url('/grass.png') forestgreen no-repeat;
    height: calc(var(--grid-tile-size) * var(--grid-lines) + 2 * var(--board-padding));
    width: calc(var(--grid-tile-size) * var(--hex-buffer) + 3 * var(--board-padding));
    border: 1px solid #888;
    filter: hue-rotate(-30deg) sepia(.1) drop-shadow(-20px 20px 30px black);

}
.grid {
    margin: var(--board-padding) 0 0 var(--board-padding);
    height: calc(var(--grid-tile-size) * var(--grid-lines));
    width: calc(var(--grid-tile-size) * var(--grid-columns));
    display: grid;
    grid-template-rows: repeat(var(--grid-columns), 1fr);
    grid-template-columns: repeat(var(--grid-lines), 1fr);
    grid-gap: var(--grid-gap);
}
.king {
    background: 
        center
        var(--kings-crown)
        no-repeat;
    background-size: 50px 50px;
    
}
.feature {
    position: absolute;
    font-size: 3rem;
    transform: rotateX(-25deg) rotateY(15deg) rotateZ(53deg) scaleX(1) scaleY(1.7) translateY(-3px);
}
.cell {
    background-color: transparent;
    /* width: var(--cell-side);
    height: var(--cell-side); */
    transition: all 400ms;
    transition: outline 0ms;
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    border: var(--border) solid rebeccapurple;
    overflow: hidden;
    user-select: none;
}

.cell:hover, .muster:hover {
    outline: 3px dashed deeppink;
}
.troop {
    background: #ffffff70;
    border: 2px solid rgba(255, 255, 255, 0.8);
    border-radius: 4px;
    white-space: nowrap;
    display: flex;
    justify-content: center;
    align-items: center;
    user-select: none;
    font-weight: 700;
    padding: 0 2px;
    z-index: 1;
    transform: rotateX(-25deg) rotateY(15deg) rotateZ(53deg) scaleX(1) scaleY(1.75);
}
.build { background-color: var(--build-color-light);}
.deploy { background-color: var(--deploy-color-light);}
.muster {background-color: var(--selection-color-light);}
.muster .troop { background: #fff;}
.selected {
    border: 2px dashed dodgerblue;
	}
[class*='troop'].oncooldown {
	background: linear-gradient(to right, #f7456370 50%, #ffffff70 50%);
	background-size: 200% 100%;
	background-position: 99% 0%;
	animation: linear 0s 1 none cooldown;
	animation-duration: 3s;
}
@keyframes cooldown {
    0% {
        background-position: 00% 0%;
	}
    100% {
        background-position: 100% 0%;
        
    }
}
</style>