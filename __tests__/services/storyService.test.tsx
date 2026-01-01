import { storyService } from '@/services/storyService'
import api from '@/services/api'

// Mock dependencies
jest.mock('@/services/api')

const mockApi = api as jest.Mocked<typeof api>

describe('storyService', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('getAllStories', () => {
    it('fetches all stories successfully', async () => {
      const mockResponse = {
        results: [
          {
            id: 'story-1',
            title: 'داستان من',
            status: 'completed',
          },
          {
            id: 'story-2',
            title: 'ماجراجویی',
            status: 'draft',
          },
        ],
        count: 2,
      }

      mockApi.get.mockResolvedValue({ data: mockResponse })

      const result = await storyService.getAllStories()

      expect(mockApi.get).toHaveBeenCalledWith('/stories/')
      expect(result).toEqual(mockResponse)
      expect(result.results).toHaveLength(2)
    })
  })

  describe('getStoryById', () => {
    it('fetches story by ID successfully', async () => {
      const mockStory = {
        id: 'story-uuid-123',
        name: 'داستان من',
        parts: [
          {
            id: 'part-1',
            canvas_text_data: {},
            canvas_illustration_data: {},
          },
        ],
      }

      mockApi.get.mockResolvedValue({ data: mockStory })

      const result = await storyService.getStoryById('story-uuid-123')

      expect(mockApi.get).toHaveBeenCalledWith('/stories/story-uuid-123/')
      expect(result).toEqual(mockStory)
    })

    it('throws error when story not found', async () => {
      mockApi.get.mockRejectedValue(new Error('Story not found'))

      await expect(storyService.getStoryById('invalid-id')).rejects.toThrow(
        'Story not found'
      )
    })
  })

  describe('createStory', () => {
    it('creates story with FormData', async () => {
      const mockStory = {
        id: 'new-story-1',
        title: 'داستان جدید',
      }

      mockApi.post.mockResolvedValue({ data: mockStory })

      const formData = new FormData()
      formData.append('title', 'داستان جدید')

      const result = await storyService.createStory(formData)

      expect(mockApi.post).toHaveBeenCalledWith('/stories/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      expect(result).toEqual(mockStory)
    })
  })

  describe('updateStory', () => {
    it('updates story successfully', async () => {
      const storyId = 'story-1'
      const updatedStory = {
        id: storyId,
        title: 'عنوان بروزرسانی شده',
      }

      mockApi.put.mockResolvedValue({ data: updatedStory })

      const formData = new FormData()
      formData.append('title', 'عنوان بروزرسانی شده')

      const result = await storyService.updateStory(storyId, formData)

      expect(mockApi.put).toHaveBeenCalledWith(`/stories/${storyId}/`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      expect(result).toEqual(updatedStory)
    })
  })

  describe('addStoryPart', () => {
    it('adds story part with only template ID', async () => {
      const mockPart = {
        id: 'part-new',
        story_part_template_id: 'template-1',
      }

      mockApi.post.mockResolvedValue({ data: mockPart })

      const result = await storyService.addStoryPart('story-1', 'template-1')

      expect(mockApi.post).toHaveBeenCalledWith('/stories/story-1/add_part/', {
        story_part_template_id: 'template-1',
      })
      expect(result).toEqual(mockPart)
    })

    it('adds story part with canvas data', async () => {
      const canvasText = { objects: [] }
      const canvasIllustration = { background: 'white' }

      mockApi.post.mockResolvedValue({ data: { id: 'part-1' } })

      await storyService.addStoryPart(
        'story-1',
        'template-1',
        canvasText,
        canvasIllustration
      )

      expect(mockApi.post).toHaveBeenCalledWith('/stories/story-1/add_part/', {
        story_part_template_id: 'template-1',
        canvas_text_data: canvasText,
        canvas_illustration_data: canvasIllustration,
      })
    })
  })

  describe('resetStoryPart', () => {
    it('resets both text and illustration by default', async () => {
      mockApi.post.mockResolvedValue({ data: { id: 'part-1' } })

      await storyService.resetStoryPart('part-1')

      expect(mockApi.post).toHaveBeenCalledWith('/stories/parts/part-1/reset/', {
        reset_text: true,
        reset_illustration: true,
      })
    })

    it('resets only text', async () => {
      mockApi.post.mockResolvedValue({ data: { id: 'part-1' } })

      await storyService.resetStoryPart('part-1', true, false)

      expect(mockApi.post).toHaveBeenCalledWith('/stories/parts/part-1/reset/', {
        reset_text: true,
        reset_illustration: false,
      })
    })

    it('resets only illustration', async () => {
      mockApi.post.mockResolvedValue({ data: { id: 'part-1' } })

      await storyService.resetStoryPart('part-1', false, true)

      expect(mockApi.post).toHaveBeenCalledWith('/stories/parts/part-1/reset/', {
        reset_text: false,
        reset_illustration: true,
      })
    })
  })

  describe('finishStory', () => {
    it('finishes story with title', async () => {
      const mockStory = {
        id: 'story-1',
        title: 'داستان تمام شده',
        status: 'completed',
      }

      mockApi.post.mockResolvedValue({ data: mockStory })

      const result = await storyService.finishStory('story-1', 'داستان تمام شده')

      expect(mockApi.post).toHaveBeenCalledWith('/stories/story-1/finish/', {
        title: 'داستان تمام شده',
      })
      expect(result).toEqual(mockStory)
    })
  })

  describe('getApiStories', () => {
    it('fetches stories with default pagination', async () => {
      mockApi.get.mockResolvedValue({ data: { results: [], count: 0 } })

      await storyService.getApiStories()

      expect(mockApi.get).toHaveBeenCalledWith('/stories/', {
        params: { page: 1, page_size: 12 },
      })
    })

    it('fetches stories with custom pagination', async () => {
      mockApi.get.mockResolvedValue({ data: { results: [], count: 0 } })

      await storyService.getApiStories(3, 20)

      expect(mockApi.get).toHaveBeenCalledWith('/stories/', {
        params: { page: 3, page_size: 20 },
      })
    })
  })

  describe('uploadImageForPart', () => {
    it('uploads image for story part', async () => {
      const mockResponse = {
        url: 'https://example.com/images/part-image.jpg',
      }

      mockApi.post.mockResolvedValue({ data: mockResponse })

      const formData = new FormData()
      formData.append('image', new File([''], 'test.jpg'))

      const result = await storyService.uploadImageForPart(formData)

      expect(mockApi.post).toHaveBeenCalledWith(
        '/stories/upload-part-image/',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      )
      expect(result).toEqual(mockResponse)
    })
  })

  describe('finalizeStory', () => {
    it('finalizes story with title', async () => {
      mockApi.post.mockResolvedValue({ data: { id: 'story-1', finalized: true } })

      await storyService.finalizeStory('story-1', 'عنوان نهایی')

      expect(mockApi.post).toHaveBeenCalledWith('/stories/story-1/finalize/', {
        title: 'عنوان نهایی',
      })
    })
  })

  describe('uploadStoryCoverImage', () => {
    it('uploads cover image for story', async () => {
      const mockStory = {
        id: 'story-1',
        cover_image: 'https://example.com/cover.jpg',
      }

      mockApi.post.mockResolvedValue({ data: mockStory })

      const imageFile = new File([''], 'cover.jpg', { type: 'image/jpeg' })

      const result = await storyService.uploadStoryCoverImage('story-1', imageFile)

      expect(mockApi.post).toHaveBeenCalled()
      const callArgs = mockApi.post.mock.calls[0]
      expect(callArgs[0]).toBe('/stories/story-1/upload_cover/')
      expect(callArgs[1]).toBeInstanceOf(FormData)
      expect(result).toEqual(mockStory)
    })
  })

  describe('setStoryConfig', () => {
    it('sets story configuration colors', async () => {
      const mockStory = {
        id: 'story-1',
        background_color: '#ffffff',
        font_color: '#000000',
      }

      mockApi.post.mockResolvedValue({ data: mockStory })

      const config = {
        background_color: '#ffffff',
        font_color: '#000000',
      }

      const result = await storyService.setStoryConfig('story-1', config)

      expect(mockApi.post).toHaveBeenCalledWith('/stories/story-1/set_config/', config)
      expect(result).toEqual(mockStory)
    })

    it('sets partial configuration', async () => {
      mockApi.post.mockResolvedValue({ data: { id: 'story-1' } })

      await storyService.setStoryConfig('story-1', {
        background_color: '#ff0000',
      })

      expect(mockApi.post).toHaveBeenCalledWith('/stories/story-1/set_config/', {
        background_color: '#ff0000',
      })
    })
  })

  describe('setCoverImageFromUrl', () => {
    it('sets cover image from URL', async () => {
      const mockStory = {
        id: 'story-1',
        cover_image: 'https://example.com/image.jpg',
      }

      mockApi.post.mockResolvedValue({ data: mockStory })

      const result = await storyService.setCoverImageFromUrl(
        'story-1',
        'https://example.com/image.jpg'
      )

      expect(mockApi.post).toHaveBeenCalledWith('/stories/story-1/set_cover_from_url/', {
        cover_image_url: 'https://example.com/image.jpg',
      })
      expect(result).toEqual(mockStory)
    })
  })

  describe('getCompletedStories', () => {
    it('fetches completed stories with default pagination', async () => {
      mockApi.get.mockResolvedValue({ data: { results: [], count: 0 } })

      await storyService.getCompletedStories()

      expect(mockApi.get).toHaveBeenCalledWith('/stories/completed/', {
        params: { page: 1, page_size: 12 },
      })
    })

    it('fetches completed stories with custom pagination', async () => {
      mockApi.get.mockResolvedValue({ data: { results: [], count: 0 } })

      await storyService.getCompletedStories(2, 24)

      expect(mockApi.get).toHaveBeenCalledWith('/stories/completed/', {
        params: { page: 2, page_size: 24 },
      })
    })
  })

  describe('updateStoryTitle', () => {
    it('updates story title successfully', async () => {
      const mockStory = {
        id: 'story-1',
        title: 'عنوان جدید',
      }

      mockApi.patch.mockResolvedValue({ data: mockStory })

      const result = await storyService.updateStoryTitle('story-1', 'عنوان جدید')

      expect(mockApi.patch).toHaveBeenCalledWith('/stories/story-1/title/', {
        title: 'عنوان جدید',
      })
      expect(result).toEqual(mockStory)
    })
  })

  describe('uploadAsset', () => {
    it('uploads asset successfully', async () => {
      const mockBackendResponse = {
        id: 'asset-1',
        file: 'https://example.com/assets/image.jpg',
        created_at: '2026-01-01T12:00:00Z',
      }

      mockApi.post.mockResolvedValue({ data: mockBackendResponse })

      const file = new File([''], 'test.jpg', { type: 'image/jpeg' })

      const result = await storyService.uploadAsset('user-1', file, 'My Asset')

      expect(mockApi.post).toHaveBeenCalled()
      const callArgs = mockApi.post.mock.calls[0]
      expect(callArgs[0]).toBe('/users/user-1/assets/')
      expect(callArgs[1]).toBeInstanceOf(FormData)

      expect(result).toEqual({
        id: 'asset-1',
        url: 'https://example.com/assets/image.jpg',
        name: 'My Asset',
        created_at: '2026-01-01T12:00:00Z',
        size: 0,
        mime_type: 'image/jpeg',
      })
    })

    it('uploads asset without name', async () => {
      mockApi.post.mockResolvedValue({
        data: {
          id: 'asset-2',
          file: 'https://example.com/assets/image2.jpg',
          created_at: '2026-01-01T12:00:00Z',
        },
      })

      const file = new File([''], 'test.jpg', { type: 'image/jpeg' })

      const result = await storyService.uploadAsset('user-1', file)

      expect(result.name).toBe('asset')
    })
  })

  describe('getUserAssets', () => {
    it('fetches user assets with default pagination', async () => {
      const mockResponse = {
        count: 5,
        results: [
          {
            id: 'asset-1',
            file: 'https://example.com/asset1.jpg',
            name: 'Asset 1',
            created_at: '2026-01-01',
            size: 1024,
            mime_type: 'image/jpeg',
          },
        ],
      }

      mockApi.get.mockResolvedValue({ data: mockResponse })

      const result = await storyService.getUserAssets('user-1')

      expect(mockApi.get).toHaveBeenCalledWith('/users/user-1/assets/', {
        params: { page: 1, limit: 50 },
      })

      expect(result.assets).toHaveLength(1)
      expect(result.assets[0].url).toBe('https://example.com/asset1.jpg')
      expect(result.pagination.total).toBe(5)
    })

    it('fetches user assets with custom pagination', async () => {
      mockApi.get.mockResolvedValue({
        data: {
          count: 100,
          results: [],
        },
      })

      await storyService.getUserAssets('user-1', 3, 25)

      expect(mockApi.get).toHaveBeenCalledWith('/users/user-1/assets/', {
        params: { page: 3, limit: 25 },
      })
    })

    it('maps backend file field to frontend url field', async () => {
      mockApi.get.mockResolvedValue({
        data: {
          count: 1,
          results: [
            {
              id: 'asset-1',
              file: 'https://example.com/backend-file.jpg',
              created_at: '2026-01-01',
            },
          ],
        },
      })

      const result = await storyService.getUserAssets('user-1')

      expect(result.assets[0].url).toBe('https://example.com/backend-file.jpg')
    })
  })

  describe('deleteAsset', () => {
    it('deletes asset successfully', async () => {
      mockApi.delete.mockResolvedValue({ data: {} })

      await storyService.deleteAsset('user-1', 'asset-1')

      expect(mockApi.delete).toHaveBeenCalledWith('/users/user-1/assets/asset-1/')
    })
  })

  describe('deleteStory', () => {
    it('deletes story successfully', async () => {
      mockApi.delete.mockResolvedValue({ data: {} })

      await storyService.deleteStory('story-1')

      expect(mockApi.delete).toHaveBeenCalledWith('/stories/story-1/')
    })
  })

  describe('getTemplates', () => {
    it('fetches all templates without filter', async () => {
      const mockResponse = {
        results: [
          { id: 'template-1', title: 'قالب ۱' },
          { id: 'template-2', title: 'قالب ۲' },
        ],
      }

      mockApi.get.mockResolvedValue({ data: mockResponse })

      const result = await storyService.getTemplates()

      expect(mockApi.get).toHaveBeenCalledWith('/stories/templates/', {
        params: undefined,
      })
      expect(result).toEqual(mockResponse)
    })

    it('fetches templates filtered by activity type', async () => {
      mockApi.get.mockResolvedValue({ data: { results: [] } })

      await storyService.getTemplates('drawing')

      expect(mockApi.get).toHaveBeenCalledWith('/stories/templates/', {
        params: { activity_type: 'drawing' },
      })
    })
  })

  describe('getTemplateById', () => {
    it('fetches template by ID', async () => {
      const mockTemplate = {
        id: 'template-1',
        title: 'قالب داستان',
        template_parts: [],
      }

      mockApi.get.mockResolvedValue({ data: mockTemplate })

      const result = await storyService.getTemplateById('template-1')

      expect(mockApi.get).toHaveBeenCalledWith('/stories/templates/template-1/')
      expect(result).toEqual(mockTemplate)
    })
  })

  describe('createTemplate', () => {
    it('creates template with cover image using FormData', async () => {
      const mockTemplate = {
        id: 'template-new',
        title: 'قالب جدید',
      }

      mockApi.post.mockResolvedValue({ data: mockTemplate })

      const payload = {
        title: 'قالب جدید',
        description: 'توضیحات',
        activity_type: 'storytelling',
        orientation: 'portrait',
        size: 'A4',
        cover_image: new File([''], 'cover.jpg'),
        template_parts: [],
      }

      const result = await storyService.createTemplate(payload)

      expect(mockApi.post).toHaveBeenCalled()
      const callArgs = mockApi.post.mock.calls[0]
      expect(callArgs[0]).toBe('/stories/templates/')
      expect(callArgs[1]).toBeInstanceOf(FormData)
      expect(result).toEqual(mockTemplate)
    })

    it('creates template without cover image using JSON', async () => {
      const mockTemplate = {
        id: 'template-new-2',
        title: 'قالب بدون تصویر',
      }

      mockApi.post.mockResolvedValue({ data: mockTemplate })

      const payload = {
        title: 'قالب بدون تصویر',
        description: 'توضیحات',
        activity_type: 'drawing',
        orientation: 'landscape',
        size: 'A5',
        template_parts: [
          {
            order: 1,
            canvas_text_template: {},
            canvas_illustration_template: {},
          },
        ],
      }

      const result = await storyService.createTemplate(payload)

      expect(mockApi.post).toHaveBeenCalledWith('/stories/templates/', {
        title: payload.title,
        description: payload.description,
        activity_type: payload.activity_type,
        orientation: payload.orientation,
        size: payload.size,
        template_parts: payload.template_parts,
      })
      expect(result).toEqual(mockTemplate)
    })
  })

  describe('uploadTemplateImage', () => {
    it('uploads template image with progress callback', async () => {
      const mockResponse = {
        id: 'image-1',
        url: 'https://example.com/template-image.jpg',
        part_index: 0,
        created_at: '2026-01-01T12:00:00Z',
      }

      mockApi.post.mockResolvedValue({ data: mockResponse })

      const imageFile = new File([''], 'template-image.jpg', { type: 'image/jpeg' })
      const progressCallback = jest.fn()

      const result = await storyService.uploadTemplateImage(
        'template-1',
        0,
        imageFile,
        progressCallback
      )

      expect(mockApi.post).toHaveBeenCalled()
      const callArgs = mockApi.post.mock.calls[0]
      expect(callArgs[0]).toBe('/stories/templates/template-1/upload_template_image/')
      expect(callArgs[1]).toBeInstanceOf(FormData)
      expect(callArgs[2]).toHaveProperty('onUploadProgress', progressCallback)
      expect(result).toEqual(mockResponse)
    })
  })

  describe('deleteTemplate', () => {
    it('deletes template successfully', async () => {
      mockApi.delete.mockResolvedValue({ data: {} })

      await storyService.deleteTemplate('template-1')

      expect(mockApi.delete).toHaveBeenCalledWith('/stories/templates/template-1/')
    })
  })
})
