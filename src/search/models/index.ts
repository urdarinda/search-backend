import { Post, SearchInterface } from '../interface';
import { PostDatabase } from './schema';

const invertedIndex: Map<string, Set<number>> = new Map();

const searchPost: SearchInterface['searchPosts'] = (params) => {
  const { numberOfItems = 10, page = 0, query = undefined, sortKey } = params;

  return items;
};

const buildIndex = () => {
  const posts = PostDatabase.get();
  posts.forEach((post) => addPostToIndex(post));
  console.log(invertedIndex)
};

const addPostToIndex = (post: Post) => {
  const getTokensFromString = (s: string) => s.toLowerCase().trim().split(' ');
  const titleTokens = getTokensFromString(post.name);
  const descriptionTokens = getTokensFromString(post.description);

  const addTokensToIndex = (tokens: string[]) => {
    tokens.forEach((token) => {
      const documentIndexes = invertedIndex.get(token) ?? new Set<number>();
      documentIndexes.add(post.id);
      invertedIndex.set(token, documentIndexes);
    });
  };
  addTokensToIndex(titleTokens);
  addTokensToIndex(descriptionTokens);
};

export {
    buildIndex
}