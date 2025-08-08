<script lang="ts">
  import { onMount } from 'svelte';
  import { switchLanguage } from '$lib/text';
  import type { LayoutData } from './$types';

  interface Props {
    data: LayoutData;
  }

  let { data }: Props = $props();
  
  onMount(() => {
    // 设置当前语言
    switchLanguage(data.lang as 'en' | 'zh');
    localStorage.setItem('locale', data.lang);
  });
</script>

<slot />
