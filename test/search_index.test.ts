import * as SearchIndex from '../src/search/posts/search_index';
import { PostDatabase } from '../src/search/posts/schema';
import * as Mocks from './schema.mock';

beforeEach(() => {
  jest.resetAllMocks();
  jest.spyOn(PostDatabase, 'getPostByIds').mockImplementation((ids) => {
    if (!ids) return Mocks.mockPosts;
    return Mocks.mockPosts.filter((post) => ids.some((i) => i == post.id));
  });
});

describe('correct builds search index from existing posts', () => {
  it('given a set of posts in a databse correctly builds index for unigram tokens', () => {
    expect(SearchIndex.buildIndex()).toMatchSnapshot();
  });
});
