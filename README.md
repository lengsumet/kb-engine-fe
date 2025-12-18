# เงินเทอร์โบ - ระบบฐานความรู้องค์กรอัจฉริยะ

A modern React-based knowledge management system designed for frontline staff at financial institutions. Features hybrid search capabilities combining vector and semantic search to address complex information retrieval challenges.

## 🎯 Problem Statement

This system addresses critical challenges faced by 2,100+ frontline staff:

- **Complex Knowledge Access**: Difficulty accessing diverse information (HR policies, credit policies, IT manuals, operation guides)
- **Search Limitations**: Exact match limitations, no support for slang/colloquial terms
- **Format Blindness**: Cannot read embedded data in images/infographics  
- **Contextual Fragmentation**: Chronological feeds without proper categorization
- **Change Blindness**: Cannot distinguish between old and new document versions

## 🚀 Features

### Core Functionality
- **Hybrid Search**: Vector Search (base) + Semantic Search (enhanced)
- **Multi-format Support**: PDF, images, videos, documents
- **Thai Language Support**: Full Thai language interface and search
- **Smart Categorization**: HR, Credit, IT, Operations, Compliance
- **Version Control**: Track document changes and updates
- **Quick Access**: Category-based navigation for common tasks

### Search Capabilities
- **Natural Language Processing**: Supports conversational queries
- **Contextual Understanding**: Semantic search for related concepts
- **Slang/Colloquial Support**: Understands informal terminology
- **Relevance Scoring**: AI-powered result ranking
- **Advanced Filtering**: Category, file type, date range filters
- **Timeline Search**: Custom date range selection for specific periods
- **Year Comparison**: Compare data between different years (e.g., holidays 2568 vs 2569)
- **Quick Search Actions**: Pre-configured searches for common tasks
- **File Comparison**: Side-by-side document comparison with highlighted differences
- **Word-level Highlighting**: Precise highlighting of added, removed, and modified text
- **AI-Powered Answers**: Intelligent answer generation from document content
- **Related Questions**: Smart suggestions for follow-up queries

### User Experience
- **Responsive Design**: Works on desktop, tablet, and mobile
- **Accessibility**: WCAG compliant interface
- **Voice Search**: Speech-to-text search capability
- **Recent Searches**: Quick access to previous queries
- **Popular Searches**: Trending queries from organization

## 🛠 Technology Stack

- **Frontend**: React 18, React Router
- **Styling**: Custom CSS with modern design system
- **Icons**: Lucide React

- **Language**: Thai/English bilingual support

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd knowledge-base-frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm start
   ```

4. **Open browser**
   Navigate to `http://localhost:3000`

## 🧪 Manual Testing

### Testing Scenarios

#### Search Functionality
1. **Basic Search**
   - Enter "นโยบายการลา" in search box
   - Verify results show HR policy documents
   - Check relevance scores and search type indicators

2. **Filter Testing**
   - Click filter button to open filter panel
   - Select "นโยบาย HR" category
   - Apply date range filter
   - Verify filtered results

3. **Hybrid Search Validation**
   - Search for "ขั้นตอนการอนุมัติ"
   - Verify mix of vector and semantic results
   - Check relevance scoring accuracy

4. **Timeline Search Testing**
   - Open filter panel
   - Select "กำหนดช่วงเวลาเอง" in date range
   - Set start and end dates
   - Verify results within specified timeframe

5. **Year Comparison Testing**
   - Select year 2568 in first dropdown
   - Select year 2569 in second dropdown
   - Search for "วันหยุด"
   - Verify timeline comparison display shows changes between years

6. **Quick Search Actions**
   - Click "เปรียบเทียบวันหยุด" button
   - Verify automatic year comparison search
   - Click "นโยบายใหม่ล่าสุด" button
   - Verify recent policy updates display

7. **File Comparison Testing**
   - Click "เปรียบเทียบไฟล์" in navigation or quick actions
   - Select first file from the list (left side)
   - Select second file from the list (right side)
   - Click "เปรียบเทียบไฟล์" button
   - Verify side-by-side comparison with highlighted differences
   - Test unified view mode
   - Verify word-level highlighting for changes

8. **AI Answer Generation Testing**
   - Search for "นโยบายการลา" or "ขั้นตอนการอนุมัติสินเชื่อ"
   - Verify AI Answer Box appears above search results
   - Check answer quality and confidence score
   - Test feedback buttons (thumbs up/down)
   - Verify related questions appear below results
   - Click on related questions to trigger new searches

#### User Interface
1. **Responsive Design**
   - Test on mobile (375px width)
   - Test on tablet (768px width)
   - Test on desktop (1200px+ width)
   - Verify layout adapts properly

2. **Navigation**
   - Click category cards in quick access
   - Use header navigation menu
   - Test back button functionality
   - Verify breadcrumb navigation

3. **Accessibility**
   - Test keyboard navigation (Tab, Enter, Escape)
   - Verify screen reader compatibility
   - Check color contrast ratios
   - Test with high contrast mode

#### Error Scenarios
1. **No Results**
   - Search for "xyz123nonexistent"
   - Verify helpful error message
   - Check search suggestions display

2. **Network Issues**
   - Simulate slow network
   - Verify loading states
   - Test timeout handling

## 🎨 Design Features

### Visual Design
- **Modern Interface**: Clean, professional appearance
- **Thai Typography**: Sarabun font for optimal Thai text rendering
- **Color System**: Accessible color palette with proper contrast
- **Iconography**: Consistent Lucide React icons

### Interaction Design
- **Smooth Animations**: Subtle transitions and hover effects
- **Loading States**: Clear feedback during operations
- **Progressive Disclosure**: Expandable filters and options
- **Touch-Friendly**: Optimized for mobile interaction

## 🔧 Configuration

### Environment Variables
Create `.env` file for configuration:
```
REACT_APP_API_BASE_URL=http://localhost:8000
REACT_APP_SEARCH_TIMEOUT=5000
REACT_APP_RESULTS_PER_PAGE=20
```

### Search Configuration
- **Vector Search Weight**: 0.6
- **Semantic Search Weight**: 0.4
- **Minimum Relevance Score**: 0.3
- **Max Results**: 50 per query

## 📱 Browser Support

- **Chrome**: 90+
- **Firefox**: 88+
- **Safari**: 14+
- **Edge**: 90+
- **Mobile Safari**: iOS 14+
- **Chrome Mobile**: Android 8+

## 🚀 Deployment

### 🎯 Quick Deploy (แนะนำ)

**PowerShell Script (Windows):**
```powershell
# Deploy ทั้งหมด (Infrastructure + Frontend)
.\deployment\scripts\deploy.ps1

# Deploy เฉพาะ Infrastructure
.\deployment\scripts\deploy.ps1 -InfraOnly

# Deploy เฉพาะ Frontend  
.\deployment\scripts\deploy.ps1 -FrontendOnly

# ดู help
.\deployment\scripts\deploy.ps1 -Help
```

### Manual Commands

**Infrastructure (Terraform):**
```bash
cd terraform
terraform init
terraform plan
terraform apply
```

**Frontend Only:**
```bash
npm run build
python deployment/scripts/deploy-frontend.py
```

### Current Deployment

- **Application URL**: https://d5yzuaybkxsi6.cloudfront.net
- **S3 Bucket**: `kb-engine-fe-dev-frontend-9d8c41f4`
- **CloudFront Distribution**: `EFT7CUIIA5EDH`

### Deployment Documentation

- 📖 **[Deployment Guide](DEPLOYMENT_GUIDE.md)** - Complete deployment instructions
- 🏗️ **[Infrastructure Guide](terraform/README.md)** - Terraform setup and configuration
- 🔧 **[Production Guide](deployment/PRODUCTION.md)** - Production deployment checklist

### AWS Resources Created

- **S3 Bucket** - Static file hosting
- **CloudFront** - Global CDN distribution  
- **CloudWatch Logs** - Application monitoring and logging
- **IAM Roles** - Secure access management

### Prerequisites

- ✅ Node.js v22+ (ปัจจุบัน: v22.17.1)
- ✅ AWS CLI configured
- ✅ Terraform installed
- ✅ Python 3.x

### Monitoring & Logs

```bash
# View application logs
aws logs tail /aws/kb-engine-fe-dev/application --follow

# Get CloudFront URL
cd terraform && terraform output cloudfront_url
```

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/new-feature`)
3. Commit changes (`git commit -am 'Add new feature'`)
4. Push to branch (`git push origin feature/new-feature`)
5. Create Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For technical support or questions:
- Create an issue in the repository
- Contact the development team
- Check the documentation wiki

---

**Built with ❤️ for frontline staff efficiency and productivity**