/* eslint-disable no-unused-vars */
import { Model } from 'sequelize/types'
import { ContactInstance } from './contact'
import { VesselInstance } from './vessel'

interface DateLocation {
  date: Date;
  location: string;
}

export interface BookingAttributes {
  id: string;
  bookingId: string;
  forwarderId?: string;
  forwarder?: ContactInstance;
  departure: DateLocation;
  arrival: DateLocation;
  departureETD?: Date; // TBD
  departureLocation?: string; // TBD
  arrivalETA?: Date; // TDB
  arrivalLocation?: string; // TDB
  vesselId?: string;
  vessel?: VesselInstance;
  users?: string[];
  slots: number;
  remarks: string;
}

export interface BookingInstance
  extends Model<BookingAttributes>,
    BookingAttributes {
      createdAt?: Date;
      updatedAt?: Date;
    }
