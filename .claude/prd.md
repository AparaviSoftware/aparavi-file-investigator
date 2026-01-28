# Product Requirements Document

## Aparavi File Investigator

---

## Overview

The Aparavi File Investigator is a web-based chat interface that enables users to query and explore large, complex document datasets using natural language. The application connects to Aparavi's data pipeline webhooks to process questions and return relevant information from declassified document collections.

---

## Problem Statement

Large document archives (government records, historical files, research datasets) contain valuable information but are difficult to navigate. Traditional search requires knowing exact terms and manually reading documents. Users need an intuitive way to ask questions in natural language and receive synthesized answers from these datasets.

---

## Target Users

- **Researchers** — Investigating historical events, seeking specific facts or connections
- **Journalists** — Researching stories, fact-checking, finding primary sources
- **General Public** — Curious individuals exploring declassified documents
- **Analysts** — Looking for patterns or relationships across large document sets

---

## Datasets

| Dataset | Description | Document Count |
|---------|-------------|----------------|
| Epstein | Jeffrey Epstein case documents | 900+ |
| JFK | JFK assassination declassified files | 2,900+ |
| UFO | UAP/UFO government documents | 1,700+ |

---

## Core Features

### 1. Natural Language Chat Interface
- Users type questions in plain English
- System processes queries through Aparavi pipeline
- Responses displayed with markdown formatting
- Conversation history maintained per session

### 2. Multi-Dataset Support
- Home page displays available datasets
- Each dataset has dedicated chat interface
- Dataset-specific suggested questions
- Isolated conversation history per dataset

### 3. Conversation Persistence
- Chat history saved to browser LocalStorage
- Conversations persist across page refreshes
- Clear conversation option available
- Per-dataset isolation

### 4. Message Actions
- **Copy** — Copy message content to clipboard
- **Edit** — Modify and resubmit user messages
- **Regenerate** — Re-ask the same question for a new response

### 5. Query Limits
- 25 queries per conversation session
- Visual counter showing remaining queries
- Toast notification when limit reached
- Encourages focused, thoughtful questions

### 6. Rate Limiting
- 100 requests per 15-minute window per user
- Browser fingerprinting for user identification
- Prevents abuse while allowing legitimate use

---

## Functional Requirements

### FR-1: Dataset Selection
- Display dataset cards on home page
- Show dataset name, description, and document count
- Navigate to dataset-specific chat on selection

### FR-2: Chat Input
- Text input field for user questions
- Submit button and keyboard shortcut (Enter)
- Clear input button
- Query counter display

### FR-3: Message Display
- Render user and assistant messages
- Support markdown formatting in responses
- Show loading indicator during processing
- Display timestamps on messages

### FR-4: Suggested Questions
- Show pre-populated questions per dataset
- Questions disappear after chat starts
- Clicking suggestion submits as query

### FR-5: Error Handling
- Display user-friendly error messages
- Handle network failures gracefully
- Show timeout messages for slow responses
- Guide users on CORS issues (development)

### FR-6: Conversation Management
- Save conversations to LocalStorage
- Load previous conversation on page load
- Clear conversation with confirmation
- Track edit and regeneration history

---

## Non-Functional Requirements

### NFR-1: Performance
- Response time < 5 minutes (webhook timeout)
- Frontend loads in < 3 seconds
- Smooth animations and transitions

### NFR-2: Security
- No sensitive data in frontend code
- API keys stored server-side only
- CORS restricted to configured origins
- Rate limiting prevents abuse

### NFR-3: Reliability
- Graceful degradation on API failures
- LocalStorage fallback for persistence
- Error boundaries prevent full app crashes

### NFR-4: Usability
- Mobile-responsive design
- Clear visual hierarchy
- Intuitive navigation
- Accessible UI components

### NFR-5: Scalability
- Stateless backend design
- Support for additional datasets via config
- Lambda-ready architecture for serverless deployment

---

## User Flows

### Flow 1: New User Query
```
1. User lands on home page
2. User selects a dataset (e.g., JFK)
3. Chat page loads with hero banner and suggested questions
4. User types question or clicks suggested question
5. Loading indicator appears
6. Response displays with markdown formatting
7. User can continue conversation or ask new questions
```

### Flow 2: Returning User
```
1. User navigates to previously used dataset
2. Previous conversation loads from LocalStorage
3. User continues where they left off
4. Or clears conversation to start fresh
```

### Flow 3: Edit and Regenerate
```
1. User reviews previous message
2. User clicks edit on their message
3. Input populates with original text
4. User modifies and resubmits
5. New response generated for edited question
```

---

## Success Metrics

| Metric | Target |
|--------|--------|
| Average queries per session | > 5 |
| Session duration | > 3 minutes |
| Return user rate | > 30% |
| Query success rate | > 95% |
| Error rate | < 2% |

---

## Future Considerations

- **Source Citations** — Link responses to specific documents
- **Export Conversations** — Download chat history as PDF/text
- **Bookmarking** — Save interesting responses for later
- **Cross-Dataset Search** — Query across multiple datasets
- **User Accounts** — Persistent history across devices
- **Advanced Filters** — Date ranges, document types, etc.
- **Sharing** — Share interesting findings via URL

---

## Technical Constraints

- Webhook response time up to 5 minutes
- Browser LocalStorage limit (~5MB)
- Rate limit: 100 requests per 15 minutes
- Query limit: 25 per conversation session
- Supported browsers: Modern evergreen browsers (Chrome, Firefox, Safari, Edge)
