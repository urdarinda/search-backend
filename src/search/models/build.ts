import { Post } from '../interface';
import { PostDatabase } from './schema';
import { getTokensFromString } from './util';

const invertedIndex: Map<string, Set<number>> = new Map();

const buildIndex = () => {
  const posts = PostDatabase.get();
  posts.forEach((post) => addPostToIndex(post));
};

const addPostToIndex = (post: Post) => {
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

const getDocumentsForToken= async(token: string ) => invertedIndex.get(token) || new Set<number>();

export {
    buildIndex,
    getDocumentsForToken
}