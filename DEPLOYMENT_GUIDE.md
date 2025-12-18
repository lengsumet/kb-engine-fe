# KB Engine - Deployment Guide

## 🚀 Quick Deploy Commands

### PowerShell (แนะนำสำหรับ Windows)
```powershell
# Deploy ทั้งหมด (Infrastructure + Frontend)
.\deployment\scripts\deploy.ps1

# Deploy เฉพาะ Infrastructure
.\deployment\scripts\deploy.ps1 -InfraOnly

# Deploy เฉพาะ Frontend
.\deployment\scripts\deploy.ps1 -FrontendOnly
```

### Manual Commands

#### 🏗️ Infrastructure (Terraform)
```bash
cd terraform
terraform init
terraform plan
terraform apply
```

#### 🚀 Frontend Only
```bash
npm run build
python deployment/scripts/deploy-frontend.py
```

#### 🔄 Full Deploy (Infrastructure + Frontend)
```bash
# 1. Deploy Infrastructure
cd terraform
terraform apply
cd ..

# 2. Deploy Frontend
npm run build
python deployment/scripts/deploy-frontend.py
```

## Quick Commands

### Manual Frontend Deploy
```bash
# Build
npm run build

# Get bucket name
BUCKET_NAME=$(cd terraform && terraform output -raw s3_bucket_name)

# Upload files
aws s3 sync build/ s3://$BUCKET_NAME/ --delete --cache-control "public, max-age=31536000, immutable" --exclude "index.html"
aws s3 cp build/index.html s3://$BUCKET_NAME/ --cache-control "no-cache, no-store, must-revalidate"

# Invalidate cache
DISTRIBUTION_ID=$(cd terraform && terraform output -raw cloudfront_distribution_id)
aws cloudfront create-invalidation --distribution-id $DISTRIBUTION_ID --paths "/*"
```

### Windows Commands
```cmd
npm run build
aws s3 sync build/ s3://kb-engine-fe-dev-frontend-9d8c41f4/ --delete --cache-control "public, max-age=31536000, immutable" --exclude "index.html"
aws s3 cp build/index.html s3://kb-engine-fe-dev-frontend-9d8c41f4/ --cache-control "no-cache, no-store, must-revalidate"
aws cloudfront create-invalidation --distribution-id EFT7CUIIA5EDH --paths "/*"
```

## Prerequisites

- ✅ Node.js v22+ (ปัจจุบัน: v22.17.1)
- ✅ AWS CLI configured
- ✅ Terraform installed
- ✅ Python 3.x

## Current Infrastructure

- **S3 Bucket**: `kb-engine-fe-dev-frontend-9d8c41f4`
- **CloudFront**: `https://d5yzuaybkxsi6.cloudfront.net`
- **Distribution ID**: `EFT7CUIIA5EDH`

## 📋 Available Scripts

| Script | Platform | Description |
|--------|----------|-------------|
| `deploy.ps1` | PowerShell | ✅ **แนะนำ** - Deploy ทั้งหมดหรือแยกส่วน |
| `deploy-windows.bat` | Windows CMD | Deploy frontend เท่านั้น |
| `deploy-frontend.py` | Python | Deploy frontend (แก้ไขแล้ว) |

## 🔧 Script Usage Examples

```powershell
# ดู help
.\deployment\scripts\deploy.ps1 -Help

# Deploy ทั้งหมด
.\deployment\scripts\deploy.ps1

# Deploy เฉพาะ infrastructure
.\deployment\scripts\deploy.ps1 -InfraOnly

# Deploy เฉพาะ frontend
.\deployment\scripts\deploy.ps1 -FrontendOnly
```

## 🛠️ Troubleshooting

### ปัญหาที่พบบ่อย

1. **Python script หา terraform directory ไม่เจอ**
   - ใช้ PowerShell script แทน: `deploy.ps1`
   - หรือรัน manual commands

2. **Build warnings**
   - ESLint warnings ไม่กระทบการทำงาน
   - แต่ควรแก้ไขใน development

3. **AWS credentials**
   - ตรวจสอบ: `aws sts get-caller-identity`
   - Configure: `aws configure`

### การแก้ไขที่ทำแล้ว

✅ **แก้ไข deployment script** - รองรับ path detection ที่ดีขึ้น
✅ **เพิ่ม PowerShell script** - ใช้งานง่ายสำหรับ Windows  
✅ **เพิ่ม Windows batch script** - สำหรับ CMD users

## Issues & Solutions

### ❌ Deployment Script Path Issue (แก้ไขแล้ว)
**Problem**: Script ไม่หา terraform directory เจอ
**Solution**: แก้ไข path detection ใน script แล้ว

### ⚠️ Build Warnings
**Problem**: ESLint warnings ใน React components
**Solution**: ไม่กระทบการทำงาน แต่ควรแก้ไขใน development

### 🔧 Script Improvements (ทำแล้ว)
1. ✅ แก้ path detection ใน deployment script
2. ✅ เพิ่ม error handling
3. ✅ เพิ่ม validation steps