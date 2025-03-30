-- CreateTable
CREATE TABLE "Users" (
    "userId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Users_pkey" PRIMARY KEY ("userId")
);

-- CreateTable
CREATE TABLE "Categories" (
    "categoryId" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Categories_pkey" PRIMARY KEY ("categoryId")
);

-- CreateTable
CREATE TABLE "Attributes" (
    "attributeId" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "categoryId" INTEGER NOT NULL,

    CONSTRAINT "Attributes_pkey" PRIMARY KEY ("attributeId")
);

-- CreateTable
CREATE TABLE "Values" (
    "valueId" SERIAL NOT NULL,
    "value" TEXT NOT NULL,
    "attributeId" INTEGER NOT NULL,

    CONSTRAINT "Values_pkey" PRIMARY KEY ("valueId")
);

-- CreateTable
CREATE TABLE "Products" (
    "productId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "price" DECIMAL(10,2) NOT NULL,
    "rating" DOUBLE PRECISION,
    "stock_quantity" INTEGER NOT NULL,
    "discount_price" DECIMAL(10,2),
    "on_sale" BOOLEAN DEFAULT false,
    "categoryId" INTEGER NOT NULL,
    "image_url" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Products_pkey" PRIMARY KEY ("productId")
);

-- CreateTable
CREATE TABLE "ProductAttributes" (
    "productId" TEXT NOT NULL,
    "valueId" INTEGER NOT NULL,

    CONSTRAINT "ProductAttributes_pkey" PRIMARY KEY ("productId","valueId")
);

-- CreateIndex
CREATE UNIQUE INDEX "Categories_name_key" ON "Categories"("name");

-- CreateIndex
CREATE INDEX "Attributes_categoryId_idx" ON "Attributes"("categoryId");

-- CreateIndex
CREATE UNIQUE INDEX "Attributes_name_categoryId_key" ON "Attributes"("name", "categoryId");

-- CreateIndex
CREATE INDEX "Values_attributeId_idx" ON "Values"("attributeId");

-- CreateIndex
CREATE INDEX "Products_categoryId_idx" ON "Products"("categoryId");

-- CreateIndex
CREATE INDEX "ProductAttributes_valueId_idx" ON "ProductAttributes"("valueId");

-- AddForeignKey
ALTER TABLE "Attributes" ADD CONSTRAINT "Attributes_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Categories"("categoryId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Values" ADD CONSTRAINT "Values_attributeId_fkey" FOREIGN KEY ("attributeId") REFERENCES "Attributes"("attributeId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Products" ADD CONSTRAINT "Products_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Categories"("categoryId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductAttributes" ADD CONSTRAINT "ProductAttributes_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Products"("productId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductAttributes" ADD CONSTRAINT "ProductAttributes_valueId_fkey" FOREIGN KEY ("valueId") REFERENCES "Values"("valueId") ON DELETE CASCADE ON UPDATE CASCADE;
