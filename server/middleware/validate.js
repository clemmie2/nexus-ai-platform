const { z } = require('zod');

const botSchema = z.object({
  name: z.string().min(2).max(80),
  username: z.string().min(2).max(40),
  description: z.string().max(500).optional(),
  status: z.string().optional(),
  accentColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/).optional(),
  isPublic: z.boolean().optional()
});

const botPatchSchema = botSchema.partial();

module.exports = { botSchema, botPatchSchema };
