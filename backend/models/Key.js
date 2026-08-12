// backend/src/models/Key.js
const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Key = sequelize.define('Key', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  key: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false
  },
  scriptId: {
    type: DataTypes.UUID,
    allowNull: false
  },
  keyName: DataTypes.STRING,
  prefix: DataTypes.STRING,
  status: {
    type: DataTypes.ENUM('active', 'expired', 'revoked', 'suspended'),
    defaultValue: 'active'
  },
  createdAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  expiresAt: DataTypes.DATE,
  maxUses: {
    type: DataTypes.INTEGER,
    defaultValue: 1
  },
  usedCount: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  hwid: DataTypes.STRING,
  hwidEnabled: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  maxHwid: {
    type: DataTypes.INTEGER,
    defaultValue: 1
  },
  lastUsedAt: DataTypes.DATE,
  createdBy: DataTypes.STRING
});

module.exports = Key;
