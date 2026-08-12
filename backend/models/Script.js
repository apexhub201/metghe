// backend/src/models/Script.js
const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Script = sequelize.define('Script', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  scriptId: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false
  },
  description: DataTypes.TEXT,
  version: {
    type: DataTypes.STRING,
    defaultValue: 'V1'
  },
  status: {
    type: DataTypes.ENUM('active', 'disabled', 'maintenance'),
    defaultValue: 'active'
  },
  rawScriptUrl: DataTypes.STRING,
  loadstringUrl: DataTypes.STRING,
  createdBy: DataTypes.STRING
});

module.exports = Script;
