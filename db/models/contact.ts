import { DataTypes } from 'sequelize'
import { sequelize } from './index'
import { ContactInstance } from '../../types/contact'

const Contact = sequelize.define<ContactInstance>(
  'contacts',
  {
    id: {
      allowNull: false,
      autoIncrement: false,
      primaryKey: true,
      type: DataTypes.UUID,
      unique: true,
      defaultValue: DataTypes.UUIDV4
    },
    name: {
      allowNull: false,
      type: DataTypes.STRING
    },
    roles: {
      allowNull: false,
      type: DataTypes.ARRAY(DataTypes.STRING)
    },
    remarks: {
      allowNull: true,
      type: DataTypes.STRING
    },
    vector: {
      type: 'TSVECTOR',
      allowNull: true
    }
  }
)

export default Contact
