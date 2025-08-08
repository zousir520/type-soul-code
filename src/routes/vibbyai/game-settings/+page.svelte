<script lang="ts">
    import { onMount } from 'svelte';
    import { supabase } from '$lib/supabase';

    let homepageType: 'download_button' | 'iframe' = 'download_button';
    let downloadUrl: string = '';
    let iframeUrl: string = '';
    let message: string = '';
    let isLoading: boolean = false;

    onMount(async () => {
        await fetchSettings();
    });

    async function fetchSettings() {
        isLoading = true;
        message = '';
        const { data, error } = await supabase!
            .from('game_plugin_settings')
            .select('homepage_type, download_url, iframe_url')
            .eq('id', 'vibby-game-plugin')
            .single();

        if (error && error.code !== 'PGRST116') {
            console.error('Error fetching game settings:', error);
            message = 'Error loading settings.';
        } else if (data) {
            homepageType = data.homepage_type || 'download_button';
            downloadUrl = data.download_url || '';
            iframeUrl = data.iframe_url || '';
        }
        isLoading = false;
    }

    async function saveSettings() {
        isLoading = true;
        message = '';

        const settings = {
            homepage_type: homepageType,
            download_url: homepageType === 'download_button' ? downloadUrl : null,
            iframe_url: homepageType === 'iframe' ? iframeUrl : null,
        };

        const { error } = await supabase!
            .from('game_plugin_settings')
            .update(settings)
            .eq('id', 'vibby-game-plugin');

        if (error) {
            console.error('Error saving game settings:', error);
            message = 'Error saving settings.';
        } else {
            message = 'Settings saved successfully!';
        }
        isLoading = false;
        setTimeout(() => message = '', 3000);
    }
</script>

<div class="game-settings-container">
    <h1>Game Homepage Settings</h1>

    {#if message}
        <div class="message-alert" class:success={message.includes('successfully')} class:error={message.includes('Error')}>
            {message}
        </div>
    {/if}

    <div class="form-group">
        <label for="homepageType">Homepage Type:</label>
        <select id="homepageType" bind:value={homepageType}>
            <option value="download_button">Download Button</option>
            <option value="iframe">Iframe</option>
        </select>
    </div>

    {#if homepageType === 'download_button'}
        <div class="form-group">
            <label for="downloadUrl">Download URL:</label>
            <input type="text" id="downloadUrl" bind:value={downloadUrl} placeholder="e.g., https://example.com/game.zip" />
        </div>
    {:else if homepageType === 'iframe'}
        <div class="form-group">
            <label for="iframeUrl">Iframe URL:</label>
            <input type="text" id="iframeUrl" bind:value={iframeUrl} placeholder="e.g., https://example.com/game-embed" />
        </div>
    {/if}

    <button onclick={saveSettings} disabled={isLoading}>
        {isLoading ? 'Saving...' : 'Save Settings'}
    </button>
</div>

<style>
    .game-settings-container {
        padding: 2rem;
        max-width: 600px;
        margin: 2rem auto;
        background-color: hsl(var(--card));
        border-radius: 0.5rem;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }

    h1 {
        font-size: 1.8rem;
        margin-bottom: 1.5rem;
        color: #333;
        text-align: center;
    }

    .message-alert {
        padding: 1rem;
        margin-bottom: 1rem;
        border-radius: 0.5rem;
        text-align: center;
    }

    .message-alert.success {
        background-color: #d4edda;
        color: #155724;
        border: 1px solid #c3e6cb;
    }

    .message-alert.error {
        background-color: #f8d7da;
        color: #721c24;
        border: 1px solid #f5c6cb;
    }

    .form-group {
        margin-bottom: 1rem;
    }

    label {
        display: block;
        margin-bottom: 0.5rem;
        font-weight: 600;
        color: #555;
    }

    input[type="text"],
    select {
        width: 100%;
        padding: 0.75rem;
        border: 1px solid #ccc;
        border-radius: 0.25rem;
        font-size: 1rem;
    }

    button {
        display: block;
        width: 100%;
        padding: 1rem;
        background-color: #007bff;
        color: white;
        border: none;
        border-radius: 0.5rem;
        font-size: 1.1rem;
        cursor: pointer;
        transition: background-color 0.3s ease;
    }

    button:hover:not(:disabled) {
        background-color: #0056b3;
    }

    button:disabled {
        background-color: #cccccc;
        cursor: not-allowed;
    }
</style>