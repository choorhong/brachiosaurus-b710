import { DataTypes } from 'sequelize'
import { sequelize } from './index'
import { UserInstance } from '../../types/user'

const User = sequelize.define<UserInstance>(
  'users',
  {
    id: {
      allowNull: false,
      autoIncrement: false,
      primaryKey: true,
      type: DataTypes.UUID,
      unique: true
    },
    email: {
      allowNull: false,
      type: DataTypes.STRING
    },
    name: {
      allowNull: false,
      type: DataTypes.STRING
    },
    status: {
      allowNull: true,
      type: DataTypes.UUID
    },
    role: {
      allowNull: false,
      defaultValue: 'EXECUTIVE',
      type: DataTypes.STRING
    },
    firebaseUserId: {
      allowNull: true,
      type: DataTypes.STRING
    }
  }
)

export default User
