<script lang="ts">
  import { Editor, Viewer } from 'bytemd';
  import gfm from '@bytemd/plugin-gfm';
  import breaks from '@bytemd/plugin-breaks';
  import frontmatter from '@bytemd/plugin-frontmatter';
  import gemoji from '@bytemd/plugin-gemoji';
  import highlight from '@bytemd/plugin-highlight';
  import math from '@bytemd/plugin-math';
  import mediumZoom from '@bytemd/plugin-medium-zoom';
  import mermaid from '@bytemd/plugin-mermaid';
  import { createEventDispatcher, onMount } from 'svelte';

  onMount(() => {
    if (!readOnly) {
      const element = document.querySelector<HTMLDivElement>('.bytemd');
      if (element) element.style.height = `${height}px`;
    }
  });

  const dispatch = createEventDispatcher();

  export let readOnly = false;
  export let value = '';
  export let height = 500;
  let mode = 'split';

  const plugins = [gfm(), breaks(), frontmatter(), gemoji(), highlight(), math(), mediumZoom(), mermaid()];

  function handleChange(e) {
    value = e.detail.value;
    dispatch('change', { value });
  }
</script>

{#if !readOnly}
  <Editor editorConfig={{ theme: 'none' }} {value} {mode} {plugins} on:change={handleChange} />
{:else}
  <Viewer {value} {plugins} />
{/if}
