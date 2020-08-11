import { Name } from './Name';
import { ContactLists } from './ContactLists';
import { Tag } from './Tag';

export interface Contact {
  id: number;
  name: Name;
  contactLists: ContactLists;
  contactTag: Tag[];
  deals: number[];
}