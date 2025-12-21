// src/services/storyService.tsx
import api from './api';
import { StoryTemplate, StoryResponse, Story, StoryPart, Asset, AssetsResponse } from '@/types/story';

export const storyService = {
  getAllStories: async (): Promise<StoryResponse<StoryTemplate>> => {
    const response = await api.get('/stories/');
    return response.data;
  },

  getStoryById: async (id: string): Promise<Story> => {
    const response = await api.get(`/stories/${id}/`);
    return response.data;
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
};