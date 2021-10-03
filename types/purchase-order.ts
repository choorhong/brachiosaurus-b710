/* eslint-disable no-unused-vars */
import { Model } from 'sequelize/types'
import { UserInstance } from './user'

export enum STATUS {
    CREATED = 'CREATED',
    FULFILLED = 'FULFILLED',
    CANCELLED = 'CANCELLED'
  }

export interface PurchaseOrderAttributes {
  id?: string;
  purchaseOrderId: string;
  status: STATUS;
  users?: UserInstance[];
  remarks: string;
  vendorId?: string;
  vector?: string;
}

export interface PurchaseOrderInstance
  extends Model<PurchaseOrderAttributes>,
  PurchaseOrderAttributes {
      createdAt?: Date;
      updatedAt?: Date;
    }

export interface UserPurchaseOrderAttributes {
  id?: string;
  userId: string;
  purchaseOrderUUId: string; // not to be confused with purchaseOrderId
}

export interface UserPurchaseOrderInstance extends Model<UserPurchaseOrderAttributes>, UserPurchaseOrderAttributes {
  createdAt?: Date;
  updatedAt?: Date;
}
