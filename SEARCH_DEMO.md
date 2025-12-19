# AI-Powered Search Demo

## Overview
The search system now includes AI-powered mock data based on actual files in the `information_data` folder. The system simulates intelligent search with realistic Thai business documents.

## Features Implemented

### 🤖 AI-Powered Search
- **Mock AI Responses**: Generates contextual answers based on search queries
- **Document Matching**: Searches through realistic business documents
- **Keyword Matching**: Intelligent keyword and content matching
- **Relevance Scoring**: Results ranked by relevance

### 📁 Document Categories
- **Incentive (โครงการจูงใจ)**: Employee incentive programs
- **KPI (ตัวชี้วัดผลงาน)**: Performance indicators
- **Training (การอบรม)**: Training and development
- **Insurance (ประกัน)**: Insurance products and policies
- **Credit (สินเชื่อ)**: Loan products and procedures
- **Operation (คู่มือปฏิบัติงาน)**: Operational manuals
- **HR (ทรัพยากรบุคคล)**: HR policies and procedures
- **System (ระบบงาน)**: System guides and procedures

### 🔍 Search Features
- **Auto-suggestions**: Real-time search suggestions
- **Popular searches**: Trending search terms
- **Advanced filters**: Category and file type filtering
- **AI responses**: Contextual answers with related documents
- **Keyword highlighting**: Matched terms highlighted in results

## Sample Search Queries

Try these search terms to see the AI-powered responses:

### Thai Queries
- `incentive สาขา` - Branch incentive programs
- `KPI ตัวชี้วัด` - Performance indicators
- `การอบรม leadership` - Leadership training
- `ประกันวินาศภัย` - Property insurance
- `สินเชื่อรถยนต์` - Car loans
- `E-KYC ระบบใหม่` - New E-KYC system
- `เงินสดย่อย` - Petty cash procedures
- `Career Next` - Career development program

### English Queries
- `incentive` - Will find incentive-related documents
- `training` - Training and development materials
- `insurance` - Insurance products and policies
- `loan` - Credit and loan products

## How It Works

1. **Query Processing**: Search terms are analyzed and matched against document content
2. **AI Response Generation**: Creates contextual answers based on matching documents
3. **Document Ranking**: Results sorted by relevance score
4. **Enhanced Display**: AI responses shown first, followed by related documents

## Mock Data Structure

The system includes realistic documents based on actual file names from:
```
information_data/
├── โจทย์-20251219T021501Z-1-001/
│   └── โจทย์/content/2024/
│       ├── 01/ (January documents)
│       ├── 02/ (February documents)
│       ├── 03/ (March documents)
│       ├── 04/ (April documents)
│       └── 05/ (May documents)
```

## Technical Implementation

### Files Modified/Created:
- `src/services/mockSearchData.js` - AI-powered mock data service
- `src/services/searchService.js` - Enhanced search service with mock integration
- `src/components/SearchBox.js` - Enhanced search box with suggestions
- `src/components/SearchBox.css` - Updated styles for new features
- `src/components/SearchResults.js` - Enhanced results display with AI responses
- `src/components/SearchResults.css` - AI response styling

### Key Features:
- **Realistic Data**: Based on actual Thai business documents
- **AI Simulation**: Generates contextual responses
- **Multi-language Support**: Thai and English search terms
- **Advanced UI**: Modern search interface with suggestions and filters
- **Responsive Design**: Works on all device sizes

## Usage Instructions

1. **Basic Search**: Type any query in the search box
2. **Use Suggestions**: Click on auto-suggestions or popular searches
3. **Apply Filters**: Use category and file type filters
4. **View AI Responses**: AI-generated answers appear first in results
5. **Explore Documents**: Click on document results to view details

The system provides a realistic demonstration of AI-powered enterprise search with Thai language support and business document context.