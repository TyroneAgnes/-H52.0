-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "nickname" TEXT,
    "password" TEXT NOT NULL,
    "inviteCode" TEXT NOT NULL,
    "referralCode" TEXT,
    "referrerId" TEXT,
    "token" TEXT,
    "balance" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "baseDeposit" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "starWalletBalance" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "starInvestBalance" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "vipLevel" INTEGER NOT NULL DEFAULT 1,
    "vipName" TEXT NOT NULL DEFAULT '普通代理',
    "teamCount" INTEGER NOT NULL DEFAULT 0,
    "directCount" INTEGER NOT NULL DEFAULT 0,
    "teamProfit" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "totalProfit" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "yesterdayProfit" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "starInvestProfit" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "starWalletProfit" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "avatar" TEXT,
    "commission" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "teamPerformance" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "isFirstLogin" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TradeRecord" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "symbol" TEXT NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "total" DOUBLE PRECISION NOT NULL,
    "status" TEXT NOT NULL,
    "returnTime" TIMESTAMP(3),
    "returnAmount" DOUBLE PRECISION,
    "mentorReturn" DOUBLE PRECISION,
    "mentorId" TEXT,
    "mentorName" TEXT,
    "returnRate" DOUBLE PRECISION,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TradeRecord_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MentorTrade" (
    "id" TEXT NOT NULL,
    "tradeRecordId" TEXT NOT NULL,
    "time" TIMESTAMP(3) NOT NULL,
    "stockCode" TEXT NOT NULL,
    "stockName" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "volume" INTEGER NOT NULL,
    "profit" DOUBLE PRECISION,
    "profitRate" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MentorTrade_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RechargeRecord" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "rejectReason" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "approvedAt" TIMESTAMP(3),

    CONSTRAINT "RechargeRecord_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CompletedTask" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "reward" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CompletedTask_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CurrentTask" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "reward" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completedAt" TIMESTAMP(3),

    CONSTRAINT "CurrentTask_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TaskHistory" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "taskId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "reward" DOUBLE PRECISION NOT NULL,
    "completedAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TaskHistory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MarketData" (
    "id" TEXT NOT NULL,
    "symbol" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "market" TEXT NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "change" DOUBLE PRECISION NOT NULL,
    "changePercent" DOUBLE PRECISION NOT NULL,
    "volume" INTEGER NOT NULL,
    "isPositive" BOOLEAN NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MarketData_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MarketIndex" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "value" DOUBLE PRECISION NOT NULL,
    "change" DOUBLE PRECISION NOT NULL,
    "changePercent" DOUBLE PRECISION NOT NULL,
    "isPositive" BOOLEAN NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MarketIndex_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- CreateIndex
CREATE UNIQUE INDEX "User_inviteCode_key" ON "User"("inviteCode");

-- CreateIndex
CREATE UNIQUE INDEX "MarketData_symbol_key" ON "MarketData"("symbol");

-- CreateIndex
CREATE UNIQUE INDEX "MarketIndex_title_key" ON "MarketIndex"("title");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_referrerId_fkey" FOREIGN KEY ("referrerId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TradeRecord" ADD CONSTRAINT "TradeRecord_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MentorTrade" ADD CONSTRAINT "MentorTrade_tradeRecordId_fkey" FOREIGN KEY ("tradeRecordId") REFERENCES "TradeRecord"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RechargeRecord" ADD CONSTRAINT "RechargeRecord_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CompletedTask" ADD CONSTRAINT "CompletedTask_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CurrentTask" ADD CONSTRAINT "CurrentTask_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TaskHistory" ADD CONSTRAINT "TaskHistory_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
