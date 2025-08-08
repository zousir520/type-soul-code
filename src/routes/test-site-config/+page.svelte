<script>
    import { onMount } from 'svelte';
    import { updateSiteConfig, siteConfig } from '$lib/stores/site-config';
    import { browser } from '$app/environment';
    
    let currentConfig = $state(null);
    let localStorageContent = $state('');
    
    onMount(() => {
        if (browser) {
            // 检查 localStorage
            localStorageContent = localStorage.getItem('vibby-site-config') || 'null';
            
            // 订阅 siteConfig
            const unsubscribe = siteConfig.subscribe(config => {
                currentConfig = config;
                console.log('Site config:', config);
            });
            
            return unsubscribe;
        }
    });
    
    function setGameMode() {
        updateSiteConfig({ type: 'site-game' });
        // 更新显示
        setTimeout(() => {
            if (browser) {
                localStorageContent = localStorage.getItem('vibby-site-config') || 'null';
            }
        }, 100);
    }
    
    function setToolMode() {
        updateSiteConfig({ type: 'site-tool' });
        setTimeout(() => {
            if (browser) {
                localStorageContent = localStorage.getItem('vibby-site-config') || 'null';
            }
        }, 100);
    }
</script>

<div class="p-8">
    <h1 class="text-2xl font-bold mb-4">Site Config Test</h1>
    
    <div class="space-y-4">
        <div>
            <h2 class="text-lg font-semibold">Current Config (from store):</h2>
            <pre class="theme-bg-muted p-2 rounded">{JSON.stringify(currentConfig, null, 2)}</pre>
        </div>
        
        <div>
            <h2 class="text-lg font-semibold">localStorage Content:</h2>
            <pre class="theme-bg-muted p-2 rounded">{localStorageContent}</pre>
        </div>
        
        <div class="space-x-4">
            <button 
                class="bg-blue-500 theme-text-primary px-4 py-2 rounded"
                onclick={setGameMode}
            >
                Set Game Mode
            </button>
            <button 
                class="bg-green-500 theme-text-primary px-4 py-2 rounded"
                onclick={setToolMode}
            >
                Set Tool Mode
            </button>
            <a 
                href="/"
                class="bg-purple-500 theme-text-primary px-4 py-2 rounded inline-block"
            >
                Go to Homepage
            </a>
        </div>
    </div>
</div>