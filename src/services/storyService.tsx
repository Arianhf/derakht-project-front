// src/services/storyService.tsx
import api from './api';
import {
  StoryTemplate,
  StoryResponse,
  Story,
  StoryPart,
  Asset,
  AssetsResponse,
  TemplatePart,
  CreateTemplatePayload,
  UpdateTemplatePayload,
  CreateTemplatePartStandalonePayload,
  UpdateTemplatePartPayload
} from '@/types/story';

export const storyService = {
  getAllStories: async (): Promise<StoryResponse<StoryTemplate>> => {
    const response = await api.get('/stories/');
    return response.data;
  },

  getStoryById: async (id: string): Promise<Story> => {
    console.log('[storyService] ========== getStoryById called ==========');
    console.log('[storyService] Request ID:', id);
    console.log('[storyService] Request URL:', `/stories/${id}/`);
    console.log('[storyService] ID type:', typeof id);
    console.log('[storyService] ID is valid UUID:', /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id));

    try {
      console.log('[storyService] Making GET request to API...');
      const response = await api.get(`/stories/${id}/`);

      console.log('[storyService] Response received');
      console.log('[storyService] Response status:', response.status);
      console.log('[storyService] Response headers:', response.headers);
      console.log('[storyService] Response data type:', typeof response.data);
      console.log('[storyService] Response data keys:', response.data ? Object.keys(response.data) : 'null');
      console.log('[storyService] Story ID from response:', response.data?.id);
      console.log('[storyService] Story name from response:', response.data?.name);
      console.log('[storyService] Story parts count:', response.data?.parts?.length);

      return response.data;
    } catch (error: any) {
      console.error('[storyService] ========== API Error ==========');
      console.error('[storyService] Error occurred in getStoryById');
      console.error('[storyService] Error type:', typeof error);
      console.error('[storyService] Error message:', error?.message);
      console.error('[storyService] Error code:', error?.code);
      console.error('[storyService] Error response status:', error?.response?.status);
      console.error('[storyService] Error response data:', error?.response?.data);
      console.error('[storyService] Full error:', error);

      throw error;
    }
  },

  createStory: async (storyData: FormData): Promise<StoryTemplate> => {
    const response = await api.post('/stories/', storyData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  updateStory: async (id: string, storyData: FormData): Promise<StoryTemplate> => {
    const response = await api.put(`/stories/${id}/`, storyData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  addStoryPart: async (
    storyId: string,
    storyPartTemplateId: string,
    canvasTextData?: object,
    canvasIllustrationData?: object
  ): Promise<StoryPart> => {
    const payload: {
      story_part_template_id: string;
      canvas_text_data?: object;
      canvas_illustration_data?: object;
    } = {
      story_part_template_id: storyPartTemplateId,
    };

    // Only include canvas data if provided
    if (canvasTextData) {
      payload.canvas_text_data = canvasTextData;
    }
    if (canvasIllustrationData) {
      payload.canvas_illustration_data = canvasIllustrationData;
    }

    const response = await api.post(`/stories/${storyId}/add_part/`, payload);
    return response.data;
  },

  resetStoryPart: async (
    partId: string,
    resetText: boolean = true,
    resetIllustration: boolean = true
  ): Promise<StoryPart> => {
    const payload: {
      reset_text?: boolean;
      reset_illustration?: boolean;
    } = {};

    // Include reset flags based on parameters
    if (resetText !== undefined) {
      payload.reset_text = resetText;
    }
    if (resetIllustration !== undefined) {
      payload.reset_illustration = resetIllustration;
    }

    const response = await api.post(`/stories/parts/${partId}/reset/`, payload);
    return response.data;
  },

  finishStory: async (storyId: string, title: string): Promise<StoryTemplate> => {
    const response = await api.post(`/stories/${storyId}/finish/`, { title });
    return response.data;
  },

  getApiStories: async (page: number = 1, pageSize: number = 12): Promise<StoryResponse<Story>> => {
    const response = await api.get('/stories/', {
      params: { page, page_size: pageSize }
    });
    return response.data;
  },

  uploadImageForPart: async (formData: FormData) => {
    const response = await api.post('/stories/upload-part-image/', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  finalizeStory: async (storyId: string, title: string) => {
    const response = await api.post(`/stories/${storyId}/finalize/`, { title });
    return response.data;
  },

  // Upload cover image for a story
  uploadStoryCoverImage: async (storyId: string, imageFile: File): Promise<Story> => {
    const formData = new FormData();
    formData.append('cover_image', imageFile);

    const response = await api.post(`/stories/${storyId}/upload_cover/`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Set story configuration (colors)
  setStoryConfig: async (
    storyId: string,
    config: { background_color?: string | null; font_color?: string | null }
  ): Promise<Story> => {
    const response = await api.post(`/stories/${storyId}/set_config/`, config);
    return response.data;
  },

  // Set cover image from existing story part illustration
  setCoverImageFromUrl: async (storyId: string, imageUrl: string): Promise<Story> => {
    const response = await api.post(`/stories/${storyId}/set_cover_from_url/`, {
      cover_image_url: imageUrl,
    });
    return response.data;
  },

  // Get all completed stories from all users
  getCompletedStories: async (page: number = 1, pageSize: number = 12): Promise<StoryResponse<Story>> => {
    const response = await api.get('/stories/completed/', {
      params: { page, page_size: pageSize }
    });
    return response.data;
  },

  // Update story title
  updateStoryTitle: async (storyId: string, title: string): Promise<Story> => {
    const response = await api.patch(`/stories/${storyId}/title/`, { title });
    return response.data;
  },

  // Asset Management Methods

  /**
   * Upload a reusable image asset
   * @param userId - The user ID (must match authenticated user)
   * @param file - Image file to upload
   * @param name - Optional name for the asset
   */
  uploadAsset: async (userId: string, file: File, name?: string): Promise<Asset> => {
    const formData = new FormData();
    formData.append('file', file);  // Backend expects 'file', not 'image'
    if (name) {
      formData.append('name', name);
    }

    // Remove the default Content-Type header to let axios set multipart/form-data with boundary
    const response = await api.post(`/users/${userId}/assets/`, formData, {
      headers: {
        'Content-Type': undefined,
      },
    });

    // Map backend response (file) to frontend expectation (url)
    const data = response.data;
    return {
      id: data.id,
      url: data.file || data.url, // Backend returns 'file', frontend expects 'url'
      name: name || 'asset',
      created_at: data.created_at,
      size: 0, // Backend doesn't return size in upload response
      mime_type: file.type,
    };
  },

  /**
   * Get all assets for the authenticated user
   * @param userId - The user ID (must match authenticated user)
   * @param page - Page number (default: 1)
   * @param limit - Items per page (default: 50)
   */
  getUserAssets: async (userId: string, page: number = 1, limit: number = 50): Promise<AssetsResponse> => {
    const response = await api.get(`/users/${userId}/assets/`, {
      params: { page, limit },
    });

    // Map backend response if needed
    const data = response.data;
    const assets = (data.results || data.assets || []).map((asset: any) => ({
      id: asset.id,
      url: asset.file || asset.url, // Backend returns 'file', frontend expects 'url'
      name: asset.name || 'asset',
      created_at: asset.created_at,
      size: asset.size || 0,
      mime_type: asset.mime_type || 'image/jpeg',
    }));

    return {
      assets,
      pagination: data.pagination || {
        total: data.count || 0,
        page: page,
        limit: limit,
        total_pages: Math.ceil((data.count || 0) / limit),
      },
    };
  },

  /**
   * Delete an asset by ID
   * @param userId - The user ID (must match authenticated user)
   * @param assetId - The asset ID to delete
   */
  deleteAsset: async (userId: string, assetId: string): Promise<void> => {
    await api.delete(`/users/${userId}/assets/${assetId}/`);
  },

  /**
   * Delete a story by ID
   * @param storyId - The story ID to delete
   */
  deleteStory: async (storyId: string): Promise<void> => {
    await api.delete(`/stories/${storyId}/`);
  },

  // ============================================
  // ADMIN TEMPLATE MANAGEMENT ENDPOINTS
  // ============================================

  /**
   * Get all story templates (public endpoint)
   * @param activityType - Optional filter by activity type
   */
  getTemplates: async (activityType?: string): Promise<StoryResponse<StoryTemplate>> => {
    const response = await api.get('/stories/templates/', {
      params: activityType ? { activity_type: activityType } : undefined,
    });
    return response.data;
  },

  /**
   * Get a single template by ID (public endpoint)
   * @param templateId - The template UUID
   */
  getTemplateById: async (templateId: string): Promise<StoryTemplate> => {
    const response = await api.get(`/stories/templates/${templateId}/`);
    return response.data;
  },

  /**
   * Create a new story template (staff only)
   * @param payload - Template data including nested parts
   */
  createTemplate: async (payload: CreateTemplatePayload): Promise<StoryTemplate> => {
    // If there's a cover image, use FormData (multipart/form-data)
    // Otherwise, use JSON to properly handle nested template_parts
    if (payload.cover_image) {
      const formData = new FormData();

      formData.append('title', payload.title);
      formData.append('description', payload.description);
      formData.append('activity_type', payload.activity_type);
      formData.append('orientation', payload.orientation);
      formData.append('size', payload.size);
      formData.append('cover_image', payload.cover_image);

      if (payload.template_parts && payload.template_parts.length > 0) {
        formData.append('template_parts', JSON.stringify(payload.template_parts));
      }

      const response = await api.post('/stories/templates/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } else {
      // Send as JSON for proper nested serialization
      const jsonPayload = {
        title: payload.title,
        description: payload.description,
        activity_type: payload.activity_type,
        orientation: payload.orientation,
        size: payload.size,
        template_parts: payload.template_parts || [],
      };

      const response = await api.post('/stories/templates/', jsonPayload);
      return response.data;
    }
  },

  /**
   * Update an existing story template (staff only)
   * @param templateId - The template UUID
   * @param payload - Updated template data
   */
  updateTemplate: async (
    templateId: string,
    payload: UpdateTemplatePayload
  ): Promise<StoryTemplate> => {
    // For updates, we send JSON unless there's a cover image
    if (payload.cover_image) {
      const formData = new FormData();

      if (payload.title) formData.append('title', payload.title);
      if (payload.description) formData.append('description', payload.description);
      if (payload.activity_type) formData.append('activity_type', payload.activity_type);
      if (payload.orientation) formData.append('orientation', payload.orientation);
      if (payload.size) formData.append('size', payload.size);
      formData.append('cover_image', payload.cover_image);

      if (payload.template_parts) {
        formData.append('template_parts', JSON.stringify(payload.template_parts));
      }

      const response = await api.patch(`/stories/templates/${templateId}/`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } else {
      // JSON update
      const response = await api.patch(`/stories/templates/${templateId}/`, payload);
      return response.data;
    }
  },

  /**
   * Delete a story template (staff only)
   * @param templateId - The template UUID
   */
  deleteTemplate: async (templateId: string): Promise<void> => {
    await api.delete(`/stories/templates/${templateId}/`);
  },

  // ============================================
  // TEMPLATE PARTS MANAGEMENT
  // ============================================

  /**
   * List all template parts (staff only)
   * @param templateId - Optional filter by template UUID
   */
  getTemplateParts: async (templateId?: string): Promise<TemplatePart[]> => {
    const response = await api.get('/stories/template-parts/', {
      params: templateId ? { template: templateId } : undefined,
    });
    return response.data;
  },

  /**
   * Get a single template part by ID (staff only)
   * @param partId - The template part UUID
   */
  getTemplatePartById: async (partId: string): Promise<TemplatePart> => {
    const response = await api.get(`/stories/template-parts/${partId}/`);
    return response.data;
  },

  /**
   * Create a new template part (staff only)
   * @param payload - Template part data
   */
  createTemplatePart: async (
    payload: CreateTemplatePartStandalonePayload
  ): Promise<TemplatePart> => {
    const response = await api.post('/stories/template-parts/', payload);
    return response.data;
  },

  /**
   * Update a template part (staff only)
   * @param partId - The template part UUID
   * @param payload - Updated part data
   */
  updateTemplatePart: async (
    partId: string,
    payload: UpdateTemplatePartPayload
  ): Promise<TemplatePart> => {
    const response = await api.patch(`/stories/template-parts/${partId}/`, payload);
    return response.data;
  },

  /**
   * Delete a template part (staff only)
   * @param partId - The template part UUID
   */
  deleteTemplatePart: async (partId: string): Promise<void> => {
    await api.delete(`/stories/template-parts/${partId}/`);
  },
};