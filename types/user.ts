import { Model, Optional } from 'sequelize/types'

export interface UserAttributes {
  id: string;
  email: string;
  name: number;
  status: string;
  role: string;
  firebaseUserId: string;
}

// id is optional at the moment
export interface UserCreationAttributes extends Optional<UserAttributes, 'id'> {}

export interface UserInstance
  extends Model<UserAttributes, UserCreationAttributes>,
    UserAttributes {
      createdAt?: Date;
      updatedAt?: Date;
    }
