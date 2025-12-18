# การ Deploy Knowledge Base Engine Frontend บน AWS

## ภาพรวม

เอกสารนี้อธิบายวิธีการ deploy frontend application ของ Knowledge Base Engine บน AWS โดยใช้ Terraform

## 🎉 สถานะปัจจุบัน - DEPLOYED

**Production URL**: https://doottadai0jpy.cloudfront.net
**Deploy Date**: 18 ธันวาคม 2025
**Status**: ✅ Live และทำงานปกติ

## สถาปัตยกรรม

```
┌─────────────┐
│   ผู้ใช้งาน   │
└──────┬──────┘
       │ HTTPS
       ▼
┌─────────────────────────────────────┐
│   CloudFront Distribution           │
│   - Edge Locations ทั่วโลก          │
│   - SSL/TLS Termination            │
│   - Caching Layer                   │
└──────┬──────────────────────────────┘
       │
       │ /* (Static Content)
       │
       ▼
┌─────────────────┐
│  S3 Bucket      │
│  (Private)      │
│  - Static Files │
│  - OAI Access   │
└─────────────────┘
```

**หมายเหตุ:** API Gateway จะถูกเพิ่มเข้ามาในภายหลังเมื่อทีมหลังบ้านพร้อม

## ข้อกำหนดเบื้องต้น

1. **Terraform** (>= 1.0)
   ```bash
   # ตรวจสอบ version
   terraform --version
   ```

2. **AWS CLI**
   ```bash
   # ติดตั้ง
   pip install awscli
   
   # ตั้งค่า credentials
   aws configure
   ```

3. **Node.js และ npm** (สำหรับ build frontend)
   ```bash
   node --version
   npm --version
   ```

4. **AWS Credentials** ที่มีสิทธิ์:
   - S3: CreateBucket, PutObject, DeleteObject
   - CloudFront: CreateDistribution, UpdateDistribution
   - IAM: CreateRole, AttachRolePolicy

## วิธีการ Deploy

### ✅ Production Deployment (เสร็จแล้ว)

**Infrastructure**: Deploy เสร็จเมื่อ 18 ธันวาคม 2025
**Frontend**: Deploy เสร็จเมื่อ 18 ธันวาคม 2025

### 🔄 การอัพเดท Frontend

```bash
# อัพเดท frontend เมื่อมีการเปลี่ยนแปลง
python deploy-frontend.py
```

### 🆕 Deploy Environment ใหม่

```bash
# รัน deployment script
python deploy.py
```

Script จะถามคำถามดังนี้:

1. **API Gateway Configuration:**
   - เลือก `1` เพื่อข้าม API Gateway (deploy frontend อย่างเดียว)
   - เลือก `2` เมื่อมี API Gateway พร้อมแล้ว

2. **Deploy Frontend:**
   - ตอบ `y` เพื่อ deploy frontend ทันที
   - ตอบ `n` เพื่อ deploy ทีหลัง

## การ Deploy แบบ Manual

### 1. Deploy Infrastructure

```bash
cd terraform

# สร้าง terraform.tfvars
cp terraform.tfvars.example terraform.tfvars

# แก้ไข terraform.tfvars (ตั้งค่า api_gateway_domain = "" เพื่อข้าม API Gateway)
nano terraform.tfvars

# Initialize Terraform
terraform init

# Plan และ Apply
terraform plan
terraform apply
```

### 2. Build Frontend

```bash
cd kb-engine-fe

# ติดตั้ง dependencies (ถ้ายังไม่ได้ติดตั้ง)
npm install

# Build application
npm run build
```

### 3. Upload ไปยัง S3

```bash
# ดึง bucket name จาก terraform output
BUCKET_NAME=$(cd terraform && terraform output -raw s3_bucket_name)

# Upload static assets
aws s3 sync kb-engine-fe/build/ s3://$BUCKET_NAME/ \
  --delete \
  --cache-control "public, max-age=31536000, immutable" \
  --exclude "index.html" \
  --exclude "service-worker.js"

# Upload index.html (no cache)
aws s3 cp kb-engine-fe/build/index.html s3://$BUCKET_NAME/ \
  --cache-control "no-cache, no-store, must-revalidate"
```

### 4. Invalidate CloudFront Cache

```bash
# ดึง distribution ID
DISTRIBUTION_ID=$(cd terraform && terraform output -raw cloudfront_distribution_id)

# สร้าง invalidation
aws cloudfront create-invalidation \
  --distribution-id $DISTRIBUTION_ID \
  --paths "/*"
```

## การอัพเดท Frontend

เมื่อต้องการอัพเดท frontend:

```bash
# วิธีที่ 1: ใช้ script
python deploy-frontend.py

# วิธีที่ 2: Manual
cd kb-engine-fe
npm run build
# จากนั้นทำตามขั้นตอนที่ 3-4 ด้านบน
```

## 📊 Production Infrastructure Details

### Current Deployment
- **S3 Bucket**: `kb-engine-dev-frontend-d4733d1b`
- **CloudFront Distribution**: `E3EEA1YQ19P3VK`
- **CloudFront URL**: https://doottadai0jpy.cloudfront.net
- **Origin Access Identity**: `EHRPBP7TB5PR3`
- **Region**: us-east-1
- **Environment**: dev

### Performance Metrics
- **Build Size**: 77.75 kB JS, 6.94 kB CSS (gzipped)
- **Cache Policy**: CachingOptimized for static assets
- **TLS Version**: 1.2+ enforced
- **Security Headers**: HSTS, X-Frame-Options, X-Content-Type-Options

## การเพิ่ม API Gateway ในภายหลัง

เมื่อทีมหลังบ้านทำ API Gateway เสร็จแล้ว:

1. แก้ไข `terraform/terraform.tfvars`:
   ```hcl
   api_gateway_domain = "api.yourdomain.com"
   api_gateway_stage  = "prod"
   ```

2. Apply การเปลี่ยนแปลง:
   ```bash
   cd terraform
   terraform plan
   terraform apply
   ```

3. ทดสอบ API integration:
   ```bash
   curl https://doottadai0jpy.cloudfront.net/api/health
   ```

## Outputs ที่สำคัญ

หลังจาก deploy เสร็จ จะได้ outputs ดังนี้:

- `cloudfront_url`: URL สำหรับเข้าถึง application
- `cloudfront_domain_name`: CloudFront domain name
- `cloudfront_distribution_id`: ID สำหรับ cache invalidation
- `s3_bucket_name`: ชื่อ S3 bucket สำหรับ upload files
- `s3_bucket_arn`: ARN ของ S3 bucket

## การทดสอบ

### ทดสอบ Infrastructure

```bash
# เข้าถึง CloudFront URL
curl -I https://your-cloudfront-domain.cloudfront.net

# ตรวจสอบ HTTPS redirect
curl -I http://your-cloudfront-domain.cloudfront.net

# ตรวจสอบว่า S3 ถูกบล็อก direct access
curl -I https://your-bucket.s3.amazonaws.com/index.html
# ควรได้ 403 Forbidden
```

### ทดสอบ Frontend

1. เปิด browser ไปที่ CloudFront URL
2. ตรวจสอบว่า application โหลดได้ถูกต้อง
3. ทดสอบ SPA routing (refresh หน้าต่างๆ)
4. ตรวจสอบ console ว่าไม่มี errors

### รัน Property-Based Tests

```bash
# ตั้งค่า environment variables
export TEST_CLOUDFRONT_URL="https://your-cloudfront-domain.cloudfront.net"
export TEST_S3_BUCKET_NAME="your-bucket-name"

# รัน tests
cd tests
python run_tests.py
```

## การลบ Infrastructure

```bash
cd terraform
terraform destroy
```

**คำเตือน:** S3 bucket ที่มี versioning อาจต้องลบ manually

## Troubleshooting

### ปัญหา: Terraform plan ล้มเหลว

```bash
# ตรวจสอบ syntax
terraform validate

# ตรวจสอบ credentials
aws sts get-caller-identity
```

### ปัญหา: Frontend ไม่อัพเดท

```bash
# สร้าง CloudFront invalidation
aws cloudfront create-invalidation \
  --distribution-id YOUR_DISTRIBUTION_ID \
  --paths "/*"

# รอ 5-10 นาที แล้วลองใหม่
```

### ปัญหา: 403 Forbidden

- ตรวจสอบว่า S3 bucket policy ถูกต้อง
- ตรวจสอบว่า CloudFront OAI ถูกสร้างแล้ว
- ตรวจสอบว่าไฟล์ถูก upload ไปยัง S3 แล้ว

### ปัญหา: Build ล้มเหลว

```bash
# ลบ node_modules และติดตั้งใหม่
cd kb-engine-fe
rm -rf node_modules
npm install
npm run build
```

## ค่าใช้จ่าย

- **S3**: ~$0.023/GB/เดือน สำหรับ storage
- **CloudFront**: ~$0.085/GB สำหรับ data transfer (50 GB แรกฟรี)
- **CloudFront Requests**: ~$0.0075/10,000 requests

**ประมาณการ:** สำหรับ application ขนาดเล็ก (~10 MB) กับ traffic ปานกลาง (~1000 users/เดือน) จะอยู่ที่ประมาณ $5-10/เดือน

## Security Best Practices

✅ S3 bucket เป็น private (ไม่สามารถเข้าถึงโดยตรงได้)
✅ HTTPS บังคับใช้ทุก connection
✅ TLS 1.2+ เท่านั้น
✅ Security headers ถูกเพิ่มใน response
✅ Versioning เปิดใช้งานสำหรับ rollback
✅ Encryption at rest (AES256)

## การติดต่อ

หากมีปัญหาหรือคำถาม:
1. ตรวจสอบ CloudWatch Logs
2. ตรวจสอบ CloudTrail สำหรับ API calls
3. ดู Terraform state file สำหรับ resource IDs