/**
 * Rollback Script: Revert batch system migration
 * 
 * This script removes batch records created by the migration script,
 * allowing you to rollback to the previous system if needed.
 * 
 * Usage:
 *   tsx src/utils/rollbackBatchMigration.ts
 *   tsx src/utils/rollbackBatchMigration.ts --keep-stock
 *   tsx src/utils/rollbackBatchMigration.ts --delete-import
 * 
 * Or with npm:
 *   npm run db:rollback:batches
 *   npm run db:rollback:batches -- --keep-stock
 *   npm run db:rollback:batches -- --delete-import
 * 
 * Options:
 *   --keep-stock: Keep Product.stockQuantity unchanged (default: restore from batches)
 *   --delete-import: Also delete the legacy import record
 */

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { config } from '../config/index.js';
import { connectDB } from '../config/database.js';
import { Product, ProductBatch, Import } from '../models/schema.js';

// Load environment variables
dotenv.config();

interface RollbackStats {
  totalBatches: number;
  batchesDeleted: number;
  productsUpdated: number;
  importDeleted: boolean;
  errors: number;
}

/**
 * Main rollback function
 */
async function rollbackBatchMigration() {
  console.log('🔄 Starting rollback of batch system migration...\n');

  // Parse command line arguments
  const args = process.argv.slice(2);
  const keepStock = args.includes('--keep-stock');
  const deleteImport = args.includes('--delete-import');

  if (keepStock) {
    console.log('ℹ️  Mode: Keep stock quantities unchanged\n');
  } else {
    console.log('ℹ️  Mode: Restore stock quantities from batches before deletion\n');
  }

  if (deleteImport) {
    console.log('ℹ️  Will also delete legacy import record\n');
  }

  try {
    // Connect to database
    await connectDB();
    console.log('✅ Connected to MongoDB\n');

    const stats: RollbackStats = {
      totalBatches: 0,
      batchesDeleted: 0,
      productsUpdated: 0,
      importDeleted: false,
      errors: 0,
    };

    // Find all legacy batches (created by migration)
    const legacyImportNumber = `LEGACY-MIGRATION-${new Date().toISOString().split('T')[0]}`;
    
    // Find batches with legacy import number pattern
    const legacyBatches = await ProductBatch.find({
      importNumber: { $regex: /^LEGACY-MIGRATION-/ }
    }).populate('productId');

    stats.totalBatches = legacyBatches.length;
    console.log(`📦 Found ${stats.totalBatches} legacy batch records to rollback\n`);

    if (legacyBatches.length === 0) {
      console.log('✅ No legacy batches found. Nothing to rollback.\n');
      await mongoose.connection.close();
      process.exit(0);
    }

    // Group batches by product
    const batchesByProduct = new Map<string, typeof legacyBatches>();
    for (const batch of legacyBatches) {
      const productId = String(batch.productId);
      if (!batchesByProduct.has(productId)) {
        batchesByProduct.set(productId, []);
      }
      batchesByProduct.get(productId)!.push(batch);
    }

    console.log(`📊 Found ${batchesByProduct.size} products with legacy batches\n`);

    // Confirm before proceeding
    console.log(`⚠️  About to delete ${stats.totalBatches} batch records.`);
    if (!keepStock) {
      console.log(`   Stock quantities will be restored from batches before deletion.`);
    }
    if (deleteImport) {
      console.log(`   Legacy import record will also be deleted.`);
    }
    console.log('');

    // Process each product
    const processedProducts = new Set<string>();

    for (const [productId, batches] of batchesByProduct.entries()) {
      try {
        const product = await Product.findById(productId);
        if (!product) {
          console.warn(`⚠️  Product ${productId} not found, skipping batches...`);
          continue;
        }

        // Calculate total stock from legacy batches
        const totalLegacyStock = batches.reduce((sum, b) => sum + b.remainingQuantity, 0);

        // Delete batches
        for (const batch of batches) {
          await ProductBatch.findByIdAndDelete(batch._id);
          stats.batchesDeleted++;
          console.log(`🗑️  Deleted batch "${batch.batchNumber}" for product "${product.name}"`);
        }

        // Update product stock if not keeping it
        if (!keepStock) {
          // Calculate current stock from remaining batches (non-legacy)
          const remainingBatches = await ProductBatch.find({
            productId: product._id,
            importNumber: { $not: { $regex: /^LEGACY-MIGRATION-/ } }
          });

          const remainingStock = remainingBatches.reduce((sum, b) => sum + b.remainingQuantity, 0);
          const newStock = remainingStock + totalLegacyStock;

          await Product.findByIdAndUpdate(productId, {
            stockQuantity: newStock,
            inStock: newStock > 0,
          });

          stats.productsUpdated++;
          console.log(`✅ Updated product "${product.name}": stock = ${newStock} ${product.unit || 'units'}`);
        } else {
          // Just update inStock flag based on remaining batches
          const remainingBatches = await ProductBatch.find({
            productId: product._id,
            importNumber: { $not: { $regex: /^LEGACY-MIGRATION-/ } }
          });

          const remainingStock = remainingBatches.reduce((sum, b) => sum + b.remainingQuantity, 0);
          
          await Product.findByIdAndUpdate(productId, {
            inStock: remainingStock > 0,
          });

          stats.productsUpdated++;
          console.log(`✅ Updated product "${product.name}": inStock = ${remainingStock > 0}`);
        }

        processedProducts.add(productId);

      } catch (error: any) {
        stats.errors++;
        console.error(`❌ Error processing product ${productId}:`, error.message);
      }
    }

    // Delete legacy import record if requested
    if (deleteImport) {
      const legacyImports = await Import.find({
        importNumber: { $regex: /^LEGACY-MIGRATION-/ }
      });

      for (const legacyImport of legacyImports) {
        await Import.findByIdAndDelete(legacyImport._id);
        stats.importDeleted = true;
        console.log(`🗑️  Deleted legacy import record: ${legacyImport.importNumber}`);
      }
    }

    // Final statistics
    console.log(`\n📊 Rollback Complete!`);
    console.log(`   Total batches found: ${stats.totalBatches}`);
    console.log(`   Batches deleted: ${stats.batchesDeleted}`);
    console.log(`   Products updated: ${stats.productsUpdated}`);
    console.log(`   Import deleted: ${stats.importDeleted ? 'Yes' : 'No'}`);
    console.log(`   Errors: ${stats.errors}\n`);

    // Verify rollback
    console.log('🔍 Verifying rollback...\n');
    const remainingLegacyBatches = await ProductBatch.find({
      importNumber: { $regex: /^LEGACY-MIGRATION-/ }
    });

    if (remainingLegacyBatches.length === 0) {
      console.log('✅ All legacy batches have been removed.\n');
    } else {
      console.warn(`⚠️  Warning: ${remainingLegacyBatches.length} legacy batches still remain.\n`);
    }

    console.log('✅ Rollback completed successfully!\n');
    await mongoose.connection.close();
    process.exit(0);

  } catch (error) {
    console.error('❌ Rollback failed:', error);
    await mongoose.connection.close();
    process.exit(1);
  }
}

// Run rollback if script is executed directly
if (require.main === module) {
  rollbackBatchMigration();
}

export { rollbackBatchMigration };

