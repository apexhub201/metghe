// backend/src/models/Link.js
const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Link = sequelize.define('Link', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  linkName: DataTypes.STRING,
  destinationUrl: DataTypes.STRING,
  shortenerUrl: DataTypes.STRING,
  loadstringUrl: DataTypes.STRING,
  scriptId: DataTypes.UUID,
  status: {
    type: DataTypes.ENUM('active', 'disabled', 'expired'),
    defaultValue: 'active'
  },
  clicks: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  keysGenerated: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  lastUsed: DataTypes.DATE,
  createdAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
});

module.exports = Link;
