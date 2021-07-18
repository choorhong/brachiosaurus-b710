import { DataTypes, Model, Optional } from 'sequelize'
import { sequelize } from '.'
import { UserAttributes } from '../../types/user'

// id is optional at the moment
interface UserCreationAttributes
  extends Optional<UserAttributes, 'id'> {}

interface UserInstance
  extends Model<UserAttributes, UserCreationAttributes>,
    UserAttributes {
      createdAt?: Date;
      updatedAt?: Date;
    }

const User = sequelize.define<UserInstance>(
  'User',
  {
    id: {
      allowNull: false,
      autoIncrement: false, // set to true if we are not generating uuid
      primaryKey: true,
      type: DataTypes.UUID,
      unique: true
    },
    email: {
      allowNull: false,
      type: DataTypes.TEXT
    },
    name: {
      allowNull: false,
      type: DataTypes.INTEGER
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
