import { SearchAPI } from '../src/search/index';
import * as SearchIndex from '../src/search/models/build';
import { buildIndex } from '../src/search/models/build';
import { PostDatabase } from '../src/search/models/schema';
import * as Mocks from './schema.mock';

beforeEach(() => {
  jest.resetAllMocks();
  jest.spyOn(PostDatabase, 'getPostByIds').mockImplementation((ids) => {
    if (!ids) return Mocks.mockPosts;
    return Mocks.mockPosts.filter((post) => ids.some((i) => i == post.id));
  });
  buildIndex();
});

describe('test for search post api', () => {
  it('given a search query returns pagination params', async () => {
    expect(await SearchAPI.searchPost({})).toMatchObject({
      page: expect.any(Number),
      pageSize: expect.any(Number),
      total: expect.any(Number),
    });
  });

  it('given no search query or page params returns all posts', async () => {
    expect(await SearchAPI.searchPost({})).toEqual({
      page: 0,
      pageSize: 3,
      posts: Mocks.mockPosts,
      total: 3,
    });
  });

  it('given no search query or page params returns all posts', async () => {
    expect(await SearchAPI.searchPost({})).toEqual({
      page: 0,
      pageSize: 3,
      posts: Mocks.mockPosts,
      total: 3,
    });
  });

  it('given a non exact query and no page params returns all matching posts with keywords', async () => {
    expect(await SearchAPI.searchPost({ query: 'king' })).toEqual({
      page: 0,
      pageSize: 2,
      total: 2,
      posts: Mocks.mockNonExactQueryPosts,
    });
  });

  it('given a non exact query and some page params returns all matching posts with keywords', async () => {
    jest.spyOn(SearchIndex, 'getDocumentsForToken').mockImplementation(() => Promise.resolve(new Set([2, 3])));
    expect(await SearchAPI.searchPost({ query: 'king', page: 1, pageSize: 1 })).toEqual({
      page: 1,
      pageSize: 1,
      total: 2,
      posts: [Mocks.mockNonExactQueryPosts[1]],
    });
  });

  it('given a non existent keyword return no posts', async () => {
    jest.spyOn(SearchIndex, 'getDocumentsForToken').mockImplementation(() => Promise.resolve(new Set()));
    // this token exists but we are mocking as if it didnt
    expect(await SearchAPI.searchPost({ query: 'king' })).toEqual({
      page: 0,
      pageSize: 0,
      total: 0,
      posts: [],
    });
  });

  it('given a exact query keyword returns all matching posts with phrase', async () => {
    jest.spyOn(SearchIndex, 'getDocumentsForToken').mockImplementation(() => Promise.resolve(new Set([1, 2, 3])));
    expect(await SearchAPI.searchPost({ query: '"lion king"' })).toEqual({
      page: 0,
      pageSize: 1,
      total: 1,
      posts: Mocks.mockPhraseMatchingPost,
    });
  });
});
