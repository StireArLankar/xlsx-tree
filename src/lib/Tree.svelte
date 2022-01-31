<script lang="ts">
  import type { ReadyData } from '../types'

  import { slide } from 'svelte/transition'

  export let title = ''
  export let temp = ''
  export let children: ReadyData[] = []
  export let indent = 0

  export let open = false

  function toggleOpen() {
    open = !open
  }
</script>

{#if children.length > 0}
  <div class="header" style="padding-left: {indent}px">
    <span class="toggle" on:click={toggleOpen}>
      {title ? title : 'NO TITLE ' + temp}
    </span>
  </div>

  {#if open}
    <div transition:slide={{ duration: 300 }}>
      {#each children as child}
        <svelte:self {...child} indent={indent + 8} />
      {/each}
    </div>
  {/if}
{:else}
  <div class="header" style="padding-left: {indent}px">
    📜 {title ? title : 'NO TITLE ' + temp}
  </div>
{/if}

<style>
  .header {
    padding: 4px;
  }

  .toggle {
    cursor: pointer;
    user-select: none;
    max-width: max-content;
  }
</style>
