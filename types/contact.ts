/* eslint-disable no-unused-vars */

export enum ContactRoles {
  VENDOR = 'VENDOR',
  PURCHASER = 'PURCHASER',
  FORWARDER = 'FORWARDER',
  LOGISTICS = 'LOGISTICS'
}

export interface ContactAttributes {
  id: string;
  companyName: string;
  roles: ContactRoles[];
  remarks: string;
}
