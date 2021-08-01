import { DataTypes } from 'sequelize'
import { sequelize } from './index'
import { VesselInstance } from '../../types/vessel'

const Vessel = sequelize.define<VesselInstance>(
  'vessels',
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
      type: DataTypes.STRING,
      allowNull: true
    },
    earliestReturningDate: {
      type: DataTypes.DATE,
      allowNull: false
    },
    cutOff: {
      type: DataTypes.DATE,
      allowNull: false
    },
    remarks: {
      type: DataTypes.STRING,
      allowNull: true
    },
    vector: {
      type: 'TSVECTOR',
      allowNull: true
    }
  }
)

export default Vessel
