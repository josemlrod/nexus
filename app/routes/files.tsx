import type React from "react";

import { useState, useCallback } from "react";
import { Button } from "~/components/ui/button";
import { Card } from "~/components/ui/card";
import { Label } from "~/components/ui/label";
import { Badge } from "~/components/ui/badge";
import { Upload, FileIcon, ImageIcon, Download, Calendar } from "lucide-react";
import { generateUploadUrl } from "convex/files";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api.js";
import { format } from "date-fns";

export default function FileUpload() {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [downloadingFiles, setDownloadingFiles] = useState<Set<string>>(new Set());

  const files = useQuery(api.files.list);
  const generateUploadUrl = useMutation(api.files.generateUploadUrl);
  const sendFile = useMutation(api.files.sendFile);
  const getDownloadUrl = useMutation(api.files.getDownloadUrl);

  console.log({ files });

  const handleFileUpload = async (files: FileList) => {
    console.log("in file upload");
    console.log({ files });
    if (files.length === 0) return;

    setIsUploading(true);
    try {
      for (const file of Array.from(files)) {
        // Limit file size to 10MB
        if (file.size > 10 * 1024 * 1024) {
          alert(`File "${file.name}" is too large. Maximum size is 10MB.`);
          continue;
        }

        const postUrl = await generateUploadUrl();
        const result = await fetch(postUrl, {
          method: "POST",
          headers: { "Content-Type": file!.type },
          body: file,
        });
        const { storageId } = await result.json();
        await sendFile({ storageId });
      }
    } catch (error) {
      console.error("Error uploading file:", error);
      alert("Error uploading file. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    handleFileUpload(e.dataTransfer.files);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      handleFileUpload(e.target.files);
    }
  };

  const handleDownload = async (fileId: string, fileName: string) => {
    setDownloadingFiles(prev => new Set(prev).add(fileId));
    try {
      const downloadUrl = await getDownloadUrl({ storageId: fileId });
      if (downloadUrl) {
        const link = document.createElement('a');
        link.href = downloadUrl;
        link.download = fileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    } catch (error) {
      console.error("Error downloading file:", error);
      alert("Error downloading file. Please try again.");
    } finally {
      setDownloadingFiles(prev => {
        const newSet = new Set(prev);
        newSet.delete(fileId);
        return newSet;
      });
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileIcon = (contentType: string) => {
    if (contentType && contentType.startsWith('image/')) {
      return <ImageIcon className="h-4 w-4" />;
    }
    return <FileIcon className="h-4 w-4" />;
  };

  return (
    <div className="space-y-6">
      <Card className="p-6 border-border/50 bg-card/50 backdrop-blur-sm">
        <div className="flex items-center gap-2 mb-4">
          <Upload className="h-5 w-5 text-primary" />
          <h2 className="text-lg font-semibold text-foreground">Upload Files</h2>
        </div>

        <div
          className={`border-2 border-dashed rounded-lg p-8 text-center transition-all duration-200 ${
            isDragging
              ? "border-primary bg-primary/5 scale-105"
              : "border-border/50 hover:border-primary/50 hover:bg-accent/20"
          }`}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
        >
          <div className="space-y-4">
            <div className="flex justify-center">
              {isDragging ? (
                <Upload className="h-12 w-12 text-primary animate-bounce" />
              ) : (
                <div className="flex gap-2">
                  <FileIcon className="h-8 w-8 text-muted-foreground" />
                  <ImageIcon className="h-8 w-8 text-muted-foreground" />
                </div>
              )}
            </div>

            <div className="space-y-2">
              <p className="text-foreground font-medium">
                {isDragging ? "Drop files here" : "Drag and drop files here"}
              </p>
              <p className="text-sm text-muted-foreground">
                or click to browse (max 10MB per file)
              </p>
            </div>

            <Label htmlFor="file-input">
              <Button
                type="button"
                variant="outline"
                disabled={isUploading}
                className="bg-background/50 border-border/50 hover:bg-accent/50 transition-all duration-200"
                asChild
              >
                <span className="cursor-pointer">
                  {isUploading ? "Uploading..." : "Choose Files"}
                </span>
              </Button>
            </Label>

            <input
              id="file-input"
              type="file"
              multiple
              onChange={handleFileSelect}
              className="hidden"
              disabled={isUploading}
            />
          </div>
        </div>
      </Card>

      {/* File List */}
      <div className="space-y-6">
        <div className="flex items-center gap-2">
          <FileIcon className="h-5 w-5 text-primary" />
          <h2 className="text-lg font-semibold text-foreground">Uploaded Files</h2>
          <Badge variant="outline">{files?.length || 0}</Badge>
        </div>

        <div className="space-y-3">
          {!files || files.length === 0 ? (
            <Card className="p-8 text-center border-border/50 bg-card/30">
              <p className="text-muted-foreground">
                No files uploaded yet. Upload your first file above.
              </p>
            </Card>
          ) : (
            files.map((file) => (
              <Card
                key={file._id}
                className="p-4 border-border/50 bg-card/50 backdrop-blur-sm hover:bg-card/70 transition-all duration-200"
              >
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div className="text-muted-foreground">
                      {getFileIcon(file.contentType)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="text-sm font-medium text-foreground truncate">
                          {file.name !== "Unknown" ? file.name : `File ${file._id.slice(-6)}`}
                        </p>
                        <Badge variant="outline" className="text-xs bg-background/50">
                          {formatFileSize(file.size)}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Calendar className="h-3 w-3" />
                        <span>
                          {format(new Date(file.createdAt), "MMM dd, yyyy HH:mm")}
                        </span>
                      </div>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDownload(file.fileId, file.name !== "Unknown" ? file.name : `file-${file._id.slice(-6)}`)}
                    disabled={downloadingFiles.has(file.fileId)}
                    className="bg-background/50 border-border/50 hover:bg-accent/50 transition-all duration-200"
                  >
                    {downloadingFiles.has(file.fileId) ? (
                      "Downloading..."
                    ) : (
                      <>
                        <Download className="h-4 w-4" />
                        Download
                      </>
                    )}
                  </Button>
                </div>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
