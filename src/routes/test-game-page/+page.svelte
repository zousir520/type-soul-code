<script lang="ts">
    import GameHomePage from '$lib/components/site-game/GameHomePage.svelte';
    import { defaultGameConfig } from '$lib/types/game-config.js';
</script>

<div style="background: red; color: white; padding: 20px; text-align: center; font-size: 24px;">
    THIS IS TEST GAME PAGE
</div>

<GameHomePage gameConfig={defaultGameConfig} />