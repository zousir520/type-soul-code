<script lang="ts">
  interface Props {
    title: string;
    class?: string;
  }

  let { title, class: className = '' }: Props = $props();

  // Generate a consistent color based on title
  function getColorFromTitle(title: string): string {
    let hash = 0;
    for (let i = 0; i < title.length; i++) {
      const char = title.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32bit integer
    }
    
    const colors = [
      'from-blue-600 to-purple-600',
      'from-green-500 to-teal-600',
      'from-purple-500 to-pink-600',
      'from-orange-500 to-red-600',
      'from-indigo-500 to-blue-600',
      'from-teal-500 to-green-600',
      'from-pink-500 to-rose-600',
      'from-cyan-500 to-blue-600'
    ];
    
    return colors[Math.abs(hash) % colors.length];
  }

  const gradientClass = getColorFromTitle(title);
</script>

<div class="relative {className} bg-gradient-to-br {gradientClass} flex items-center justify-center overflow-hidden">
  <!-- Tech Pattern Background -->
  <div class="absolute inset-0 opacity-20">
    <svg class="w-full h-full" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <!-- Grid Pattern -->
      <defs>
        <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
          <path d="M 10 0 L 0 0 0 10" fill="none" stroke="white" stroke-width="0.5" opacity="0.3"/>
        </pattern>
      </defs>
      <rect width="100" height="100" fill="url(#grid)" />
      
      <!-- Tech Elements -->
      <circle cx="20" cy="20" r="2" fill="white" opacity="0.4"/>
      <circle cx="80" cy="30" r="1.5" fill="white" opacity="0.3"/>
      <circle cx="60" cy="70" r="1" fill="white" opacity="0.5"/>
      <circle cx="30" cy="80" r="1.5" fill="white" opacity="0.3"/>
      
      <!-- Lines -->
      <line x1="20" y1="20" x2="40" y2="35" stroke="white" stroke-width="0.5" opacity="0.3"/>
      <line x1="60" y1="70" x2="80" y2="30" stroke="white" stroke-width="0.5" opacity="0.2"/>
      <line x1="30" y1="80" x2="60" y2="70" stroke="white" stroke-width="0.5" opacity="0.3"/>
    </svg>
  </div>

  <!-- Content -->
  <div class="relative z-10 text-center p-8">
    <!-- Tech Icon -->
    <div class="mb-4">
      <svg class="w-16 h-16 mx-auto theme-text-primary opacity-80" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
      </svg>
    </div>
    
    <!-- Title -->
    <h3 class="theme-text-primary font-bold text-lg leading-tight opacity-90 max-w-xs">
      {title}
    </h3>
  </div>

  <!-- Floating Elements -->
  <div class="absolute top-4 right-4 w-2 h-2 theme-bg-card rounded-full opacity-40 animate-pulse"></div>
  <div class="absolute bottom-6 left-6 w-1 h-1 theme-bg-card rounded-full opacity-60"></div>
  <div class="absolute top-1/3 left-4 w-1.5 h-1.5 theme-bg-card rounded-full opacity-30"></div>
</div>
