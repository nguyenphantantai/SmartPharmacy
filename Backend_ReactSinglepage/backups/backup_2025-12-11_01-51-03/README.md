# Database Backup

**Backup Date:** 2025-12-11T18:51:05.145Z

## Collections Backed Up

- products
- imports
- orders
- orderitems

## Total Documents

671 documents

## Restore Instructions

To restore from this backup, use the restore script:

```bash
npm run db:restore -- --input backups\backup_2025-12-11_01-51-03
```

Or manually restore using MongoDB:

```bash
# For each collection file:
mongoimport --uri="your-mongodb-uri" --collection=products --file=products_2025-12-11_01-51-03.json --jsonArray
```

## Files

- products_2025-12-11_01-51-03.json
- products_2025-12-11_01-51-03_compact.json
- imports_2025-12-11_01-51-03.json
- imports_2025-12-11_01-51-03_compact.json
- orders_2025-12-11_01-51-03.json
- orders_2025-12-11_01-51-03_compact.json
- orderitems_2025-12-11_01-51-03.json
- orderitems_2025-12-11_01-51-03_compact.json

## Notes

- This backup was created before running batch system migration
- Compact files are single-line JSON (faster to import)
- Regular files are formatted JSON (easier to read)
