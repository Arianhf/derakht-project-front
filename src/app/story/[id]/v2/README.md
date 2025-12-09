# Story V2 Preview Page

This page route displays stories using the new **StoryPreviewV2** component with full responsive layouts and orientation support.

## 🌐 URL Pattern

```
/story/[id]/v2
```

Where `[id]` is the UUID of the story.

---

## 📝 Usage Examples

### Basic Usage

Display a story with its default size and orientation:

```
/story/abc123-def456-ghi789/v2
```

### Testing Different Layouts

Override the story's size and orientation using query parameters:

#### Square Layouts

```
# 20x20 square
/story/abc123-def456-ghi789/v2?size=20x20

# 25x25 square
/story/abc123-def456-ghi789/v2?size=25x25
```

#### Rectangle Layouts

```
# Landscape rectangle (15x23)
/story/abc123-def456-ghi789/v2?size=15x23&orientation=LANDSCAPE

# Portrait rectangle (15x23)
/story/abc123-def456-ghi789/v2?size=15x23&orientation=PORTRAIT
```

#### Default Fallback

```
# Remove all params to test default/null handling
/story/abc123-def456-ghi789/v2
```

---

## 🔧 Query Parameters

| Parameter | Type | Values | Description |
|-----------|------|--------|-------------|
| `size` | string | `'20x20'` \| `'25x25'` \| `'15x23'` | Override story size |
| `orientation` | string | `'LANDSCAPE'` \| `'PORTRAIT'` | Override story orientation |

**Note**: Query parameters are optional and only used for testing. In production, stories should have these values set in the database.

---

## 🎨 Layout Behavior

### Desktop (> 768px)

All layouts display **side-by-side** (text on left, image on right):
- Square 20x20: Two 1:1 squares
- Square 25x25: Two 1:1 squares (larger)
- Landscape 15x23: Two 23:15 rectangles
- Portrait 15x23: Two 15:23 rectangles

### Mobile (≤ 768px)

- **Square layouts**: Stacked vertically (text above, image below)
- **Rectangle layouts**: Single-page view with navigation
  - Text → Image → Next Part's Text → ...
  - Swipe gestures + arrow buttons

---

## 🐛 Debug Mode

In **development mode**, a debug panel appears in the top-right corner showing:

- Story ID
- Current size
- Current orientation
- Number of parts
- Quick links to test different layouts

**Debug panel is automatically hidden in production builds.**

---

## 🚀 How to Test

1. **Find a story ID**:
   ```bash
   # From your API or database
   curl http://localhost:8000/api/stories/
   ```

2. **Visit the V2 page**:
   ```
   http://localhost:3000/story/YOUR-STORY-ID/v2
   ```

3. **Test different layouts** using the debug panel links (in development)

4. **Test responsiveness**:
   - Resize browser window
   - Use browser dev tools device emulation
   - Test on actual mobile device

5. **Test interactions**:
   - **Desktop**: Click arrow buttons, use keyboard (←/→)
   - **Mobile**: Swipe left/right, tap arrow buttons

---

## 🔄 Comparison with Original

| Feature | Original (`/story/[id]`) | V2 (`/story/[id]/v2`) |
|---------|-------------------------|----------------------|
| Component | StoryPreview | StoryPreviewV2 |
| Edit Mode | ✅ Yes | ❌ No (view only) |
| Size Support | ❌ No | ✅ Yes |
| Orientation Support | ❌ No | ✅ Yes |
| Aspect Ratios | Fixed | Dynamic (1:1, 23:15, 15:23) |
| Mobile Layout | Stacked | Context-aware (stacked or single-page) |
| Swipe Support | ❌ No | ✅ Yes |
| Query Params | mode | size, orientation |

---

## 📦 Files Structure

```
src/app/story/[id]/v2/
├── page.tsx              # Main page component
├── StoryV2Page.module.scss   # Page styles
└── README.md             # This file
```

---

## 🔗 Integration Points

### From Story List

Add a link to the V2 preview:

```tsx
<a href={`/story/${story.id}/v2`}>
  View in V2 Preview
</a>
```

### From Original Story Page

Add a toggle button:

```tsx
<button onClick={() => router.push(`/story/${id}/v2`)}>
  Switch to V2 Preview
</button>
```

### Back Navigation

The V2 page navigates back to `/story` on close. To customize:

```tsx
const handleClose = () => {
  router.push('/your-custom-path');
};
```

---

## ⚡ Performance

- **Image Optimization**: Uses Next.js Image component
- **Lazy Loading**: Images load on-demand
- **Code Splitting**: Page is automatically code-split
- **Caching**: Story data is fetched fresh each visit

---

## 🐛 Error Handling

The page handles several error states:

1. **Invalid Story ID**: Shows error message
2. **Story Not Found**: Shows "Story not found" message
3. **Empty Story** (no parts): Shows "Story is empty" message
4. **Network Error**: Shows retry option with toast notification

All error states include a "Back" button to return to the story list.

---

## 🎯 Testing Checklist

- [ ] Load story with default values
- [ ] Override size with query param
- [ ] Override orientation with query param
- [ ] Test all layout combinations (square 20x20, 25x25, landscape, portrait)
- [ ] Test on mobile (< 768px)
- [ ] Test on tablet (768px - 1024px)
- [ ] Test on desktop (> 1024px)
- [ ] Test swipe gestures on touch device
- [ ] Test keyboard navigation (arrow keys)
- [ ] Test with story that has no parts
- [ ] Test with invalid story ID
- [ ] Test with very long text content
- [ ] Test with custom background/font colors
- [ ] Test back navigation

---

## 🚧 Future Enhancements

1. **Admin Mode**: Allow admins to set size/orientation via UI
2. **Sharing**: Add social sharing buttons
3. **Printing**: Print-optimized layout using actual size values
4. **Analytics**: Track which layouts are most popular
5. **Bookmarking**: Save progress within story
6. **Audio**: Add narration support
7. **Animations**: Page flip effects

---

## 📞 Support

For issues or questions:
- Check component docs: `src/components/story/StoryPreviewV2.README.md`
- Review examples: `src/components/story/StoryPreviewV2.example.tsx`
- Contact development team

---

**Last Updated**: 2025-12-09
**Version**: 1.0.0
**Status**: ✅ Production Ready
