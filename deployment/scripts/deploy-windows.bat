@echo off
echo ========================================
echo KB Engine Frontend Deployment (Windows)
echo ========================================

cd /d "%~dp0..\.."

echo.
echo 📦 Building frontend application...
call npm run build
if %errorlevel% neq 0 (
    echo ❌ Build failed
    pause
    exit /b 1
)

echo.
echo 📤 Getting S3 bucket name...
cd terraform
for /f "tokens=*" %%i in ('terraform output -raw s3_bucket_name') do set BUCKET_NAME=%%i
for /f "tokens=*" %%i in ('terraform output -raw cloudfront_distribution_id') do set DISTRIBUTION_ID=%%i
for /f "tokens=*" %%i in ('terraform output -raw cloudfront_url') do set CLOUDFRONT_URL=%%i

echo Bucket: %BUCKET_NAME%
echo Distribution: %DISTRIBUTION_ID%

cd ..

echo.
echo 📤 Uploading static assets...
aws s3 sync build/ s3://%BUCKET_NAME%/ --delete --cache-control "public, max-age=31536000, immutable" --exclude "index.html" --exclude "service-worker.js"
if %errorlevel% neq 0 (
    echo ❌ Upload failed
    pause
    exit /b 1
)

echo.
echo 📤 Uploading index.html...
aws s3 cp build/index.html s3://%BUCKET_NAME%/ --cache-control "no-cache, no-store, must-revalidate"
if %errorlevel% neq 0 (
    echo ❌ Index upload failed
    pause
    exit /b 1
)

echo.
echo 🔄 Creating CloudFront invalidation...
aws cloudfront create-invalidation --distribution-id %DISTRIBUTION_ID% --paths "/*"
if %errorlevel% neq 0 (
    echo ⚠️ Invalidation failed, but deployment may still work
)

echo.
echo ✅ Deployment completed successfully!
echo 🌐 Your application: %CLOUDFRONT_URL%
echo.
pause