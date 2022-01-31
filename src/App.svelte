<script lang="ts">
  import type { ReadyData } from './types'
  import Node from './lib/Tree.svelte'
  import Upload from './lib/FileUpload.svelte'

  let root: ReadyData[] = (() => {
    try {
      return JSON.parse(window.testData)
    } catch (e) {
      return null
    }
  })()
</script>

{#if Boolean(root)}
  {#each root as child}
    <Node {...child} open />
  {/each}
{:else}
  <Upload onFileUpload={(data) => (root = data)} />
{/if}
