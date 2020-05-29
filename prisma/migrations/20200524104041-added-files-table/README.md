# Migration `20200524104041-added-files-table`

This migration has been generated by danielferreiradf at 5/24/2020, 10:40:41 AM.
You can check out the [state of the schema](./schema.prisma) after the migration.

## Database Steps

```sql
CREATE TABLE "public"."users" (
"address" text  NOT NULL ,"cep" text  NOT NULL ,"city" text  NOT NULL ,"createdAt" timestamp(3)  NOT NULL DEFAULT CURRENT_TIMESTAMP,"email" text  NOT NULL ,"firstName" text  NOT NULL ,"id" SERIAL,"lastName" text  NOT NULL ,"password" text  NOT NULL ,"phone" text  NOT NULL ,"state" text  NOT NULL ,"updatedAt" timestamp(3)  NOT NULL ,
    PRIMARY KEY ("id"))

CREATE TABLE "public"."products" (
"createdAt" timestamp(3)  NOT NULL DEFAULT CURRENT_TIMESTAMP,"description" text  NOT NULL ,"id" SERIAL,"location" text  NOT NULL ,"name" text  NOT NULL ,"ownerId" integer  NOT NULL ,"pictureId" integer  NOT NULL ,"price" integer  NOT NULL ,"statusRent" boolean  NOT NULL DEFAULT false,"updatedAt" timestamp(3)  NOT NULL ,
    PRIMARY KEY ("id"))

CREATE TABLE "public"."files" (
"createdAt" timestamp(3)  NOT NULL DEFAULT CURRENT_TIMESTAMP,"id" SERIAL,"name" text  NOT NULL ,"ownerId" integer  NOT NULL ,"path" text  NOT NULL ,"updatedAt" timestamp(3)  NOT NULL ,
    PRIMARY KEY ("id"))

CREATE TABLE "public"."orders" (
"createdAt" timestamp(3)  NOT NULL DEFAULT CURRENT_TIMESTAMP,"endOfRent" timestamp(3)  NOT NULL ,"id" SERIAL,"ownerId" integer  NOT NULL ,"productId" integer  NOT NULL ,"renterId" integer  NOT NULL ,"startOfRent" timestamp(3)  NOT NULL ,"totalPrice" integer  NOT NULL ,"updatedAt" timestamp(3)  NOT NULL ,
    PRIMARY KEY ("id"))

CREATE UNIQUE INDEX "users.email" ON "public"."users"("email")

CREATE UNIQUE INDEX "files.path" ON "public"."files"("path")

ALTER TABLE "public"."products" ADD FOREIGN KEY ("ownerId")REFERENCES "public"."users"("id") ON DELETE CASCADE  ON UPDATE CASCADE

ALTER TABLE "public"."products" ADD FOREIGN KEY ("pictureId")REFERENCES "public"."files"("id") ON DELETE CASCADE  ON UPDATE CASCADE

ALTER TABLE "public"."files" ADD FOREIGN KEY ("ownerId")REFERENCES "public"."users"("id") ON DELETE CASCADE  ON UPDATE CASCADE

ALTER TABLE "public"."orders" ADD FOREIGN KEY ("productId")REFERENCES "public"."products"("id") ON DELETE CASCADE  ON UPDATE CASCADE

ALTER TABLE "public"."orders" ADD FOREIGN KEY ("ownerId")REFERENCES "public"."users"("id") ON DELETE CASCADE  ON UPDATE CASCADE

ALTER TABLE "public"."orders" ADD FOREIGN KEY ("renterId")REFERENCES "public"."users"("id") ON DELETE CASCADE  ON UPDATE CASCADE
```

## Changes

```diff
diff --git schema.prisma schema.prisma
migration 20200523215607-added-owner-files-table..20200524104041-added-files-table
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
@@ -23,9 +23,9 @@
   createdAt      DateTime  @default(now())
   updatedAt      DateTime  @updatedAt
   ownedProducts  Order[]   @relation("OwnerOfProduct")
   rentedProducts Order[]   @relation("RenterOfProduct")
-  File           File[]
+  File           File[]    @relation("UploaderOfFile")
   @@map("users")
 }
@@ -49,13 +49,13 @@
 model File {
   id        Int       @default(autoincrement()) @id
   name      String
-  path      String
+  path      String    @unique
+  owner     User      @relation("UploaderOfFile", fields: [ownerId], references: [id])
+  ownerId   Int
   createdAt DateTime  @default(now())
   updatedAt DateTime  @updatedAt
-  owner     User      @relation(fields: [ownerId], references: [id])
-  ownerId   Int
   Product   Product[]
   @@map("files")
 }
```

