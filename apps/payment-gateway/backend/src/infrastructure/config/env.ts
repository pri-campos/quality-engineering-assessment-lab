import 'dotenv/config';
import { z } from 'zod';

const envSchema = z.object({
  PORT: z.coerce.number().default(3333),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  JWT_SECRET: z.string(),

  QA_USER_EMAIL: z.string().default('user@qa.com'),
  QA_USER_PASSWORD: z.string().default('senha123'),
  QA_USER_SUB: z.string().default('user_123'),
  
  QA_ADMIN_EMAIL: z.string().default('admin@qa.com'),
  QA_ADMIN_PASSWORD: z.string().default('admin123'),
  QA_ADMIN_SUB: z.string().default('admin_999'),
  
  VULN_IDOR: z.preprocess((val) => val === 'true', z.boolean().default(false)),
  VULN_BFLA: z.preprocess((val) => val === 'true', z.boolean().default(false)),
  VULN_BOPLA_WRITE: z.preprocess((val) => val === 'true', z.boolean().default(false)),
  VULN_DATA_EXPOSURE: z.preprocess((val) => val === 'true', z.boolean().default(false)),
  VULN_IMPROPER_INVENTORY: z.preprocess((val) => val === 'true', z.boolean().default(false)),
  VULN_BROKEN_AUTH: z.preprocess((val) => val === 'true', z.boolean().default(false)),
  VULN_SECURITY_MISCONFIG: z.preprocess((val) => val === 'true', z.boolean().default(false)),
  VULN_UNRESTRICTED_RESOURCE_CONSUMPTION: z.preprocess((val) => val === 'true', z.boolean().default(false)),
  VULN_SQL_INJECTION: z.preprocess((val) => val === 'true', z.boolean().default(false)),
  VULN_BUSINESS_LOGIC_DOUBLE_REFUND: z.preprocess((val) => val === 'true', z.boolean().default(false)),
});

export const env = envSchema.parse(process.env);
