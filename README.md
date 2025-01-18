# ChainDocs

Welcome to ChainDocs, a project built during a hackathon to revolutionize how documents are managed, signed, stored, and analyzed using blockchain and AI technology. This application leverages Aptos Move, IPFS, and Gemini AI for a secure, intelligent, and tamper-proof document management experience.

## 📖 Overview

This DApp addresses the challenges of managing documents requiring multi-party signatures while introducing AI-powered insights. By integrating blockchain, IPFS, and AI, the application ensures immutability, transparency, security, and valuable analysis for document handling.

## 🛠 Features

### Blockchain Features
- **Document Creation**: Securely create and store documents.
- **Multi-Signature Verification**: Facilitate trustless signing by multiple parties.
- **IPFS Integration**: Store large document files off-chain while maintaining blockchain security.
- **Transparency**: Retrieve document details, signing status, and approval records.
- **Tamper-Proof Records**: Immutable records backed by blockchain.

### AI-Powered Features
- **Text Extraction**: Automatically extract text from uploaded documents using Gemini AI.
- **Document Analysis**: Get detailed insights, including sentiment analysis, keyword extraction, and summaries of document content.
- **Smart Suggestions**: Recommendations based on the document's content (e.g., missing signatures, suggested edits).

## 💡 Use Cases
- **Legal Agreements**: Store, analyze, and sign contracts securely.
- **Approval Processes**: Manage multi-stakeholder document approvals with AI-driven insights.
- **Financial Records**: Extract key figures and trends for better decision-making.
- **Multi-Signature Requirements**: Trustlessly verify and analyze documents signed by multiple entities.

## 🔗 How It Works

### Document Storage:
Documents are uploaded to IPFS, and their unique hash is stored on the Aptos blockchain.

### AI Analysis:
1. Extract document text using Gemini AI.
2. Perform sentiment analysis, keyword extraction, and other insights.

### Smart Contract Functionalities:
- Initialize a document storage system.
- Allow users to create documents with metadata and signers.
- Enable multi-party signing and track status.

### Blockchain Security:
Provides an immutable ledger for document verification.

## 🧰 Tech Stack

### Frontend
- **React**: Framework for building user interfaces.
- **Vite**: Fast development environment.
- **shadcn/ui + TailwindCSS**: Modern styling for a responsive, professional UI.

### Backend
- **Aptos Move**: Smart contract programming language.
- **IPFS**: Decentralized storage for document files.

### AI Integration
- **Gemini AI**: Advanced document text extraction and analysis.

### Wallet Integration
- **Aptos TS SDK**
- **Aptos Wallet Adapter**

## 🛠 Development Setup

### Prerequisites
- Install Node.js.
- Install Aptos CLI.
- Configure access to Gemini AI API for document analysis.

## Notes:
- VITE_APP_MODULE_NAME: The name of the Aptos Move module.
- VITE_APP_NETWORK: Blockchain network to connect to (testnet or mainnet).
- VITE_APP_MODULE_ADDRESS: The address of the deployed module on the Aptos blockchain.
- VITE_APP_PINATA_API_KEY: API key for Pinata to manage IPFS storage.
- VITE_APP_PINATA_SECRET_API_KEY: Secret API key for Pinata authentication.
- VITE_GEMINI_API_KEY: API key for accessing Gemini AI features.

### Steps to Run
1. Clone the repository:
   ```bash
   git clone <repo-url>
   cd <repo-folder>
    ```
2. Install dependencies:
    ```bash
   npm install
    ```