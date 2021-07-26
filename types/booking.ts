/* eslint-disable no-unused-vars */
import { Model } from 'sequelize/types'
import { ContactInstance } from './contact';
import { VesselInstance } from './vessel';

export interface BookingAttributes {
  id: string;
  bookingId: string;
  forwarderId?: string;
  forwarder?: ContactInstance;
  departureETD: Date;
  departureLocation: string;
  arrivalETA: Date;
  arrivalLocation: string;
  vesselId?: string;
  vessel?: VesselInstance;
  users: string[];
  slots: string; // what is this?
  remarks: string;
}

export interface BookingInstance
  extends Model<BookingAttributes>,
    BookingAttributes {
      createdAt?: Date;
      updatedAt?: Date;
    }
