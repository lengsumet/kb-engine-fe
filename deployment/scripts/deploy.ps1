# KB Engine Frontend Deployment Script (PowerShell)
param(
    [switch]$InfraOnly,
    [switch]$FrontendOnly,
    [switch]$Help
)

if ($Help) {
    Write-Host "KB Engine Deployment Script" -ForegroundColor Green
    Write-Host "Usage:"
    Write-Host "  .\deploy.ps1                # Deploy both infrastructure and frontend"
    Write-Host "  .\deploy.ps1 -InfraOnly     # Deploy infrastructure only"
    Write-Host "  .\deploy.ps1 -FrontendOnly  # Deploy frontend only"
    Write-Host "  .\deploy.ps1 -Help          # Show this help"
    exit 0
}

$ErrorActionPreference = "Stop"
$startLocation = Get-Location

try {
    # Navigate to kb-engine-fe directory
    if (Test-Path "kb-engine-fe") {
        Set-Location "kb-engine-fe"
    } elseif ((Get-Location).Path.EndsWith("kb-engine-fe")) {
        # Already in kb-engine-fe directory
    } else {
        throw "Cannot find kb-engine-fe directory. Run from project root or kb-engine-fe directory."
    }

    Write-Host "========================================" -ForegroundColor Green
    Write-Host "KB Engine Deployment" -ForegroundColor Green
    Write-Host "========================================" -ForegroundColor Green

    # Deploy Infrastructure
    if (-not $FrontendOnly) {
        Write-Host "`n🏗️ Deploying Infrastructure..." -ForegroundColor Yellow
        Set-Location "terraform"
        
        Write-Host "Initializing Terraform..."
        terraform init
        
        Write-Host "Planning deployment..."
        terraform plan -out=tfplan
        
        Write-Host "Applying changes..."
        terraform apply tfplan
        
        Write-Host "✅ Infrastructure deployed!" -ForegroundColor Green
        Set-Location ".."
    }

    # Deploy Frontend
    if (-not $InfraOnly) {
        Write-Host "`n🚀 Deploying Frontend..." -ForegroundColor Yellow
        
        # Build
        Write-Host "Building application..."
        npm run build
        
        # Get Terraform outputs
        Set-Location "terraform"
        $bucketName = terraform output -raw s3_bucket_name
        $distributionId = terraform output -raw cloudfront_distribution_id
        $cloudfrontUrl = terraform output -raw cloudfront_url
        Set-Location ".."
        
        Write-Host "Bucket: $bucketName"
        Write-Host "Distribution: $distributionId"
        
        # Upload to S3
        Write-Host "Uploading static assets..."
        aws s3 sync build/ "s3://$bucketName/" --delete --cache-control "public, max-age=31536000, immutable" --exclude "index.html" --exclude "service-worker.js"
        
        Write-Host "Uploading index.html..."
        aws s3 cp build/index.html "s3://$bucketName/" --cache-control "no-cache, no-store, must-revalidate"
        
        # Invalidate CloudFront
        Write-Host "Creating CloudFront invalidation..."
        aws cloudfront create-invalidation --distribution-id $distributionId --paths "/*"
        
        Write-Host "✅ Frontend deployed!" -ForegroundColor Green
        Write-Host "🌐 Application URL: $cloudfrontUrl" -ForegroundColor Cyan
    }

    Write-Host "`n🎉 Deployment completed successfully!" -ForegroundColor Green

} catch {
    Write-Host "❌ Deployment failed: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
} finally {
    Set-Location $startLocation
}