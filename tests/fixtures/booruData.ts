import type { Post, Pagination, BooruResponse, MediaAsset } from '~/types/booru'

export const mockMediaAsset: MediaAsset = {
  id: 1,
  created_at: '2024-01-01T00:00:00.000Z',
  updated_at: '2024-01-01T00:00:00.000Z',
  md5: 'abc123',
  file_ext: 'jpg',
  file_size: 100000,
  image_width: 800,
  image_height: 600,
  status: 'active',
  file_key: 'test-key',
  is_public: true,
  pixel_hash: 'hash123',
  variants: [
    {
      type: 'original',
      url: 'https://cdn.donmai.us/original/abc/123.jpg',
      width: 800,
      height: 600,
      file_ext: 'jpg',
    },
    {
      type: 'large',
      url: 'https://cdn.donmai.us/large/abc/123.jpg',
      width: 500,
      height: 375,
      file_ext: 'jpg',
    },
    {
      type: 'preview',
      url: 'https://cdn.donmai.us/preview/abc/123.jpg',
      width: 300,
      height: 225,
      file_ext: 'jpg',
    },
  ],
}

export const createMockPost = (overrides: Partial<Post> = {}): Post => ({
  id: 1,
  created_at: '2024-01-01T00:00:00.000Z',
  uploader_id: 1,
  score: 10,
  source: 'https://example.com/source',
  md5: 'abc123',
  last_comment_bumped_at: null,
  rating: 'g',
  image_width: 800,
  image_height: 600,
  tag_string: 'kijin_seija rating:g',
  fav_count: 5,
  file_ext: 'jpg',
  last_noted_at: null,
  parent_id: null,
  has_children: false,
  approver_id: null,
  tag_count_general: 1,
  tag_count_artist: 1,
  tag_count_character: 1,
  tag_count_copyright: 0,
  file_size: 100000,
  up_score: 10,
  down_score: 0,
  is_pending: false,
  is_flagged: false,
  is_deleted: false,
  tag_count: 3,
  updated_at: '2024-01-01T00:00:00.000Z',
  is_banned: false,
  pixiv_id: null,
  last_commented_at: null,
  has_active_children: false,
  bit_flags: 0,
  tag_count_meta: 0,
  has_large: true,
  has_visible_children: false,
  media_asset: mockMediaAsset,
  tag_string_general: 'solo',
  tag_string_character: 'kijin_seija',
  tag_string_copyright: 'touhou',
  tag_string_artist: 'artist_name',
  tag_string_meta: '',
  file_url: 'https://cdn.donmai.us/original/abc/123.jpg',
  large_file_url: 'https://cdn.donmai.us/large/abc/123.jpg',
  preview_file_url: 'https://cdn.donmai.us/preview/abc/123.jpg',
  ...overrides,
})

export const createMockPagination = (overrides: Partial<Pagination> = {}): Pagination => ({
  current_page: 1,
  total_pages: 10,
  total_posts: 200,
  posts_per_page: 20,
  ...overrides,
})

export const createMockBooruResponse = (
  postsCount: number = 20,
  paginationOverrides: Partial<Pagination> = {}
): BooruResponse => ({
  posts: Array.from({ length: postsCount }, (_, i) =>
    createMockPost({ id: i + 1 })
  ),
  pagination: createMockPagination(paginationOverrides),
})

export const createNSFWPost = (): Post =>
  createMockPost({
    id: 999,
    rating: 'e',
    tag_string: 'kijin_seija rating:e nsfw',
    tag_string_general: 'nsfw',
  })

export const createBlacklistedPost = (blacklistedTag: string): Post =>
  createMockPost({
    id: 888,
    tag_string_general: `solo ${blacklistedTag}`,
    tag_string: `kijin_seija ${blacklistedTag} rating:g`,
  })

export const createAnimatedPost = (): Post =>
  createMockPost({
    id: 777,
    file_ext: 'gif',
    media_asset: {
      ...mockMediaAsset,
      file_ext: 'gif',
    },
  })