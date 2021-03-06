/* eslint-disable no-unused-vars */
import { Model } from 'sequelize/types'
import { BookingInstance } from './booking'
import { ContactInstance } from './contact'
import { PurchaseOrderInstance } from './purchase-order'
import { UserInstance } from './user'

export enum ShipmentStatus {
  CREATED = 'CREATED',
  SCHEDULED = 'SCHEDULED',
  SHIPPED = 'SHIPPED',
  FULFILLED = 'FULFILLED',
  PAID = 'PAID',
  CANCELLED = 'CANCELLED'
}

export interface ShipmentAttributes {
  id?: string;
  purchaseOrderId?: string;
  purchaseOrder?: PurchaseOrderInstance;
  vendorId?: string;
  vendor?: ContactInstance;
  bookingId?: string;
  booking?: BookingInstance;
  status?: ShipmentStatus;
  users?: UserInstance[];
  remarks?: string;
  container?: string;
}

export interface ShipmentInstance
  extends Model<ShipmentAttributes>,
    ShipmentAttributes {
      createdAt?: Date;
      updatedAt?: Date;
    }

export interface UserShipmentAttributes {
  id?: string;
  userId: string;
  shipmentId: string;
}

export interface UserShipmentInstance extends Model<UserShipmentAttributes>, UserShipmentAttributes {
  createdAt?: Date;
  updatedAt?: Date;
}
