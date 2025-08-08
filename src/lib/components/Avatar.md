# Avatar Component

A lightweight, performant avatar component that generates unique, deterministic avatars based on user names.

## Features

- **🚀 High Performance**: Pure CSS and SVG, no external images
- **🎨 Unique Design**: Each name generates a unique color and pattern combination
- **🔄 Deterministic**: Same name always produces the same avatar
- **📱 Responsive**: Scalable to any size
- **♿ Accessible**: Includes proper alt text and titles
- **💾 Cached**: Computed values are cached for better performance
- **🎯 Lightweight**: Less than 2KB per avatar

## Usage

```svelte
<script>
  import Avatar from '$lib/components/Avatar.svelte';
</script>

<!-- Basic usage -->
<Avatar name="John Doe" />

<!-- Custom size -->
<Avatar name="Jane Smith" size={64} />

<!-- With custom CSS classes -->
<Avatar name="Alex Johnson" size={40} className="border-2 border-white shadow-lg" />
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `name` | `string` | `''` | The name to generate the avatar for |
| `size` | `number` | `48` | Size of the avatar in pixels |
| `className` | `string` | `''` | Additional CSS classes to apply |

## How It Works

1. **Hash Generation**: Creates a deterministic hash from the input name
2. **Color Selection**: Uses hash to select from 12 predefined color combinations
3. **Pattern Generation**: Creates unique SVG patterns based on hash values
4. **Initials**: Extracts and displays up to 2 initials from the name
5. **Caching**: Stores computed values to avoid recalculation

## Color Palette

The component uses 12 carefully selected colors with good contrast:
- Blue (#3B82F6)
- Emerald (#10B981) 
- Amber (#F59E0B)
- Red (#EF4444)
- Violet (#8B5CF6)
- Cyan (#06B6D4)
- Lime (#84CC16)
- Orange (#F97316)
- Pink (#EC4899)
- Indigo (#6366F1)
- Teal (#14B8A6)
- Purple (#A855F7)

## Pattern Types

Four different SVG pattern types are used:
1. **Circles**: Overlapping circular shapes
2. **Triangles**: Geometric triangle patterns
3. **Squares**: Rectangular geometric shapes
4. **Dots**: Multiple circular dots of varying sizes

## Performance Optimizations

- **Caching**: Computed avatar data is cached to avoid recalculation
- **Pre-computed Patterns**: SVG patterns are pre-generated strings
- **Minimal DOM**: Uses single div with inline SVG
- **No External Dependencies**: Pure Svelte component
- **Efficient Hash Function**: Fast string hashing algorithm

## Examples

### Blog Author Cards
```svelte
<div class="flex items-center space-x-3">
  <Avatar name={post.author} size={40} />
  <div>
    <p class="font-medium">{post.author}</p>
    <p class="text-sm text-gray-500">{post.date}</p>
  </div>
</div>
```

### User Profile
```svelte
<div class="text-center">
  <Avatar name={user.name} size={80} className="mx-auto mb-4" />
  <h2 class="text-xl font-semibold">{user.name}</h2>
</div>
```

### Comment System
```svelte
<div class="flex space-x-3">
  <Avatar name={comment.author} size={32} className="flex-shrink-0" />
  <div class="flex-1">
    <p class="font-medium text-sm">{comment.author}</p>
    <p class="text-gray-700">{comment.content}</p>
  </div>
</div>
```

## Accessibility

The component includes:
- Proper `title` attribute for hover information
- Semantic HTML structure
- High contrast color combinations
- Scalable text and graphics

## Browser Support

Works in all modern browsers that support:
- CSS custom properties
- SVG
- ES6+ JavaScript

## Testing

Visit `/avatar-test` to see the component in action with various names and sizes.
