// src/pdfjs.d.ts
declare module 'pdfjs-dist/build/pdf' {
    export const GlobalWorkerOptions: {
      workerSrc: string;
    };
  
    export function getDocument(source: any): {
      promise: Promise<{
        numPages: number;
        getPage: (pageNumber: number) => Promise<any>;
      }>;
    };
  }