# Migration `20200523215607-added-owner-files-table`

This migration has been generated by danielferreiradf at 5/23/2020, 9:56:07 PM.
You can check out the [state of the schema](./schema.prisma) after the migration.

## Database Steps

```sql
ALTER TABLE "public"."files" ADD COLUMN "ownerId" integer  NOT NULL ;

ALTER TABLE "public"."files" ADD FOREIGN KEY ("ownerId")REFERENCES "public"."users"("id") ON DELETE CASCADE  ON UPDATE CASCADE
```

## Changes

```diff
diff --git schema.prisma schema.prisma
migration 20200523213535-changed-files-table..20200523215607-added-owner-files-table
--- datamodel.dml
+++ datamodel.dml
@@ -4,9 +4,9 @@
 // DEV DB
 datasource db {
   provider = "postgresql"
-  url = "***"
+  url      = env("DATABASE_URL")
 }
 model User {
   id             Int       @default(autoincrement()) @id
@@ -23,8 +23,9 @@
   createdAt      DateTime  @default(now())
   updatedAt      DateTime  @updatedAt
   ownedProducts  Order[]   @relation("OwnerOfProduct")
   rentedProducts Order[]   @relation("RenterOfProduct")
+  File           File[]
   @@map("users")
 }
@@ -51,8 +52,10 @@
   name      String
   path      String
   createdAt DateTime  @default(now())
   updatedAt DateTime  @updatedAt
+  owner     User      @relation(fields: [ownerId], references: [id])
+  ownerId   Int
   Product   Product[]
   @@map("files")
 }
```


