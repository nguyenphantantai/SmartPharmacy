/**
 * Migration Script: Convert existing products to batch system
 * 
 * This script migrates existing products that have stockQuantity but no batch records
 * to the new ProductBatch system.
 * 
 * Usage:
 *   tsx src/utils/migrateToBatchSystem.ts
 * 
 * Or with npm:
 *   npm run migrate:batches
 */

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import { config } from '../config/index.js';
import { connectDB } from '../config/database.js';
import { Product, ProductBatch, Import, User, Supplier } from '../models/schema.js';

// Load environment variables
dotenv.config();

interface MigrationStats {
  totalProducts: number;
  productsWithStock: number;
  productsWithBatches: number;
  productsNeedingMigration: number;
  batchesCreated: number;
  errors: number;
}

/**
 * Main migration function
 */
async function migrateToBatchSystem() {
  console.log('🚀 Starting migration to batch system...\n');

  try {
    // Connect to database
    await connectDB();
    console.log('✅ Connected to MongoDB\n');

    const stats: MigrationStats = {
      totalProducts: 0,
      productsWithStock: 0,
      productsWithBatches: 0,
      productsNeedingMigration: 0,
      batchesCreated: 0,
      errors: 0,
    };

    // Get all products
    const allProducts = await Product.find({});
    stats.totalProducts = allProducts.length;
    console.log(`📦 Found ${stats.totalProducts} total products\n`);

    // Filter products that have stock but no batches
    const productsNeedingMigration: any[] = [];

    for (const product of allProducts) {
      const stockQuantity = product.stockQuantity || 0;
      
      if (stockQuantity > 0) {
        stats.productsWithStock++;
        
        // Check if product already has batches
        const existingBatches = await ProductBatch.find({ productId: product._id });
        
        if (existingBatches.length > 0) {
          stats.productsWithBatches++;
          console.log(`⏭️  Product "${product.name}" already has ${existingBatches.length} batch(es), skipping...`);
        } else {
          stats.productsNeedingMigration++;
          productsNeedingMigration.push(product);
        }
      }
    }

    console.log(`\n📊 Migration Statistics:`);
    console.log(`   Total products: ${stats.totalProducts}`);
    console.log(`   Products with stock: ${stats.productsWithStock}`);
    console.log(`   Products with batches: ${stats.productsWithBatches}`);
    console.log(`   Products needing migration: ${stats.productsNeedingMigration}\n`);

    if (productsNeedingMigration.length === 0) {
      console.log('✅ No products need migration. All products already have batch records or have no stock.\n');
      await mongoose.connection.close();
      process.exit(0);
    }

    // Confirm before proceeding
    console.log(`⚠️  About to create batch records for ${productsNeedingMigration.length} products.`);
    console.log(`   This will create legacy batch records for existing stock.\n`);

    // Create batch records for each product
    for (const product of productsNeedingMigration) {
      try {
        const stockQuantity = product.stockQuantity || 0;
        const batchNumber = product.batchNumber || `LEGACY-${Date.now()}`;
        const expirationDate = product.expirationDate || new Date(Date.now() + 365 * 24 * 60 * 60 * 1000); // Default: 1 year from now
        
        // Create a legacy import record reference
        // For legacy batches, we'll use a special import number
        const legacyImportNumber = `LEGACY-MIGRATION-${new Date().toISOString().split('T')[0]}`;
        
        // Try to find an existing import record, or create a dummy one
        let legacyImportId: mongoose.Types.ObjectId;
        
        // Try to find existing import with this number
        let legacyImport = await Import.findOne({ importNumber: legacyImportNumber });
        
        if (!legacyImport) {
          // Get or create a dummy supplier for legacy imports
          let legacySupplier = await Supplier.findOne({ name: 'Legacy Migration' });
          if (!legacySupplier) {
            legacySupplier = await Supplier.create({
              name: 'Legacy Migration',
              contactPerson: 'System',
              phone: 'N/A',
              email: 'migration@system.local',
              address: 'N/A',
            });
          }
          
          // Get or create a dummy user for legacy imports
          let legacyUser = await User.findOne({ email: 'migration@system.local' });
          if (!legacyUser) {
            // Hash password
            const hashedPassword = await bcrypt.hash('migration123', 10);
            
            legacyUser = await User.create({
              email: 'migration@system.local',
              password: hashedPassword,
              firstName: 'Migration',
              lastName: 'System',
              phone: '0000000000',
              role: 'admin',
              isActive: true,
            });
          }
          
          // Create a minimal import record for legacy batches
          legacyImport = await Import.create({
            importNumber: legacyImportNumber,
            supplierId: legacySupplier._id,
            supplierName: 'Legacy Migration',
            items: [],
            totalQuantity: 0,
            totalAmount: 0,
            status: 'completed',
            receivedBy: legacyUser._id,
            receivedAt: new Date(),
            notes: 'Legacy migration - created automatically for products with existing stock',
          });
        }
        
        legacyImportId = legacyImport._id;

        // Create batch record
        const batch = await ProductBatch.create({
          productId: product._id,
          batchNumber: batchNumber,
          expirationDate: expirationDate,
          manufacturingDate: product.manufacturingDate,
          quantity: stockQuantity,
          remainingQuantity: stockQuantity,
          importId: legacyImportId,
          importNumber: legacyImportNumber,
        });

        stats.batchesCreated++;
        console.log(`✅ Created batch "${batch.batchNumber}" for product "${product.name}": ${stockQuantity} ${product.unit || 'units'}`);

      } catch (error: any) {
        stats.errors++;
        console.error(`❌ Error migrating product "${product.name}":`, error.message);
      }
    }

    // Final statistics
    console.log(`\n📊 Migration Complete!`);
    console.log(`   Batches created: ${stats.batchesCreated}`);
    console.log(`   Errors: ${stats.errors}\n`);

    // Verify migration
    console.log('🔍 Verifying migration...\n');
    let verifiedCount = 0;
    for (const product of productsNeedingMigration) {
      const batches = await ProductBatch.find({ productId: product._id });
      if (batches.length > 0) {
        const totalRemaining = batches.reduce((sum, b) => sum + b.remainingQuantity, 0);
        if (totalRemaining === (product.stockQuantity || 0)) {
          verifiedCount++;
        } else {
          console.warn(`⚠️  Product "${product.name}": Stock mismatch. Expected: ${product.stockQuantity}, Found in batches: ${totalRemaining}`);
        }
      }
    }
    console.log(`✅ Verified: ${verifiedCount}/${productsNeedingMigration.length} products migrated correctly\n`);

    console.log('✅ Migration completed successfully!\n');
    await mongoose.connection.close();
    process.exit(0);

  } catch (error) {
    console.error('❌ Migration failed:', error);
    await mongoose.connection.close();
    process.exit(1);
  }
}

// Run migration if script is executed directly
if (require.main === module) {
  migrateToBatchSystem();
}

export { migrateToBatchSystem };

