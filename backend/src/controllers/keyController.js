// backend/src/controllers/keyController.js
const Key = require('../models/Key');
const Script = require('../models/Script');
const { Op } = require('sequelize');

const keyController = {
  async generateKeys(req, res) {
    try {
      const { 
        scriptId, 
        keyName, 
        prefix, 
        quantity, 
        duration, 
        format, 
        maxUses,
        hwidEnabled,
        maxHwid 
      } = req.body;
      
      // Validate script exists
      const script = await Script.findByPk(scriptId);
      if (!script) {
        return res.status(404).json({ error: 'Script not found' });
      }
      
      const keys = [];
      const expiresAt = calculateExpiration(duration);
      
      for (let i = 0; i < (quantity || 1); i++) {
        const keyValue = generateKey(format, prefix, keyName);
        const key = await Key.create({
          key: keyValue,
          scriptId,
          keyName: keyName || 'APEX-VIP',
          prefix: prefix || 'APEX_',
          expiresAt,
          maxUses: maxUses || 1,
          hwidEnabled: hwidEnabled || false,
          maxHwid: maxHwid || 1,
          createdBy: req.user?.userId || 'system'
        });
        keys.push(key);
      }
      
      res.json({
        success: true,
        message: `Successfully generated ${keys.length} keys`,
        count: keys.length,
        keys: keys.map(k => ({
          id: k.id,
          key: k.key,
          expiresAt: k.expiresAt
        }))
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
  
  async getKeys(req, res) {
    try {
      const { 
        status, 
        scriptId, 
        search, 
        page = 1, 
        limit = 20,
        sortBy = 'createdAt',
        sortOrder = 'DESC'
      } = req.query;
      
      const where = {};
      if (status) where.status = status;
      if (scriptId) where.scriptId = scriptId;
      if (search) {
        where.key = { [Op.like]: `%${search}%` };
      }
      
      const offset = (page - 1) * limit;
      const { count, rows } = await Key.findAndCountAll({
        where,
        order: [[sortBy, sortOrder]],
        offset,
        limit: parseInt(limit)
      });
      
      res.json({
        keys: rows,
        total: count,
        page: parseInt(page),
        totalPages: Math.ceil(count / limit)
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
  
  async revokeKey(req, res) {
    try {
      const { id } = req.params;
      const key = await Key.findByPk(id);
      
      if (!key) {
        return res.status(404).json({ error: 'Key not found' });
      }
      
      key.status = 'revoked';
      await key.save();
      
      res.json({ success: true, message: 'Key revoked successfully' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
  
  async bulkAction(req, res) {
    try {
      const { ids, action } = req.body;
      
      if (!Array.isArray(ids) || ids.length === 0) {
        return res.status(400).json({ error: 'No IDs provided' });
      }
      
      const validActions = ['revoke', 'delete', 'suspend'];
      if (!validActions.includes(action)) {
        return res.status(400).json({ error: 'Invalid action' });
      }
      
      if (action === 'delete') {
        await Key.destroy({ where: { id: ids } });
      } else {
        await Key.update(
          { status: action === 'revoke' ? 'revoked' : 'suspended' },
          { where: { id: ids } }
        );
      }
      
      res.json({ 
        success: true, 
        message: `Successfully performed ${action} on ${ids.length} keys` 
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
};

function generateKey(format, prefix, keyName) {
  const base = keyName || 'APEX-VIP';
  const random = Math.random().toString(36).substring(2, 10).toUpperCase();
  
  switch(format) {
    case 'APEX-XXXX-XXXX':
      return `${base}-${random.substring(0,4)}-${random.substring(4,8)}`;
    case 'APEX-XXXXXX':
      return `${base}-${random.substring(0,6)}`;
    case 'random_secure':
      return `${prefix || ''}${base}-${random}${Math.random().toString(36).substring(2,6)}`;
    default:
      return `${prefix || ''}${base}-${random}`;
  }
}

function calculateExpiration(duration) {
  const now = new Date();
  const durations = {
    '1h': 1 * 60 * 60 * 1000,
    '6h': 6 * 60 * 60 * 1000,
    '12h': 12 * 60 * 60 * 1000,
    '1d': 24 * 60 * 60 * 1000,
    '3d': 3 * 24 * 60 * 60 * 1000,
    '7d': 7 * 24 * 60 * 60 * 1000,
    '14d': 14 * 24 * 60 * 60 * 1000,
    '30d': 30 * 24 * 60 * 60 * 1000
  };
  
  return new Date(now.getTime() + (durations[duration] || durations['24h']));
}

module.exports = keyController;
