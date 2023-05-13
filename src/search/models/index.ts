import { Post, SearchInterface } from '../interface';
import { getDocumentsForToken } from './build';
import { PostDatabase } from './schema';
import { getTokensFromString } from './util';

const searchPost: SearchInterface['searchPosts'] = async (params) => {
  const { numberOfItems = 10, page = 0, query = undefined, sortKey = 'name' } = params;

  let allPosts: Post[];

  if (!query) allPosts = PostDatabase.get();
  else if (query.startsWith('"') && query.endsWith('"'))
    allPosts = await getExactMatchingDocuments({
      numberOfItems,
      page,
      query: query.slice(1, query.length - 1),
      sortKey,
    });
  else allPosts = await getMatchingDocuments({ numberOfItems, page, query, sortKey });
  allPosts = allPosts.sort((a, b) => a[sortKey].localeCompare(b[sortKey]));
  const requiredPosts = allPosts.slice(page * numberOfItems, page * numberOfItems + numberOfItems);
  return {
    numberOfItems: requiredPosts.length,
    page,
    posts: requiredPosts,
    total: allPosts.length,
  };
};

const getExactMatchingDocuments = async (params) => {
  const { numberOfItems, page, query, sortKey } = params;
  const allPosts = await getMatchingDocuments({ numberOfItems, page, query, sortKey });
  const normalizedQuery = query
    .toLowerCase()
    .replace(/[.,;:]/g, '')
    .trim();
  return allPosts.filter((post) => post.name.includes(normalizedQuery) || post.description.includes(normalizedQuery));
};

const getMatchingDocuments = async (params) => {
  const { numberOfItems, page, query, sortKey } = params;
  const tokens = getTokensFromString(query);

  const matchingDocumentMap = await Promise.all(tokens.map((token) => getDocumentsForToken(token)));

  const matchingDocuments = matchingDocumentMap.reduce((a, b) => {
    return new Set([...a].filter((x) => b.has(x)));
  }, matchingDocumentMap[0]);

  return PostDatabase.get([...matchingDocuments]);
};

export default { searchPost };
