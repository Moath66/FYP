"use client";
import { Info, X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

const DescriptionModal = ({ description, onClose }) => {
  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-md p-6 rounded-lg shadow-lg">
        <DialogHeader className="flex flex-row items-center justify-between mb-4">
          <DialogTitle className="text-xl font-bold text-[#007D7B] flex items-center gap-2">
            <Info className="h-6 w-6" /> Item Description
          </DialogTitle>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="h-5 w-5" />
            <span className="sr-only">Close</span>
          </Button>
        </DialogHeader>
        <DialogDescription className="text-gray-700 bg-gray-50 p-4 rounded-md border border-gray-200 leading-relaxed whitespace-pre-wrap">
          {description}
        </DialogDescription>
      </DialogContent>
    </Dialog>
  );
};

export default DescriptionModal;
