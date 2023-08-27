<script lang='ts'>
import Difficulty from './DifficultyMenu.svelte'
import TechTree from "./TechTree.svelte";
import World from "./World.svelte";
import { initResources } from "../data/pieces";
	import { onMount } from "svelte";

// const POSITION = {x: 0, y: 0}

  // state
  const positionOne = 0
  let playing = true
  let delay = 1000
  let dimension = 8
  // derived signals
  const resources = () => initResources(dimension);
  const positionTwo = () => dimension ** 2 -1
  const setDimension = (num: number) => {
    dimension = num;
  };
  let board = () => Array(dimension ** 2)
                      .fill(0)
                      .map(() => ({ type: "c", total: 0, player: 1 }));

  // const [dragState, setDragState] = createSignal({
  //     isDragging: false,
  //     origin: POSITION,
  //     translation: POSITION
  // })
  // setDragState(state => ({
  //     isDragging: true,
  //     origin: {x: clientX, y: clientY}
  // }))

  

  // const panScreen = useCallback(({clientX, clientY}) => {
  //     // console.log(clientX, clientY)
  //     if(clientX ===  0) {
  //         // console.log(board.current.style.transform)
  //         // console.log(board.current.style.transform.match(/\d/))
  //         if(!board.current.style.transform) {
  //             board.current.style.transform = 'translateX(1px)'
  //         }
  //         let newPos = board.current.style.transform.replace(/\d/, str => {
  //             // console.log(str)
  //             // console.log(`translateX(${str ? Number(str) + 1 : 1 }px)`)
  //           return `translateX(${str ? Number(str) + 1 : 1 }px)`
  //         })
  //         board.current.style.transform = newPos
  //     }
  //     if(clientX >= window.innerWidth) {
  //         // console.log(window.screenY, board.current)
  //     }
  //     if(clientY === 0) {
  //         // console.log(board.current.style.transform.match(/\d/))
  //         let newPos = board.current.style.transform.replace(/\d/, str => `translateY(${Number(str) + 1}px)`)
  //         board.current.style.setPropertyValue('transform', newPos)
  //     }
  //     if(clientX >= window.innerHeight) {
  //         // console.log(window.screenY, board.current)
  //     }
  // })
  // useEventListener('mousemove', panScreen)

  // Drag Event Handlers
  // const cursor = useMemo(() => ({
  //     cursor: dragState.isDragging ? 'e-resize' : 'grab',
  // }), [dragState.isDragging, dragState.translation])
  // const handleMouseMove = useCallback(({clientX, clientY}) => {
  //     const translation = {
  //         x: clientX - dragState.origin.x,
  //         y: clientY - dragState.origin.y
  //     }
  //     setDragState(state => ({
  //         ...state,
  //         translation
  //     }))
  // }, [dragState.origin])
  // const handleMouseUp = useCallback(() => {
  //     setDragState(state => ({
  //         ...state,
  //         isDragging: false
  //     }))
  // }, [])
  // useEffect(() => {
  //     if(dragState.isDragging) {
  //         window.addEventListener('mousemove', handleMouseMove)
  //         window.addEventListener('mouseup', handleMouseUp)
  //     } else {
  //         window.removeEventListener('mousemove', handleMouseMove)
  //         window.removeEventListener('mouseup', handleMouseUp)
  //     }
  //     setDragState(state => ({...dragState, translation: POSITION}))
  // }, [dragState.isDragging, handleMouseMove, handleMouseUp])

  // createEffect(() => {
  //   console.log('state', dimension(), positionTwo(), resources())
  // })

  let count = 0
onMount(() => {
  setInterval(() => {
    count = playing ? count + 1 : count
  }, 1000)
})

  const getMinutes = () => {
    const mins = count/60
    return mins > 1 ? mins.toFixed(0) : '00'
  }
  const getSeconds = () => {
    const sec = count%60 
    return sec > 9 ? sec : '0'+String(sec)
  }
</script>

<section class='kings'>
  <h1 class='center'>King's Corvée</h1>
  <h6 class='center'>A Cooldown-based Strategy game.</h6>
  <div class='flex'><span>{getMinutes()}:{getSeconds()}</span><button on:click={() => playing = !playing}>{playing ? 'Pause' : 'Resume'}</button></div>
  <Difficulty setDimension={setDimension} />
  <span><TechTree /></span>
</section>
<World {delay} {dimension} {board} {resources} {playing} />

<style>
  .kings {
	background: #f6f6f6;
    color: #333;
}
.kings :is(label, button) {
    font-size: 1rem;
    border: 1px solid steelblue;
    border-radius: 4px;
    padding: 4px;
    margin: 0 2px;
}
</style>