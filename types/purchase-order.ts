/* eslint-disable no-unused-vars */
import { Model } from 'sequelize/types'

export enum STATUS {
    CREATED = 'CREATED',
    FULFILLED = 'FULFILLED',
    CANCELLED = 'CANCELLED'
  }

export interface PurchaseOrderAttributes {
  id?: string;
  purchaseOrderId: string;
  status: STATUS;
  users?: string[];
  remarks: string;
  vendorId?: string;
}

export interface PurchaseOrderInstance
  extends Model<PurchaseOrderAttributes>,
  PurchaseOrderAttributes {
      createdAt?: Date;
      updatedAt?: Date;
    }
