/* eslint-disable no-unused-vars */
import { Model } from 'sequelize/types'

export enum ContactRoles {
  VENDOR = 'VENDOR',
  PURCHASER = 'PURCHASER',
  FORWARDER = 'FORWARDER',
  LOGISTICS = 'LOGISTICS'
}

export interface ContactAttributes {
  id?: string;
  name: string;
  roles: ContactRoles[];
  remarks: string;
  vector?: string;
}

export interface ContactInstance
  extends Model<ContactAttributes>,
    ContactAttributes {
      createdAt?: Date;
      updatedAt?: Date;
    }
