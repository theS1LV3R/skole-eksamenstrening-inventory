-- CreateTable
CREATE TABLE "ItemExtensions" (
    "id" SERIAL NOT NULL,
    "item_type_id" INTEGER NOT NULL,
    "extension_type_id" INTEGER NOT NULL,

    CONSTRAINT "ItemExtensions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ItemExtensionTypes" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "ItemExtensionTypes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ItemType" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "ItemType_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Item" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "type_id" INTEGER NOT NULL,

    CONSTRAINT "Item_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RequestStatus" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "RequestStatus_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Request" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "approved_date" TIMESTAMP(3),
    "duration" TEXT,
    "status_id" INTEGER NOT NULL,

    CONSTRAINT "Request_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RequestedItems" (
    "id" SERIAL NOT NULL,
    "amount" INTEGER NOT NULL,
    "item_type_id" INTEGER NOT NULL,
    "request_id" INTEGER NOT NULL,

    CONSTRAINT "RequestedItems_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RequestedExtension" (
    "id" SERIAL NOT NULL,
    "amount" INTEGER NOT NULL,
    "request_id" INTEGER NOT NULL,
    "extension_type_id" INTEGER NOT NULL,

    CONSTRAINT "RequestedExtension_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "name" TEXT,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "password_hash" TEXT,
    "role_id" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserRole" (
    "id" SERIAL NOT NULL,
    "name" TEXT,

    CONSTRAINT "UserRole_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ItemExtensions_id_idx" ON "ItemExtensions"("id");

-- CreateIndex
CREATE INDEX "ItemExtensions_item_type_id_idx" ON "ItemExtensions"("item_type_id");

-- CreateIndex
CREATE INDEX "ItemExtensions_extension_type_id_idx" ON "ItemExtensions"("extension_type_id");

-- CreateIndex
CREATE INDEX "Item_type_id_idx" ON "Item"("type_id");

-- CreateIndex
CREATE INDEX "Request_status_id_idx" ON "Request"("status_id");

-- CreateIndex
CREATE INDEX "Request_user_id_idx" ON "Request"("user_id");

-- CreateIndex
CREATE INDEX "RequestedItems_item_type_id_idx" ON "RequestedItems"("item_type_id");

-- CreateIndex
CREATE INDEX "RequestedItems_request_id_idx" ON "RequestedItems"("request_id");

-- CreateIndex
CREATE INDEX "RequestedExtension_extension_type_id_idx" ON "RequestedExtension"("extension_type_id");

-- CreateIndex
CREATE INDEX "RequestedExtension_request_id_idx" ON "RequestedExtension"("request_id");

-- CreateIndex
CREATE INDEX "User_role_id_idx" ON "User"("role_id");

-- CreateIndex
CREATE INDEX "User_active_idx" ON "User"("active");

-- AddForeignKey
ALTER TABLE "ItemExtensions" ADD CONSTRAINT "ItemExtensions_item_type_id_fkey" FOREIGN KEY ("item_type_id") REFERENCES "ItemType"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "ItemExtensions" ADD CONSTRAINT "ItemExtensions_extension_type_id_fkey" FOREIGN KEY ("extension_type_id") REFERENCES "ItemExtensionTypes"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "Item" ADD CONSTRAINT "Item_type_id_fkey" FOREIGN KEY ("type_id") REFERENCES "ItemType"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "Request" ADD CONSTRAINT "Request_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "Request" ADD CONSTRAINT "Request_status_id_fkey" FOREIGN KEY ("status_id") REFERENCES "RequestStatus"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "RequestedItems" ADD CONSTRAINT "RequestedItems_item_type_id_fkey" FOREIGN KEY ("item_type_id") REFERENCES "ItemType"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "RequestedItems" ADD CONSTRAINT "RequestedItems_request_id_fkey" FOREIGN KEY ("request_id") REFERENCES "Request"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "RequestedExtension" ADD CONSTRAINT "RequestedExtension_request_id_fkey" FOREIGN KEY ("request_id") REFERENCES "Request"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "RequestedExtension" ADD CONSTRAINT "RequestedExtension_extension_type_id_fkey" FOREIGN KEY ("extension_type_id") REFERENCES "ItemExtensionTypes"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_role_id_fkey" FOREIGN KEY ("role_id") REFERENCES "UserRole"("id") ON DELETE CASCADE ON UPDATE NO ACTION;
