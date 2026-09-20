-- Birari Unisex Salon — Initial schema migration (SQLite)
-- This file mirrors prisma/schema.prisma exactly. If you prefer, delete this
-- folder and run `npx prisma migrate dev --name init` once, which will
-- regenerate an identical migration from schema.prisma.

CREATE TABLE "Settings" (
  "id" INTEGER NOT NULL PRIMARY KEY DEFAULT 1,
  "salonName" TEXT NOT NULL DEFAULT 'Birari Unisex Salon',
  "salonLogo" TEXT NOT NULL DEFAULT '/assets/birari-unisex-salon-logo.png',
  "ownerWhatsappNumber" TEXT NOT NULL,
  "upiId" TEXT NOT NULL,
  "phonepeNumber" TEXT,
  "googlepayNumber" TEXT,
  "paytmNumber" TEXT,
  "prebookingAmount" INTEGER NOT NULL DEFAULT 100,
  "updatedAt" DATETIME NOT NULL
);

CREATE TABLE "Service" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "name" TEXT NOT NULL,
  "isActive" BOOLEAN NOT NULL DEFAULT true,
  "sortOrder" INTEGER NOT NULL DEFAULT 0,
  "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE "Offer" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "title" TEXT NOT NULL,
  "description" TEXT,
  "isActive" BOOLEAN NOT NULL DEFAULT true,
  "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE "Customer" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "registrationId" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "mobile" TEXT NOT NULL,
  "dob" TEXT,
  "serviceId" TEXT NOT NULL,
  "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "Customer_serviceId_fkey" FOREIGN KEY ("serviceId") REFERENCES "Service" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
CREATE UNIQUE INDEX "Customer_registrationId_key" ON "Customer"("registrationId");

CREATE TABLE "Payment" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "registrationId" TEXT NOT NULL,
  "customerId" TEXT NOT NULL,
  "amount" INTEGER NOT NULL,
  "paymentMethod" TEXT NOT NULL DEFAULT 'UPI',
  "paymentStatus" TEXT NOT NULL DEFAULT 'Payment Submitted',
  "paymentReference" TEXT,
  "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" DATETIME NOT NULL,
  CONSTRAINT "Payment_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customer" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
CREATE UNIQUE INDEX "Payment_registrationId_key" ON "Payment"("registrationId");
CREATE UNIQUE INDEX "Payment_customerId_key" ON "Payment"("customerId");

CREATE TABLE "ScratchCard" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "customerId" TEXT NOT NULL,
  "offerId" TEXT,
  "token" TEXT NOT NULL,
  "status" TEXT NOT NULL DEFAULT 'Locked',
  "secretKeyUsed" TEXT,
  "unlockedAt" DATETIME,
  "redeemedAt" DATETIME,
  "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "ScratchCard_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customer" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT "ScratchCard_offerId_fkey" FOREIGN KEY ("offerId") REFERENCES "Offer" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
CREATE UNIQUE INDEX "ScratchCard_customerId_key" ON "ScratchCard"("customerId");
CREATE UNIQUE INDEX "ScratchCard_token_key" ON "ScratchCard"("token");

CREATE TABLE "SecretKey" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "code" TEXT NOT NULL,
  "expiresAt" DATETIME,
  "isActive" BOOLEAN NOT NULL DEFAULT true,
  "usedByCustomerId" TEXT,
  "usedAt" DATETIME,
  "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE UNIQUE INDEX "SecretKey_code_key" ON "SecretKey"("code");

CREATE TABLE "AdminUser" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "username" TEXT NOT NULL,
  "passwordHash" TEXT NOT NULL,
  "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE UNIQUE INDEX "AdminUser_username_key" ON "AdminUser"("username");

CREATE TABLE "AdminSession" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "token" TEXT NOT NULL,
  "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "expiresAt" DATETIME NOT NULL
);
CREATE UNIQUE INDEX "AdminSession_token_key" ON "AdminSession"("token");
