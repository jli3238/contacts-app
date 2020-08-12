import { Name } from './Name';
import { Address } from '../types/Address';
import { Deal } from '../types/Deal';
import { ContactTag } from '../types/ContactTag';

export interface Contact {
  id: number;
  firstName: Name;
  lastName: Name;
  deals: Deal[];
  contactTags: ContactTag[];
  geoAddresses: Address;
}