import { Address } from '../types/Address';
import { Deal } from '../types/Deal';
import { ContactTag } from '../types/ContactTag';

export interface Contact {
  id: number;
  firstName: string;
  lastName: string;
  deals?: Deal[];
  contactTags?: ContactTag[];
  geoAddresses?: Address;
}