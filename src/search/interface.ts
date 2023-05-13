import { PaginatedRequestItem, PaginatedResponseItem } from '../types';

export interface Post {
  id: number;
  name: string;
  image: string;
  description: string;
  dateLastEdited: string;
}

export interface SearchInterface {
  searchPosts(
    params: {
      query?: string;
      sortKey?: keyof Pick<Post, 'name' | 'dateLastEdited'>;
    } & PaginatedRequestItem
  ): Promise<{ posts: Post[] } & PaginatedResponseItem>;
}
