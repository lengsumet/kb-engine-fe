# KB Engine Frontend - Deployment Guide

คู่มือการ deploy frontend application ไปยัง AWS infrastructure

## 📁 โครงสร้าง Deployment

```
deployment/
├── scripts/           # Deployment scripts
│   ├── deploy.py     # Main deployment script
│   └── deploy-frontend.py  # Alternative deployment script
├── tests/            # Infrastructure tests
│   ├── test_terraform_properties.py
│   ├── conftest.py
│   ├── pytest.ini
│   └── requirements.txt
├── logs/             # Deployment logs (auto-created)
├── DEPLOYMENT.md     # Detailed deployment documentation
├── PRODUCTION.md     # Production deployment guide
└── README.md         # This file
```

## 🚀 Quick Start

### 1. ติดตั้ง Prerequisites

ต้องมีโปรแกรมเหล่านี้ติดตั้งแล้ว:

- **Node.js** (v14+) และ **npm**
- **Python** (v3.7+)
- **AWS CLI** (configured with credentials)
- **Terraform** (v1.0+)

ตรวจสอบการติดตั้ง:
```bash
node --version
npm --version
python --version
aws --version
terraform --version
```

### 2. Configure AWS Credentials

```bash
aws configure
# ใส่ AWS Access Key ID, Secret Access Key, และ Region
```

### 3. Setup Terraform Variables

```bash
cd terraform
cp terraform.tfvars.example terraform.tfvars
# แก้ไข terraform.tfvars ตามต้องการ
```

### 4. Deploy!

```bash
# Deploy ทั้งหมด (infrastructure + frontend)
python deployment/scripts/deploy.py

# หรือ deploy เฉพาะ environment
python deployment/scripts/deploy.py --environment prod

# Skip build ถ้า build แล้ว
python deployment/scripts/deploy.py --skip-build

# Skip terraform ถ้าต้องการ update frontend อย่างเดียว
python deployment/scripts/deploy.py --skip-terraform
```

## 📋 Deployment Workflow

Script จะทำงานตามลำดับนี้:

1. **Check Prerequisites** - ตรวจสอบว่าติดตั้งโปรแกรมครบหรือไม่
2. **Install Dependencies** - ติดตั้ง npm packages
3. **Build Frontend** - Build React application
4. **Deploy Infrastructure** - Deploy AWS resources ด้วย Terraform
5. **Upload to S3** - Upload build files ไปยัง S3 bucket
6. **Invalidate CloudFront** - Clear CDN cache

## 🔧 Deployment Options

### Environment Options

```bash
# Development
python deployment/scripts/deploy.py --environment dev

# Staging
python deployment/scripts/deploy.py --environment staging

# Production
python deployment/scripts/deploy.py --environment prod
```

### Skip Options

```bash
# Skip frontend build (ใช้ build ที่มีอยู่)
python deployment/scripts/deploy.py --skip-build

# Skip Terraform (deploy frontend อย่างเดียว)
python deployment/scripts/deploy.py --skip-terraform

# Skip ทั้งสอง (upload + invalidate อย่างเดียว)
python deployment/scripts/deploy.py --skip-build --skip-terraform
```

## 🧪 Testing Infrastructure

ก่อน deploy ควรทดสอบ Terraform configuration:

```bash
# Install test dependencies
pip install -r deployment/tests/requirements.txt

# Run tests
cd deployment/tests
pytest -v

# หรือ run จาก root
python deployment/tests/run_tests.py
```

## 📊 Monitoring & Logs

### Deployment Logs

Logs จะถูกบันทึกที่:
- `deployment/logs/deploy.log` - Deployment history
- Console output - Real-time progress

### CloudWatch Logs

หลัง deploy สำเร็จ สามารถดู logs ได้ที่:

```bash
# Get log group name from Terraform output
terraform output cloudwatch_log_group_app

# View logs
aws logs tail /aws/kb-engine-fe-dev/application --follow
```

Log Groups ที่สร้างขึ้น:
- `/aws/kb-engine-fe-{env}/application` - Application logs
- `/aws/kb-engine-fe-{env}/cloudfront` - CloudFront access logs
- `/aws/kb-engine-fe-{env}/api-gateway` - API Gateway logs (ถ้ามี)

### CloudWatch Metrics

Metrics ที่ track อัตโนมัติ:
- **ErrorCount** - จำนวน errors ทั้งหมด
- **ClientErrors** - 4xx errors
- **ServerErrors** - 5xx errors

ดู metrics ได้ที่ AWS Console > CloudWatch > Metrics > `kb-engine-fe-{env}/Application`

## 🔄 Update Workflow

### Update Frontend Only

```bash
# 1. Build new version
npm run build

# 2. Deploy (skip terraform)
python deployment/scripts/deploy.py --skip-terraform
```

### Update Infrastructure Only

```bash
# 1. แก้ไข Terraform files
cd terraform
# แก้ไข *.tf files

# 2. Plan changes
terraform plan

# 3. Apply changes
terraform apply
```

### Rollback

```bash
# Rollback Terraform
cd terraform
terraform plan -destroy
terraform destroy

# หรือ rollback เฉพาะ resources
terraform destroy -target=aws_cloudfront_distribution.main
```

## 🌐 Access Application

หลัง deploy สำเร็จ:

```bash
# Get CloudFront URL
cd terraform
terraform output cloudfront_url

# หรือ
terraform output cloudfront_domain_name
```

เปิด browser ไปที่ URL ที่ได้

## 🐛 Troubleshooting

### Build Failed

```bash
# ลบ node_modules และ install ใหม่
rm -rf node_modules package-lock.json
npm install
npm run build
```

### Terraform Failed

```bash
# ตรวจสอบ state
cd terraform
terraform state list

# Refresh state
terraform refresh

# Re-initialize
rm -rf .terraform
terraform init
```

### S3 Upload Failed

```bash
# ตรวจสอบ AWS credentials
aws sts get-caller-identity

# ตรวจสอบ bucket
aws s3 ls

# Manual upload
aws s3 sync build/ s3://your-bucket-name/ --delete
```

### CloudFront Cache Issues

```bash
# Manual invalidation
aws cloudfront create-invalidation \
  --distribution-id YOUR_DISTRIBUTION_ID \
  --paths "/*"

# Check invalidation status
aws cloudfront get-invalidation \
  --distribution-id YOUR_DISTRIBUTION_ID \
  --id INVALIDATION_ID
```

## 📚 Additional Documentation

- `DEPLOYMENT.md` - Detailed deployment procedures
- `PRODUCTION.md` - Production deployment checklist
- `../terraform/README.md` - Terraform infrastructure guide

## 🔐 Security Notes

- **Never commit** `terraform.tfvars` (contains sensitive data)
- **Never commit** AWS credentials
- **Always use** IAM roles with minimum required permissions
- **Enable** MFA for production deployments
- **Review** Terraform plan before applying

## 💡 Tips

1. **Test in dev first** - Always test changes in dev environment
2. **Use version tags** - Tag releases in git for easy rollback
3. **Monitor logs** - Check CloudWatch logs after deployment
4. **Backup state** - Keep Terraform state backups
5. **Document changes** - Update CHANGELOG.md for each deployment

## 🆘 Support

หากมีปัญหา:
1. ตรวจสอบ logs ใน `deployment/logs/deploy.log`
2. ดู CloudWatch logs
3. ตรวจสอบ Terraform state
4. ติดต่อ DevOps team