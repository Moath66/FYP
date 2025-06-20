"use client";
import { X } from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

const ImageModal = ({ imageUrl, onClose }) => {
  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl p-4 rounded-lg shadow-lg flex flex-col items-center">
        <div className="w-full flex justify-end">
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="h-5 w-5" />
            <span className="sr-only">Close</span>
          </Button>
        </div>
        <img
          src={imageUrl || "/placeholder.svg"}
          alt="Item Detail"
          className="max-w-full max-h-[80vh] object-contain rounded-md"
        />
      </DialogContent>
    </Dialog>
  );
};

export default ImageModal;
