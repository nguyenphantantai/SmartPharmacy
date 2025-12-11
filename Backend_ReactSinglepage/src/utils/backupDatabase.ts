/**
 * Backup Script: Backup database before migration
 * 
 * This script creates a backup of important collections before running migration.
 * 
 * Usage:
 *   tsx src/utils/backupDatabase.ts
 *   tsx src/utils/backupDatabase.ts --output ./backups
 * 
 * Or with npm:
 *   npm run db:backup
 *   npm run db:backup -- --output ./backups
 * 
 * Options:
 *   --output: Output directory for backup files (default: ./backups)
 */

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { config } from '../config/index.js';
import { connectDB } from '../config/database.js';
import { Product, ProductBatch, Import, Order, OrderItem } from '../models/schema.js';

// Load environment variables
dotenv.config();

interface BackupStats {
  collections: string[];
  totalDocuments: number;
  backupFiles: string[];
  errors: number;
}

/**
 * Main backup function
 */
async function backupDatabase() {
  console.log('💾 Starting database backup...\n');

  // Parse command line arguments
  const args = process.argv.slice(2);
  const outputIndex = args.indexOf('--output');
  const outputDir = outputIndex !== -1 && args[outputIndex + 1] 
    ? args[outputIndex + 1] 
    : './backups';

  try {
    // Connect to database
    await connectDB();
    console.log('✅ Connected to MongoDB\n');

    // Create backup directory
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').split('T')[0] + '_' + 
                      new Date().toTimeString().split(' ')[0].replace(/:/g, '-');
    const backupPath = path.join(outputDir, `backup_${timestamp}`);
    
    if (!fs.existsSync(backupPath)) {
      fs.mkdirSync(backupPath, { recursive: true });
    }

    console.log(`📁 Backup directory: ${backupPath}\n`);

    const stats: BackupStats = {
      collections: [],
      totalDocuments: 0,
      backupFiles: [],
      errors: 0,
    };

    // Collections to backup (important ones)
    const collectionsToBackup = [
      { name: 'products', model: Product, description: 'Products' },
      { name: 'productbatches', model: ProductBatch, description: 'Product Batches' },
      { name: 'imports', model: Import, description: 'Imports' },
      { name: 'orders', model: Order, description: 'Orders' },
      { name: 'orderitems', model: OrderItem, description: 'Order Items' },
    ];

    console.log(`📦 Backing up ${collectionsToBackup.length} collections...\n`);

    // Backup each collection
    for (const { name, model, description } of collectionsToBackup) {
      try {
        console.log(`📄 Backing up ${description}...`);
        
        const documents = await model.find({}).lean();
        const count = documents.length;
        
        if (count === 0) {
          console.log(`   ⚠️  No documents found, skipping...\n`);
          continue;
        }

        // Write to JSON file
        const fileName = `${name}_${timestamp}.json`;
        const filePath = path.join(backupPath, fileName);
        
        fs.writeFileSync(
          filePath,
          JSON.stringify(documents, null, 2),
          'utf-8'
        );

        // Also create a compact version (single line per document for large collections)
        const compactFileName = `${name}_${timestamp}_compact.json`;
        const compactFilePath = path.join(backupPath, compactFileName);
        fs.writeFileSync(
          compactFilePath,
          JSON.stringify(documents),
          'utf-8'
        );

        stats.collections.push(name);
        stats.totalDocuments += count;
        stats.backupFiles.push(fileName);
        stats.backupFiles.push(compactFileName);

        const fileSize = (fs.statSync(filePath).size / 1024).toFixed(2);
        console.log(`   ✅ Backed up ${count} documents (${fileSize} KB)\n`);

      } catch (error: any) {
        stats.errors++;
        console.error(`   ❌ Error backing up ${description}:`, error.message);
        console.log('');
      }
    }

    // Create backup info file
    const infoFile = path.join(backupPath, `backup_info_${timestamp}.json`);
    const backupInfo = {
      timestamp: new Date().toISOString(),
      collections: stats.collections,
      totalDocuments: stats.totalDocuments,
      files: stats.backupFiles,
      errors: stats.errors,
      mongodbUri: config.mongodbUri.replace(/\/\/.*@/, '//***:***@'), // Hide credentials
    };

    fs.writeFileSync(
      infoFile,
      JSON.stringify(backupInfo, null, 2),
      'utf-8'
    );

    // Final statistics
    console.log(`📊 Backup Complete!`);
    console.log(`   Collections backed up: ${stats.collections.length}`);
    console.log(`   Total documents: ${stats.totalDocuments}`);
    console.log(`   Backup files: ${stats.backupFiles.length}`);
    console.log(`   Errors: ${stats.errors}`);
    console.log(`   Location: ${backupPath}\n`);

    // Create README file with restore instructions
    const readmeFile = path.join(backupPath, 'README.md');
    const readmeContent = `# Database Backup

**Backup Date:** ${new Date().toISOString()}

## Collections Backed Up

${stats.collections.map(c => `- ${c}`).join('\n')}

## Total Documents

${stats.totalDocuments} documents

## Restore Instructions

To restore from this backup, use the restore script:

\`\`\`bash
npm run db:restore -- --input ${backupPath}
\`\`\`

Or manually restore using MongoDB:

\`\`\`bash
# For each collection file:
mongoimport --uri="your-mongodb-uri" --collection=products --file=products_${timestamp}.json --jsonArray
\`\`\`

## Files

${stats.backupFiles.map(f => `- ${f}`).join('\n')}

## Notes

- This backup was created before running batch system migration
- Compact files are single-line JSON (faster to import)
- Regular files are formatted JSON (easier to read)
`;

    fs.writeFileSync(readmeFile, readmeContent, 'utf-8');
    console.log(`📝 Created README.md with restore instructions\n`);

    console.log('✅ Backup completed successfully!\n');
    await mongoose.connection.close();
    process.exit(0);

  } catch (error) {
    console.error('❌ Backup failed:', error);
    await mongoose.connection.close();
    process.exit(1);
  }
}

// Run backup if script is executed directly
if (require.main === module) {
  backupDatabase();
}

export { backupDatabase };

