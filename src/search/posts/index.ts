import { DEFAULT_PAGE_SIZE } from '../constants';
import { Post, SearchInterface } from '../interface';
import * as SearchIndex from './search_index';
import { PostDatabase } from './schema';
import { getTokensFromString } from '../util';

const searchPost: SearchInterface['searchPosts'] = async (params) => {
  const { pageSize = DEFAULT_PAGE_SIZE, page = 0, query = undefined, sortKey = 'name' } = params;

  let allPosts: Post[];

  if (!query) allPosts = PostDatabase.getPostByIds();
  else if (query.startsWith('"') && query.endsWith('"'))
    allPosts = await getExactMatchingDocuments({
      pageSize,
      page,
      query: query.slice(1, query.length - 1),
      sortKey,
    });
  else allPosts = await getMatchingDocuments({ pageSize, page, query, sortKey });
  allPosts = allPosts.sort((a, b) => a[sortKey].localeCompare(b[sortKey]));
  const requiredPosts = allPosts.slice(page * pageSize, page * pageSize + pageSize);
  return {
    pageSize: requiredPosts.length,
    page,
    posts: requiredPosts,
    total: allPosts.length,
  };
};

const getExactMatchingDocuments = async (params) => {
  const { pageSize, page, query, sortKey } = params;
  const allPosts = await getMatchingDocuments({ pageSize, page, query, sortKey });
  const getNormalizedString = (word) =>
    word
      .toLowerCase()
      .replace(/[.,;:]/g, '')
      .trim();
  const normalizedQuery = getNormalizedString(query);
  return allPosts.filter(
    (post) =>
      getNormalizedString(post.name).includes(normalizedQuery) ||
      getNormalizedString(post.description).includes(normalizedQuery)
  );
};

const getMatchingDocuments = async (params) => {
  const { pageSize, page, query, sortKey } = params;
  const tokens = getTokensFromString(query);

  const matchingDocumentMap = await Promise.all(tokens.map((token) => SearchIndex.getDocumentsForToken(token)));

  const matchingDocuments = matchingDocumentMap.reduce((a, b) => {
    return new Set([...a].filter((x) => b.has(x)));
  }, matchingDocumentMap[0]);

  return PostDatabase.getPostByIds([...matchingDocuments]);
};

export default { searchPost };
