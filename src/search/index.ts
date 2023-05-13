import { SearchInterface } from './interface';
import SearchPostAPI from './models';

const searchPost: SearchInterface['searchPosts'] = async (params) => {
  const { numberOfItems = 10, page = 0, query = undefined, sortKey = 'name' } = params;
  return await SearchPostAPI.searchPost({
    numberOfItems: Number(numberOfItems),
    page: Number(page),
    query,
    sortKey,
  });
};

export const SearchAPI = {
  searchPost,
};
