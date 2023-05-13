import { DEFAULT_PAGE_SIZE, MAX_PAGE_SIZE } from './constants';
import { SearchInterface } from './interface';
import SearchPostAPI from './models';

const searchPost: SearchInterface['searchPosts'] = async (params) => {
  const { pageSize = DEFAULT_PAGE_SIZE, page = 0, query = undefined, sortKey = 'name' } = params;
  return await SearchPostAPI.searchPost({
    pageSize: Math.min(Number(pageSize), MAX_PAGE_SIZE),
    page: Number(page),
    query,
    sortKey,
  });
};

export const SearchAPI = {
  searchPost,
};
