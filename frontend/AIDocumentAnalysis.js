import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
// import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2 } from 'lucide-react';
import { analyzeDocument, suggestImprovements } from './aiService';

const AIDocumentAnalysis = ({ documentContent }) => {
  const [analysis, setAnalysis] = useState(null);
  const [suggestions, setSuggestions] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleAnalyze = async () => {
    setLoading(true);
    setError(null);
    try {
      const analysisResult = await analyzeDocument(documentContent);
      setAnalysis(analysisResult);
      
      const suggestionsResult = await suggestImprovements(documentContent);
      setSuggestions(suggestionsResult);
    } catch (err) {
      setError('Failed to analyze document. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">AI Document Analysis</h2>
        <Button 
          onClick={handleAnalyze}
          disabled={!documentContent || loading}
        >
          Analyze Document
        </Button>
      </div>

      {/* {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )} */}

      {analysis && (
        <Card>
          <CardHeader>
            <CardTitle>Document Analysis</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="whitespace-pre-wrap">{analysis}</div>
          </CardContent>
        </Card>
      )}

      {suggestions && (
        <Card>
          <CardHeader>
            <CardTitle>Suggested Improvements</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="whitespace-pre-wrap">{suggestions}</div>
          </CardContent>
        </Card>
      )}

      {/* {!documentContent && (
        <Alert>
          <AlertDescription>
            Upload or select a document to analyze
          </AlertDescription>
        </Alert>
      )} */}
    </div>
  );
};

export default AIDocumentAnalysis;


