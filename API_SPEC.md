# API Specification for Illustration Editor Enhancements

## 1. Update Story Title

**Endpoint:** `PATCH /api/stories/{story_id}/title`

**Description:** Updates the title of a story

**Request:**
```json
{
  "title": "عنوان جدید داستان"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Title updated successfully",
  "data": {
    "id": "163a3b73-6939-44ce-aa71-e6333a5201c7",
    "title": "عنوان جدید داستان",
    "updated_at": "2025-12-12T10:30:00Z"
  }
}
```

**Error Responses:**
- `400 Bad Request`: Invalid title (empty, too long, etc.)
- `404 Not Found`: Story not found
- `401 Unauthorized`: User not authenticated
- `403 Forbidden`: User doesn't own this story

---

## 2. Upload Asset (Reusable Image)

**Endpoint:** `POST /api/users/{user_id}/assets`

**Description:** Uploads a reusable image asset for the user to use across their illustrations

**Request (multipart/form-data):**
```
image: File (image/png, image/jpeg, image/gif, image/webp)
name: string (optional - defaults to filename)
```

**Response (201 Created):**
```json
{
  "success": true,
  "message": "Asset uploaded successfully",
  "data": {
    "id": "asset-uuid-here",
    "url": "https://cdn.example.com/assets/user-123/image-uuid.png",
    "name": "my-character.png",
    "size": 45678,
    "mime_type": "image/png",
    "created_at": "2025-12-12T10:30:00Z"
  }
}
```

**Error Responses:**
- `400 Bad Request`: Invalid file type or file too large
- `401 Unauthorized`: User not authenticated
- `413 Payload Too Large`: File exceeds size limit

**Notes:**
- Maximum file size: 5MB recommended
- Supported formats: PNG, JPEG, GIF, WebP
- Files should be stored in user-specific directories

---

## 3. List User Assets

**Endpoint:** `GET /api/users/{user_id}/assets`

**Description:** Retrieves all reusable image assets for the authenticated user

**Query Parameters:**
- `page` (optional): Page number for pagination (default: 1)
- `limit` (optional): Items per page (default: 50, max: 100)

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "assets": [
      {
        "id": "asset-uuid-1",
        "url": "https://cdn.example.com/assets/user-123/image-1.png",
        "name": "character-happy.png",
        "size": 45678,
        "mime_type": "image/png",
        "created_at": "2025-12-12T10:30:00Z"
      },
      {
        "id": "asset-uuid-2",
        "url": "https://cdn.example.com/assets/user-123/image-2.png",
        "name": "background-forest.png",
        "size": 123456,
        "mime_type": "image/png",
        "created_at": "2025-12-11T15:20:00Z"
      }
    ],
    "pagination": {
      "total": 25,
      "page": 1,
      "limit": 50,
      "total_pages": 1
    }
  }
}
```

**Error Responses:**
- `401 Unauthorized`: User not authenticated

---

## 4. Delete Asset

**Endpoint:** `DELETE /api/users/{user_id}/assets/{asset_id}`

**Description:** Deletes a reusable image asset

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Asset deleted successfully"
}
```

**Error Responses:**
- `404 Not Found`: Asset not found
- `401 Unauthorized`: User not authenticated
- `403 Forbidden`: User doesn't own this asset

**Notes:**
- Should also delete the file from storage (S3, CDN, etc.)
- Consider soft-delete if assets are referenced in existing illustrations

---

## Implementation Priority

### ✅ Already Implemented (No Changes Needed)
- Canvas image export upload (uses existing `uploadImageForPart` endpoint)

### 🔴 Critical (Required for Full Functionality)
1. **Update Story Title** - Currently called in frontend but may not exist

### 🟡 Important (Enhances User Experience)
2. **Upload Asset** - Assets currently lost on refresh
3. **List User Assets** - Assets currently lost on refresh
4. **Delete Asset** - Needed for asset management

### Frontend Service Updates Needed

Update `/src/services/storyService.ts`:

```typescript
// Add if doesn't exist
async updateStoryTitle(storyId: string, title: string): Promise<void> {
  await apiClient.patch(`/stories/${storyId}/title`, { title });
}

// New asset methods
async uploadAsset(userId: string, file: File, name?: string): Promise<Asset> {
  const formData = new FormData();
  formData.append('image', file);
  if (name) formData.append('name', name);

  const response = await apiClient.post(`/users/${userId}/assets`, formData);
  return response.data.data;
}

async getUserAssets(userId: string, page = 1, limit = 50): Promise<AssetsResponse> {
  const response = await apiClient.get(`/users/${userId}/assets`, {
    params: { page, limit }
  });
  return response.data.data;
}

async deleteAsset(userId: string, assetId: string): Promise<void> {
  await apiClient.delete(`/users/${userId}/assets/${assetId}`);
}
```

### TypeScript Types

```typescript
interface Asset {
  id: string;
  url: string;
  name: string;
  size: number;
  mime_type: string;
  created_at: string;
}

interface AssetsResponse {
  assets: Asset[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    total_pages: number;
  };
}
```

---

## Notes

- All endpoints should require authentication
- Use user_id from authenticated session, don't trust client-provided user_id
- Implement proper file validation and virus scanning for uploads
- Consider CDN integration for asset serving
- Add CORS headers for cross-origin requests if needed
