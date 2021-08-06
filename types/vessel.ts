/* eslint-disable no-unused-vars */
import { Model } from 'sequelize/types'

export interface VesselAttributes {
  id?: string;
  name: string;
  earliestReturningDate: Date;
  cutOff: Date;
  remarks: string;
  vector?: string;
}

export interface VesselInstance
  extends Model<VesselAttributes>,
    VesselAttributes {
      createdAt?: Date;
      updatedAt?: Date;
    }
