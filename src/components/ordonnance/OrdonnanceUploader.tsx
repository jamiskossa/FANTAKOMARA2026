"use client";

import React, { useCallback, useState } from 'react';
import { Upload, Loader2, AlertCircle, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { compressImage } from '@/lib/image-compression';
import { validateOCRQuality } from '@/lib/medication-parser';

interface OrdonnanceUploaderProps {
  onFileSelected: (file: File, preview: string) => Promise<void>;
  isAnalyzing?: boolean;
  fileName?: string | null;
}

export function OrdonnanceUploader({
  onFileSelected,
  isAnalyzing = false,
  fileName = null,
}: OrdonnanceUploaderProps) {
  const [preview, setPreview] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const handleFile = useCallback(
    async (file: File) => {
      try {
        setError(null);
        setUploadProgress(0);

        // Valider format
        const validFormats = ['image/jpeg', 'image/png', 'image/webp', 'application/pdf'];
        if (!validFormats.includes(file.type)) {
          setError('Format non supporté. Utilisez JPG, PNG ou PDF');
          return;
        }

        // Valider taille (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
          setError('Fichier trop lourd. Maximum 5MB');
          return;
        }

        // Compresser si image
        let processedFile = file;
        if (file.type.startsWith('image/')) {
          setUploadProgress(20);
          processedFile = await compressImage(file, {
            maxSizeMB: 1,
            maxWidthOrHeight: 1600,
          });
          setUploadProgress(50);
        }

        // Créer preview
        const reader = new FileReader();
        reader.onload = async (event) => {
          const dataUrl = event.target?.result as string;
          setPreview(dataUrl);
          setUploadProgress(75);

          // Appeler callback avec fichier compressé
          await onFileSelected(processedFile, dataUrl);
          setUploadProgress(100);
        };
        reader.readAsDataURL(processedFile);
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Erreur lors du traitement';
        setError(message);
        setUploadProgress(0);
      }
    },
    [onFileSelected]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);

      const files = e.dataTransfer.files;
      if (files.length > 0) {
        handleFile(files[0]);
      }
    },
    [handleFile]
  );

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files?.length) {
      handleFile(files[0]);
    }
  };

  return (
    <div className="space-y-4">
      <input
        type="file"
        id="ordonnance-input"
        className="hidden"
        accept="image/*,.pdf"
        onChange={handleInputChange}
      />

      <Card
        className={`border-4 border-dashed p-8 sm:p-12 text-center rounded-[32px] sm:rounded-[48px] bg-white shadow-soft transition-all cursor-pointer ${
          isDragging
            ? 'border-primary bg-primary/5'
            : isAnalyzing
            ? 'border-primary bg-primary/5'
            : 'border-slate-200 hover:border-primary/30'
        }`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={() => !isAnalyzing && document.getElementById('ordonnance-input')?.click()}
      >
        <CardContent className="p-0 space-y-6 sm:space-y-8">
          {isAnalyzing ? (
            <div className="flex flex-col items-center gap-6 animate-pulse">
              <div className="relative w-16 h-16 sm:w-20 sm:h-20">
                <Loader2 className="w-full h-full text-primary animate-spin" />
              </div>
              <div className="space-y-2">
                <h3 className="text-xl sm:text-3xl font-black text-primary uppercase tracking-tight">
                  Analyse IA en cours...
                </h3>
                <p className="text-slate-400 font-bold uppercase text-[8px] sm:text-[10px] tracking-widest">
                  Lecture des médicaments et dosages
                </p>
                {uploadProgress > 0 && uploadProgress < 100 && (
                  <div className="mt-4 w-full bg-slate-200 rounded-full h-2">
                    <div
                      className="bg-primary h-2 rounded-full transition-all duration-300"
                      style={{ width: `${uploadProgress}%` }}
                    />
                  </div>
                )}
              </div>
            </div>
          ) : (
            <>
              <div className="w-16 h-16 sm:w-24 sm:h-24 bg-slate-50 rounded-2xl sm:rounded-3xl flex items-center justify-center mx-auto text-slate-300">
                <Upload className="w-8 h-8 sm:w-12 sm:h-12" />
              </div>
              <div>
                <h3 className="text-xl sm:text-2xl font-black text-slate-900 uppercase tracking-tight mb-2">
                  {fileName ? fileName : 'Déposez votre ordonnance'}
                </h3>
                <p className="text-slate-400 font-bold uppercase text-[8px] sm:text-[10px] tracking-widest">
                  Formats : PHOTO, PDF • Max 5Mo
                </p>
              </div>
              <Button className="rounded-full px-8 sm:px-12 h-12 sm:h-14 bg-secondary hover:bg-secondary/90 shadow-xl shadow-secondary/20 text-white font-black uppercase tracking-widest text-[9px] sm:text-xs">
                Sélectionner mon document
              </Button>
            </>
          )}
        </CardContent>
      </Card>

      {preview && !isAnalyzing && (
        <div className="rounded-2xl overflow-hidden border border-slate-200 bg-white p-4">
          <img src={preview} alt="Ordonnance preview" className="w-full max-h-96 object-contain" />
        </div>
      )}

      {error && (
        <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-2xl">
          <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 shrink-0" />
          <div>
            <h4 className="font-black text-red-700 uppercase text-sm">Erreur</h4>
            <p className="text-sm text-red-600 mt-1">{error}</p>
          </div>
        </div>
      )}
    </div>
  );
}
