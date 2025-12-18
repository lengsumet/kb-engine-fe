import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8000';

/**
 * Generate AI answer from search results
 * @param {string} query - User's search query
 * @param {Array} searchResults - Array of search results
 * @returns {Promise<Object>} AI-generated answer with confidence score
 */
export const generateAIAnswer = async (query, searchResults) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/api/ai/generate-answer`, {
      query,
      searchResults: searchResults.slice(0, 5), // Send top 5 results
      options: {
        maxLength: 500,
        includeReferences: true,
        language: 'th'
      }
    });

    return {
      text: response.data.answer,
      confidence: response.data.confidence,
      sources: response.data.sources,
      type: response.data.type
    };
  } catch (error) {
    console.error('Error generating AI answer:', error);
    throw error;
  }
};

/**
 * Send feedback for AI answer
 * @param {string} query - Original query
 * @param {string} answer - AI-generated answer
 * @param {string} feedbackType - 'positive' or 'negative'
 * @param {string} comment - Optional feedback comment
 */
export const sendAIFeedback = async (query, answer, feedbackType, comment = '') => {
  try {
    await axios.post(`${API_BASE_URL}/api/ai/feedback`, {
      query,
      answer,
      feedbackType,
      comment,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error sending feedback:', error);
  }
};

/**
 * Extract key information from documents
 * @param {Array} documentIds - Array of document IDs
 * @returns {Promise<Object>} Extracted information
 */
export const extractDocumentInfo = async (documentIds) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/api/ai/extract-info`, {
      documentIds
    });

    return response.data;
  } catch (error) {
    console.error('Error extracting document info:', error);
    throw error;
  }
};

/**
 * Summarize document content
 * @param {number} documentId - Document ID
 * @param {number} maxLength - Maximum summary length
 * @returns {Promise<string>} Document summary
 */
export const summarizeDocument = async (documentId, maxLength = 200) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/api/ai/summarize`, {
      documentId,
      maxLength,
      language: 'th'
    });

    return response.data.summary;
  } catch (error) {
    console.error('Error summarizing document:', error);
    throw error;
  }
};

/**
 * Get related questions based on current query
 * @param {string} query - Current search query
 * @returns {Promise<Array>} Array of related questions
 */
export const getRelatedQuestions = async (query) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/api/ai/related-questions`, {
      query,
      limit: 5
    });

    return response.data.questions;
  } catch (error) {
    console.error('Error getting related questions:', error);
    return [];
  }
};

export default {
  generateAIAnswer,
  sendAIFeedback,
  extractDocumentInfo,
  summarizeDocument,
  getRelatedQuestions
};