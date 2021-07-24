import { Model } from 'sequelize/types'

export interface UserAttributes {
  id: string;
  email: string;
  name: string;
  status?: string;
  role: string;
  firebaseUserId: string;
}

export interface UserInstance
  extends Model<UserAttributes>,
    UserAttributes {
      createdAt?: Date;
      updatedAt?: Date;
    }
