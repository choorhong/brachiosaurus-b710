/* eslint-disable no-unused-vars */
import { Model } from 'sequelize/types'

export enum ROLES {
  ADMIN = 'ADMIN',
  SUPER_ADMIN = 'SUPER_ADMIN',
  EXECUTIVE = 'EXECUTIVE'
}

export enum STATUS {
  PENDING = 'PENDING',
  ACTIVE = 'ACTIVE',
  SUSPENDED = 'SUSPENDED'
}

export interface UserAttributes {
  id: string;
  email: string;
  name?: string;
  status: STATUS;
  role: ROLES;
  firebaseUserId: string;
}

export interface UserInstance
  extends Model<UserAttributes>,
    UserAttributes {
      createdAt?: Date;
      updatedAt?: Date;
    }
