

// // @auditimport React, { useState, useEffect } from 'react';
// import { useWallet } from "@aptos-labs/wallet-adapter-react";
// import { aptosClient } from "@/utils/aptosClient";
// import { InputTransactionData } from "@aptos-labs/wallet-adapter-react";
// import axios from 'axios';
// import { motion, AnimatePresence } from 'framer-motion';
// import { WalletSelector } from "./WalletSelector";
// import { useNavigate } from 'react-router-dom';
// import { GoogleGenerativeAI } from "@google/generative-ai";
// // import { Alert, AlertDescription } from '@/components/ui/alert';
// import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
// import { Button } from '@/components/ui/button';
// import * as Tabs from '@radix-ui/react-tabs';
// import * as Dialog from '@radix-ui/react-dialog';
// import * as Label from '@radix-ui/react-label';
// import { Plus, Share2, Eye, Loader2, X } from 'lucide-react';
// import { useState,useEffect } from "react";

// const genAI = new GoogleGenerativeAI(process.env.VITE_GEMINI_API_KEY);
// const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

// interface Signature {
//   signer: string;
//   timestamp: string;
// }

// interface Document {
//   id: number;
//   content_hash: string;
//   creator: string;
//   signers: string[];
//   signatures: Signature[];
//   is_completed: boolean;
// }

// //4
// const AIDocumentAnalysis = ({ documentHash }) => {
//   // const [analysis, setAnalysis] = useState(null);
//   // const [error, setError] = useState(null);
//   // const [documentContent, setDocumentContent] = useState(null);
//   const [error, setError] = useState<string | null>(null);
// const [documentContent, setDocumentContent] = useState<string | null>(null);
// const [analysis, setAnalysis] = useState<string | null>(null);
//   const [loading, setLoading] = useState(false);

 
//   useEffect(() => {
//     const script = document.createElement('script');
//     script.src = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js';
//     script.async = true;
//     document.body.appendChild(script);
//     return () => {
//       document.body.removeChild(script);
//     };
//   }, []);

//   // Function to extract text from PDF
//   const extractPDFContent = async (arrayBuffer: ArrayBuffer) => {
//     try {
//       const pdfjsLib = window['pdfjs-dist/build/pdf'];
//       pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
      
//       const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
//       const pdf = await loadingTask.promise;
      
//       let textContent = '';
      
//       // Extract text from all pages
//       for (let i = 1; i <= pdf.numPages; i++) {
//         const page = await pdf.getPage(i);
//         const content = await page.getTextContent();
//         const strings = content.items.map(item => item.str);
//         textContent += strings.join(' ') + '\n';
//       }
      
//       return textContent;
//     } catch (error) {
//       console.error('Error parsing PDF:', error);
//       throw new Error('Failed to extract text from PDF');
//     }
//   };

//   const fetchDocumentContent = async (hash : string) => {
//     try {
//       const url = `https://gateway.pinata.cloud/ipfs/${hash}`;
//       const response = await axios.get(url, { 
//         responseType: 'arraybuffer'  // Important: get as array buffer for PDF parsing
//       });
      
//       // Extract text content from PDF
//       const textContent = await extractPDFContent(response.data);
//       return textContent;
//     } catch (error) {
//       console.error("Error fetching document:", error);
//       throw new Error('Failed to fetch and parse document content');
//     }
//   };

//   const analyzeDocument = async (content : string) => {
//     if (!content) {
//       throw new Error('No document content available');
//     }

//     try {
//       // Truncate content if too long (Gemini has token limits)
//       const truncatedContent = content.slice(0, 30000); // Adjust limit as needed

//       const prompt = `Please analyze the following document content and provide:
//         1. Document type assessment
//         2. Risk analysis
//         3. Suggested improvements
//         4. Best practices for this type of document

//         Document Content:
//         ${truncatedContent}`;

//       const result = await model.generateContent(prompt);
//       return result.response.text();
//     } catch (error) {
//       console.error("Error analyzing document:", error);
//       throw error;
//     }
//   };

//   const handleAnalyze = async () => {
//     if (!documentHash) {
//       setError('Please select a document to analyze first');
//       return;
//     }

//     setLoading(true);
//     setError(null);
    
//     try {
//       // First fetch and parse the document content
//       const content = await fetchDocumentContent(documentHash);
//       setDocumentContent(content);
      
//       // Then analyze the actual content
//       const analysisResult = await analyzeDocument(content);
//       setAnalysis(analysisResult);
//     } catch (err) {
//       setError(err.message || 'Failed to analyze document. Please try again.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="space-y-6">
//       <div className="flex justify-between items-center">
//         <h2 className="text-2xl font-bold text-white">AI Document Analysis</h2>
//         <Button 
//           onClick={handleAnalyze}
//           disabled={!documentHash || loading}
//           className="bg-blue-600 hover:bg-blue-700"
//         >
//           {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Analyze Document'}
//         </Button>
//       </div>

//       {error && (
//         <div className="bg-red-500/10 border border-red-500 text-red-500 px-4 py-3 rounded">
//           {error}
//         </div>
//       )}

//       {!documentHash && (
//         <Card className="bg-gray-800 text-white">
//           <CardContent className="pt-6">
//             <p>Please select a document from Your Documents tab to analyze.</p>
//           </CardContent>
//         </Card>
//       )}

//       {documentContent && (
//         <Card className="bg-gray-800 text-white">
//           <CardHeader>
//             <CardTitle>Extracted Document Content</CardTitle>
//           </CardHeader>
//           <CardContent>
//             <div className="whitespace-pre-wrap max-h-40 overflow-y-auto text-sm">
//               {documentContent}
//             </div>
//           </CardContent>
//         </Card>
//       )}

//       {analysis && (
//         <Card className="bg-gray-800 text-white">
//           <CardHeader>
//             <CardTitle>Analysis Results</CardTitle>
//           </CardHeader>
//           <CardContent>
//             <div className="whitespace-pre-wrap">{analysis}</div>
//           </CardContent>
//         </Card>
//       )}
//     </div>
//   );
// };




// export const ContractManagement: React.FC = () => {
//   const { account, signAndSubmitTransaction } = useWallet();
//   const [documents, setDocuments] = useState<Document[]>([]);
//   const [pendingDocuments, setPendingDocuments] = useState<Document[]>([]);
//   const [isModalVisible, setIsModalVisible] = useState(false);
//   const [file, setFile] = useState<File | null>(null);
//   const [signers, setSigners] = useState("");
//   const [transactionInProgress, setTransactionInProgress] = useState(false);
//   const [viewDocumentUrl, setViewDocumentUrl] = useState<string | null>(null);
//   const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);
//   const moduleAddress = process.env.VITE_APP_MODULE_ADDRESS;
//   const moduleName = process.env.VITE_APP_MODULE_NAME;
//   const navigate = useNavigate();

//   useEffect(() => {
//     if (account) {
//       fetchDocuments();
//       fetchPendingDocuments();
//     }
//   }, [account]);

//   const fetchDocuments = async () => {
//     if (!account) return;
//     try {
//       const response = await aptosClient().view<[Document]>({
//         payload: {
//           function: `${moduleAddress}::${moduleName}::get_all_documents`,
//           typeArguments: [],
//           functionArguments: [],
//         }
//       });
//       if (Array.isArray(response) && response.length > 0) {
//         const userDocuments = response[0].filter(
//           doc => doc.creator === account.address
//         );
//         setDocuments(userDocuments);
//       } else {
//         setDocuments([]);
//       }
//     } catch (error) {
//       console.error("Error fetching documents:", error);
//     }
//   };

//   const fetchPendingDocuments = async () => {
//     if (!account) return;
//     try {
//       const response = await aptosClient().view<Document[]>({
//         payload: {
//           function: `${moduleAddress}::${moduleName}::get_all_documents`,
//           typeArguments: [],
//           functionArguments: [],
//         }
//       });

//       if (Array.isArray(response) && response.length > 0) {
//         const pendingDocs = response[0].filter(doc => 
//           doc.signers.includes(account.address) && 
//           !doc.signatures.some(sig => sig.signer === account.address) &&
//           !doc.is_completed
//         );
//         setPendingDocuments(pendingDocs);
//       } else {
//         setPendingDocuments([]);
//       }
//     } catch (error) {
//       console.error("Error fetching pending documents:", error);
//     }
//   };

//   const uploadToPinata = async (file: File) => {
//     const url = "https://api.pinata.cloud/pinning/pinFileToIPFS";

//     let formData = new FormData();
//     formData.append('file', file);
//     const metadata = JSON.stringify({
//       name: 'Property Image',
//     });
//     formData.append('pinataMetadata', metadata);
//     const options = JSON.stringify({
//       cidVersion: 0,
//     });
//     formData.append('pinataOptions', options);

//     try {
//       const res = await axios.post(url, formData, {
//         headers: {
//           'pinata_api_key': process.env.VITE_APP_PINATA_API_KEY,
//           'pinata_secret_api_key': process.env.VITE_APP_PINATA_SECRET_API_KEY,
//           "Content-Type": "multipart/form-data"
//         },
//       });
//       return res.data.IpfsHash;
//     } catch (error) {
//       console.error("Error uploading to Pinata:", error);
//       throw error;
//     }
//   };

//   const handleCreateDocument = async () => {
//     if (!account || !file || !signers) return;
//     setTransactionInProgress(true);
//     try {
//       const cid = await uploadToPinata(file);
//       const signerAddresses = signers.split(',').map(addr => addr.trim());
//       const payload: InputTransactionData = {
//         data: {
//           function: `${moduleAddress}::${moduleName}::create_document`,
//           functionArguments: [cid, signerAddresses],
//         }
//       };
//       await signAndSubmitTransaction(payload);
//       setIsModalVisible(false);
//       setFile(null);
//       setSigners("");
//       fetchDocuments();
//     } catch (error) {
//       console.error("Error creating document:", error);
//     } finally {
//       setTransactionInProgress(false);
//     }
//   };

//   const handleShare = (docId: number) => {
//     const signingLink = `${window.location.origin}/sign/${docId}`;
//     navigator.clipboard.writeText(signingLink).then(() => {
//       alert('Signing link copied to clipboard!');
//     }, (err) => {
//       console.error('Could not copy text: ', err);
//     });
//   };

//   const handleViewDocument = async (doc: Document) => {
//     try {
//       const url = `https://gateway.pinata.cloud/ipfs/${doc.content_hash}`;
//       const response = await axios.get(url, { responseType: 'blob' });
//       const blob = new Blob([response.data], { type: response.headers['content-type'] });
//       const objectUrl = URL.createObjectURL(blob);
//       setViewDocumentUrl(objectUrl);
//       setSelectedDocument(doc);
//     } catch (error) {
//       console.error("Error fetching document:", error);
//       alert("Failed to fetch the document. Please try again.");
//     }
//   };

//   const renderDocumentCard = (doc: Document, isPending: boolean) => (
//     <motion.div
//       initial={{ opacity: 0, y: 20 }}
//       animate={{ opacity: 1, y: 0 }}
//       exit={{ opacity: 0, y: -20 }}
//       transition={{ duration: 0.3 }}
//       className="bg-gray-800 rounded-lg shadow-lg p-6 text-white"
//     >
//       <h3 className="text-xl font-semibold mb-2">{doc.is_completed ? 'Completed' : 'Pending'}</h3>
//       <p className="mb-4">Signatures: {doc.signatures.length}/{doc.signers.length}</p>
//       <div className="flex space-x-2">
//         <button
//           onClick={() => handleViewDocument(doc)}
//           className="flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
//         >
//           <Eye className="mr-2 h-4 w-4" /> View
//         </button>
//         {isPending ? (
//           <button
//             onClick={() => navigate(`/sign/${doc.id}`)}
//             className="flex items-center justify-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
//           >
//             Sign Document
//           </button>
//         ) : (
//           <button
//             onClick={() => handleShare(doc.id)}
//             className="flex items-center justify-center px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors"
//           >
//             <Share2 className="mr-2 h-4 w-4" /> Share
//           </button>
//         )}
//       </div>
//     </motion.div>
//   );

//   return (
//     <div className="container mx-auto px-4 py-8 bg-gray-900 text-white min-h-screen">
//       <div className="flex justify-between items-center mb-8">
//         <h1 className="text-3xl font-bold">ChainDocs Dashboard</h1>
//         <div className="flex items-center gap-4">
//           <button
//             onClick={() => setIsModalVisible(true)}
//             className="flex items-center justify-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
//           >
//             <Plus className="mr-2 h-4 w-4" /> Create Document
//           </button>
//           <WalletSelector />
//         </div>
//       </div>

//       <Tabs.Root defaultValue="your-documents" className="flex flex-col">
//         <Tabs.List className="flex border-b border-gray-700 mb-4" aria-label="Manage your documents">
//           <Tabs.Trigger
//             value="your-documents"
//             className="px-4 py-2 text-sm font-medium text-gray-400 hover:text-white focus:outline-none focus:text-white border-b-2 border-transparent focus:border-white"
//           >
//             Your Documents
//           </Tabs.Trigger>
//           <Tabs.Trigger
//             value="pending-signatures"
//             className="px-4 py-2 text-sm font-medium text-gray-400 hover:text-white focus:outline-none focus:text-white border-b-2 border-transparent focus:border-white"
//           >
//             Pending Signatures
//           </Tabs.Trigger>
//           <Tabs.Trigger
//             value="ai-analysis"
//             className="px-4 py-2 text-sm font-medium text-gray-400 hover:text-white focus:outline-none focus:text-white border-b-2 border-transparent focus:border-white"
//           >
//             AI Analysis
//           </Tabs.Trigger>
//         </Tabs.List>

//         <Tabs.Content value="ai-analysis">
//   <AIDocumentAnalysis 
//     documentHash={selectedDocument?.content_hash || null}
//   />
// </Tabs.Content>



//         <Tabs.Content value="your-documents">
//           <AnimatePresence>
//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
//               {documents.map(doc => renderDocumentCard(doc, false))}
//             </div>
//           </AnimatePresence>
//         </Tabs.Content>

//         <Tabs.Content value="pending-signatures">
//           <AnimatePresence>
//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
//               {pendingDocuments.map(doc => renderDocumentCard(doc, true))}
//             </div>
//           </AnimatePresence>
//         </Tabs.Content>

//         <Tabs.Content value="ai-analysis">
//           <AIDocumentAnalysis 
//             documentContent={selectedDocument?.content_hash || null}
//           />
//         </Tabs.Content>
//       </Tabs.Root>

//       <Dialog.Root open={isModalVisible} onOpenChange={setIsModalVisible}>
//         <Dialog.Portal>
//           <Dialog.Overlay className="fixed inset-0 bg-black bg-opacity-50" />
//           <Dialog.Content className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-gray-800 rounded-lg p-6 w-full max-w-md">
//             <Dialog.Title className="text-xl font-semibold mb-4">Create New Document</Dialog.Title>
//             <div className="space-y-4">
//               <div>
//                 <Label.Root htmlFor="file" className="block text-sm font-medium mb-1">
//                   File
//                 </Label.Root>
//                 <input
//                   id="file"
//                   type="file"
//                   onChange={(e) => {
//                     const file = e.target.files?.[0];
//                     if (file && file.size / 1024 / 1024 < 25) {
//                       setFile(file);
//                     } else {
//                       alert('File must be smaller than 25MB!');
//                     }
//                   }}
//                   className="w-full px-3 py-2 bg-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
//               </div>
//               <div>
//                 <Label.Root htmlFor="signers" className="block text-sm font-medium mb-1">
//                   Signers
//                 </Label.Root>
//                 <input
//                   id="signers"
//                   type="text"
//                   placeholder="Enter signer addresses (comma-separated)"
//                   value={signers}
//                   onChange={(e) => setSigners(e.target.value)}
//                   className="w-full px-3 py-2 bg-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
//               </div>
//             </div>
//             <div className="mt-6 flex justify-end">
//               <button
//                 onClick={handleCreateDocument}
//                 disabled={transactionInProgress}
//                 className="flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
//               >
//                 {transactionInProgress ? (
//                   <>
//                     <Loader2 className="mr-2 h-4 w-4 animate-spin" />
//                     Creating...
//                   </>
//                 ) : (
//                   'Create Document'
//                 )}
//               </button>
//             </div>
//             <Dialog.Close asChild>
//               <button
//                 className="absolute top-2 right-2 p-1 rounded-full text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-white"
//                 aria-label="Close"
//               >
//                 <X className="h-4 w-4" />
//               </button>
//             </Dialog.Close>
//           </Dialog.Content>
//         </Dialog.Portal>
//       </Dialog.Root>

//       <Dialog.Root open={!!viewDocumentUrl} onOpenChange={() => setViewDocumentUrl(null)}>
//         <Dialog.Portal>
//           <Dialog.Overlay className="fixed inset-0 bg-black bg-opacity-50" />
//           <Dialog.Content className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-gray-800 rounded-lg p-6 w-full max-w-3xl h-[80vh] flex flex-col">
//             <Dialog.Title className="text-xl font-semibold mb-4">View Document</Dialog.Title>
//             {viewDocumentUrl && (
//               <iframe
//                 src={viewDocumentUrl}
//                 className="w-full flex-grow border-none"
//                 title="Document Viewer" />
//             )}
//             <Dialog.Close asChild>
//               <button
//                 className="absolute top-2 right-2 p-1 rounded-full text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-white"
//                 aria-label="Close"
//               >
//                 <X className="h-4 w-4" />
//               </button>
//             </Dialog.Close>
//           </Dialog.Content>
//         </Dialog.Portal>
//       </Dialog.Root>
//     </div>
//   );
// };

// export default ContractManagement;















// import * as pdfjsLib from 'pdfjs-dist/build/pdf';

import React, { useState, useEffect } from 'react';
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { aptosClient } from "@/utils/aptosClient";
import { InputTransactionData } from "@aptos-labs/wallet-adapter-react";
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { WalletSelector } from "./WalletSelector";
import { useNavigate } from 'react-router-dom';
import { GoogleGenerativeAI } from "@google/generative-ai";
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import * as Tabs from '@radix-ui/react-tabs';
import * as Dialog from '@radix-ui/react-dialog';
import * as Label from '@radix-ui/react-label';
import { Plus, Share2, Eye, Loader2, X } from 'lucide-react';

const genAI = new GoogleGenerativeAI(process.env.VITE_GEMINI_API_KEY || 'default_api_key');
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

interface Signature {
  signer: string;
  timestamp: string;
}

interface Document {
  id: number;
  content_hash: string;
  creator: string;
  signers: string[];
  signatures: Signature[];
  is_completed: boolean;
}

interface AIDocumentAnalysisProps {
  documentHash: string | null;
}

const AIDocumentAnalysis: React.FC<AIDocumentAnalysisProps> = ({ documentHash }) => {
  const [error, setError] = useState<string | null>(null);
  const [documentContent, setDocumentContent] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js';
    script.async = true;
    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  // const extractPDFContent = async (arrayBuffer: ArrayBuffer): Promise<string> => {
  //   try {
  //     // const pdfjsLib = window['pdfjs-dist/build/pdf'];
  //     const pdfjsLib = window['pdfjs-dist/build/pdf'] as any;

  //     // const pdfjsLib = window['pdfjs-dist/build/pdf'] as typeof import('pdfjs-dist/build/pdf');
  //     pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
      
  //     const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
  //     const pdf = await loadingTask.promise;
      
  //     let textContent = '';
      
  //     for (let i = 1; i <= pdf.numPages; i++) {
  //       const page = await pdf.getPage(i);
  //       const content = await page.getTextContent();
  //       const strings = content.items.map((item: { str: string }) => item.str);
  //       textContent += strings.join(' ') + '\n';
  //     }
      
  //     return textContent;
  //   } catch (error) {
  //     console.error('Error parsing PDF:', error);
  //     throw new Error('Failed to extract text from PDF');
  //   }
  // };

  const extractPDFContent = async (arrayBuffer: ArrayBuffer): Promise<string> => {
    try {
      const pdfjsLib = window['pdfjs-dist/build/pdf'] as any; // Use 'any' temporarily
      pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
      
      const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
      const pdf = await loadingTask.promise;
      
      let textContent = '';
      
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const content = await page.getTextContent();
        const strings = content.items.map((item: { str: string }) => item.str);
        textContent += strings.join(' ') + '\n';
      }
      
      return textContent;
    } catch (error) {
      console.error('Error parsing PDF:', error);
      throw new Error('Failed to extract text from PDF');
    }
  };


  const fetchDocumentContent = async (hash: string): Promise<string> => {
    try {
      const url = `https://gateway.pinata.cloud/ipfs/${hash}`;
      const response = await axios.get(url, { 
        responseType: 'arraybuffer'
      });
      
      const textContent = await extractPDFContent(response.data);
      return textContent;
    } catch (error) {
      console.error("Error fetching document:", error);
      throw new Error('Failed to fetch and parse document content');
    }
  };

  const analyzeDocument = async (content: string): Promise<string> => {
    if (!content) {
      throw new Error('No document content available');
    }

    try {
      const truncatedContent = content.slice(0, 30000);
      const prompt = `Please analyze the following document content and provide:
        1. Document type assessment
        2. Risk analysis
        3. Suggested improvements
        4. Best practices for this type of document

        Document Content:
        ${truncatedContent}`;

      const result = await model.generateContent(prompt);
      return result.response.text();
    } catch (error) {
      console.error("Error analyzing document:", error);
      throw error;
    }
  };

  const handleAnalyze = async () => {
    if (!documentHash) {
      setError('Please select a document to analyze first');
      return;
    }

    setLoading(true);
    setError(null);
    
    try {
      const content = await fetchDocumentContent(documentHash);
      setDocumentContent(content);
      
      const analysisResult = await analyzeDocument(content);
      setAnalysis(analysisResult);
    } catch (err: any) {
      setError(err.message || 'Failed to analyze document. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white">AI Document Analysis</h2>
        <Button 
          onClick={handleAnalyze}
          disabled={!documentHash || loading}
          className="bg-blue-600 hover:bg-blue-700"
        >
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Analyze Document'}
        </Button>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500 text-red-500 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {!documentHash && (
        <Card className="bg-gray-800 text-white">
          <CardContent className="pt-6">
            <p>Please select a document from Your Documents tab to analyze.</p>
          </CardContent>
        </Card>
      )}

      {documentContent && (
        <Card className="bg-gray-800 text-white">
          <CardHeader>
            <CardTitle>Extracted Document Content</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="whitespace-pre-wrap max-h-40 overflow-y-auto text-sm">
              {documentContent}
            </div>
          </CardContent>
        </Card>
      )}

      {analysis && (
        <Card className="bg-gray-800 text-white">
          <CardHeader>
            <CardTitle>Analysis Results</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="whitespace-pre-wrap">{analysis}</div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export const ContractManagement: React.FC = () => {
  const { account, signAndSubmitTransaction } = useWallet();
  const [documents, setDocuments] = useState<Document[]>([]);
  const [pendingDocuments, setPendingDocuments] = useState<Document[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [signers, setSigners] = useState("");
  const [transactionInProgress, setTransactionInProgress] = useState(false);
  const [viewDocumentUrl, setViewDocumentUrl] = useState<string | null>(null);
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);
  const moduleAddress = process.env.VITE_APP_MODULE_ADDRESS;
  const moduleName = process.env.VITE_APP_MODULE_NAME;
  const navigate = useNavigate();

  useEffect(() => {
    if (account) {
      fetchDocuments();
      fetchPendingDocuments();
    }
  }, [account]);

  // const fetchDocuments = async () => {
  //   if (!account) return;
  //   try {
  //     const response = await aptosClient().view<[Document]>({
  //       payload: {
  //         function: `${moduleAddress}::${moduleName}::get_all_documents`,
  //         typeArguments: [],
  //         functionArguments: [],
  //       }
  //     });
  //     if (Array.isArray(response) && response.length > 0) {
  //       const userDocuments = response[0].filter(
  //         (doc: Document) => doc.creator === account.address
  //       );
  //       setDocuments(userDocuments);
  //     } else {
  //       setDocuments([]);
  //     }
  //   } catch (error) {
  //     console.error("Error fetching documents:", error);
  //   }
  // };

  // const fetchPendingDocuments = async () => {
  //   if (!account) return;
  //   try {
  //     const response = await aptosClient().view<Document[]>({
  //       payload: {
  //         function: `${moduleAddress}::${moduleName}::get_all_documents`,
  //         typeArguments: [],
  //         functionArguments: [],
  //       }
  //     });

  //     if (Array.isArray(response) && response.length > 0) {
  //       const pendingDocs = response[0].filter((doc: Document) => 
  //         doc.signers.includes(account.address) && 
  //         !doc.signatures.some((sig: Signature) => sig.signer === account.address) &&
  //         !doc.is_completed
  //       );
  //       setPendingDocuments(pendingDocs);
  //     } else {
  //       setPendingDocuments([]);
  //     }
  //   } catch (error) {
  //     console.error("Error fetching pending documents:", error);
  //   }
  // };

  const fetchDocuments = async () => {
    if (!account) return;
    try {
      const response = await aptosClient().view<Document[]>({
        payload: {
          function: `${moduleAddress}::${moduleName}::get_all_documents`,
          typeArguments: [],
          functionArguments: [],
        }
      });
      if (Array.isArray(response) && response.length > 0) {
        const userDocuments = response.filter(
          (doc: Document) => doc.creator === account.address
        );
        setDocuments(userDocuments);
      } else {
        setDocuments([]);
      }
    } catch (error) {
      console.error("Error fetching documents:", error);
    }
  };
 
 
 
  const fetchPendingDocuments = async () => {
    if (!account) return;
    try {
      const response = await aptosClient().view<Document[]>({
        payload: {
          function: `${moduleAddress}::${moduleName}::get_all_documents`,
          typeArguments: [],
          functionArguments: [],
        }
      });
  
      if (Array.isArray(response) && response.length > 0) {
        const pendingDocs = response.filter((doc: Document) => 
          doc.signers.includes(account.address) && 
          !doc.signatures.some((sig: Signature) => sig.signer === account.address) &&
          !doc.is_completed
        );
        setPendingDocuments(pendingDocs);
      } else {
        setPendingDocuments([]);
      }
    } catch (error) {
      console.error("Error fetching pending documents:", error);
    }
  };

  const uploadToPinata = async (file: File): Promise<string> => {
    const url = "https://api.pinata.cloud/pinning/pinFileToIPFS";

    let formData = new FormData();
    formData.append('file', file);
    const metadata = JSON.stringify({
      name: 'Property Image',
    });
    formData.append('pinataMetadata', metadata);
    const options = JSON.stringify({
      cidVersion: 0,
    });
    formData.append('pinataOptions', options);

    try {
      const res = await axios.post(url, formData, {
        headers: {
          'pinata_api_key': process.env.VITE_APP_PINATA_API_KEY,
          'pinata_secret_api_key': process.env.VITE_APP_PINATA_SECRET_API_KEY,
          "Content-Type": "multipart/form-data"
        },
      });
      return res.data.IpfsHash;
    } catch (error) {
      console.error("Error uploading to Pinata:", error);
      throw error;
    }
  };

  const handleCreateDocument = async () => {
    if (!account || !file || !signers) return;
    setTransactionInProgress(true);
    try {
      const cid = await uploadToPinata(file);
      const signerAddresses = signers.split(',').map(addr => addr.trim());
      const payload: InputTransactionData = {
        data: {
          function: `${moduleAddress}::${moduleName}::create_document`,
          functionArguments: [cid, signerAddresses],
        }
      };
      await signAndSubmitTransaction(payload);
      setIsModalVisible(false);
      setFile(null);
      setSigners("");
      fetchDocuments();
    } catch (error) {
      console.error("Error creating document:", error);
    } finally {
      setTransactionInProgress(false);
    }
  };

  const handleShare = (docId: number) => {
    const signingLink = `${window.location.origin}/sign/${docId}`;
    navigator.clipboard.writeText(signingLink).then(() => {
      alert('Signing link copied to clipboard!');
    }, (err) => {
      console.error('Could not copy text: ', err);
    });
  };

  const handleViewDocument = async (doc: Document) => {
    try {
      const url = `https://gateway.pinata.cloud/ipfs/${doc.content_hash}`;
      const response = await axios.get(url, { responseType: 'blob' });
      const blob = new Blob([response.data], { type: response.headers['content-type'] });
      const objectUrl = URL.createObjectURL(blob);
      setViewDocumentUrl(objectUrl);
      setSelectedDocument(doc);
    } catch (error) {
      console.error("Error fetching document:", error);
      alert("Failed to fetch the document. Please try again.");
    }
  };

  const renderDocumentCard = (doc: Document, isPending: boolean) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="bg-gray-800 rounded-lg shadow-lg p-6 text-white"
    >
      <h3 className="text-xl font-semibold mb-2">{doc.is_completed ? 'Completed' : 'Pending'}</h3>
      <p className="mb-4">Signatures: {doc.signatures.length}/{doc.signers.length}</p>
      <div className="flex space-x-2">
        <button
          onClick={() => handleViewDocument(doc)}
          className="flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          <Eye className="mr-2 h-4 w-4" /> View
        </button>
        {isPending ? (
          <button
            onClick={() => navigate(`/sign/${doc.id}`)}
            className="flex items-center justify-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
          >
            Sign Document
          </button>
        ) : (
          <button
            onClick={() => handleShare(doc.id)}
            className="flex items-center justify-center px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors"
          >
            <Share2 className="mr-2 h-4 w-4" /> Share
          </button>
        )}
      </div>
    </motion.div>
  );

  return (
    <div className="container mx-auto px-4 py-8 bg-gray-900 text-white min-h-screen">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">ChainDocs Dashboard</h1>
        <div className="flex items-center gap-4">
          <button
            onClick={() => setIsModalVisible(true)}
            className="flex items-center justify-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
          >
            <Plus className="mr-2 h-4 w-4" /> Create Document
          </button>
          <WalletSelector />
        </div>
      </div>

      <Tabs.Root defaultValue="your-documents" className="flex flex-col">
        <Tabs.List className="flex border-b border-gray-700 mb-4" aria-label="Manage your documents">
          <Tabs.Trigger
            value="your-documents"
            className="px-4 py-2 text-sm font-medium text-gray-400 hover:text-white focus:outline-none focus:text-white border-b-2 border-transparent focus:border-white"
          >
            Your Documents
          </Tabs.Trigger>
          <Tabs.Trigger
            value="pending-signatures"
            className="px-4 py-2 text-sm font-medium text-gray-400 hover:text-white focus:outline-none focus:text-white border-b-2 border-transparent focus:border-white"
          >
            Pending Signatures
          </Tabs.Trigger>
          <Tabs.Trigger
            value="ai-analysis"
            className="px-4 py-2 text-sm font-medium text-gray-400 hover:text-white focus:outline-none focus:text-white border-b-2 border-transparent focus:border-white"
          >
            AI Analysis
          </Tabs.Trigger>
        </Tabs.List>

        <Tabs.Content value="ai-analysis">
          <AIDocumentAnalysis 
            documentHash={selectedDocument?.content_hash || null}
          />
        </Tabs.Content>

        <Tabs.Content value="your-documents">
          <AnimatePresence>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {documents.map(doc => renderDocumentCard(doc, false))}
            </div>
          </AnimatePresence>
        </Tabs.Content>

        <Tabs.Content value="pending-signatures">
          <AnimatePresence>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {pendingDocuments.map(doc => renderDocumentCard(doc, true))}
            </div>
          </AnimatePresence>
        </Tabs.Content>
      </Tabs.Root>

      <Dialog.Root open={isModalVisible} onOpenChange={setIsModalVisible}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black bg-opacity-50" />
          <Dialog.Content className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-gray-800 rounded-lg p-6 w-full max-w-md">
            <Dialog.Title className="text-xl font-semibold mb-4">Create New Document</Dialog.Title>
            <div className="space-y-4">
              <div>
                <Label.Root htmlFor="file" className="block text-sm font-medium mb-1">
                  File
                </Label.Root>
                <input
                  id="file"
                  type="file"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file && file.size / 1024 / 1024 < 25) {
                      setFile(file);
                    } else {
                      alert('File must be smaller than 25MB!');
                    }
                  }}
                  className="w-full px-3 py-2 bg-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <Label.Root htmlFor="signers" className="block text-sm font-medium mb-1">
                  Signers
                </Label.Root>
                <input
                  id="signers"
                  type="text"
                  placeholder="Enter signer addresses (comma-separated)"
                  value={signers}
                  onChange={(e) => setSigners(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
            </div>
            <div className="mt-6 flex justify-end">
              <button
                onClick={handleCreateDocument}
                disabled={transactionInProgress}
                className="flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {transactionInProgress ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating...
                  </>
                ) : (
                  'Create Document'
                )}
              </button>
            </div>
            <Dialog.Close asChild>
              <button
                className="absolute top-2 right-2 p-1 rounded-full text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-white"
                aria-label="Close"
              >
                <X className="h-4 w-4" />
              </button>
            </Dialog.Close>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>

      <Dialog.Root open={!!viewDocumentUrl} onOpenChange={() => setViewDocumentUrl(null)}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black bg-opacity-50" />
          <Dialog.Content className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-gray-800 rounded-lg p-6 w-full max-w-3xl h-[80vh] flex flex-col">
            <Dialog.Title className="text-xl font-semibold mb-4">View Document</Dialog.Title>
            {viewDocumentUrl && (
              <iframe
                src={viewDocumentUrl}
                className="w-full flex-grow border-none"
                title="Document Viewer" />
            )}
            <Dialog.Close asChild>
              <button
                className="absolute top-2 right-2 p-1 rounded-full text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-white"
                aria-label="Close"
              >
                <X className="h-4 w-4" />
              </button>
            </Dialog.Close>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  );
};

export default ContractManagement;