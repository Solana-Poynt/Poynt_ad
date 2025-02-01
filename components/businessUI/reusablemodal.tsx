import React, { ReactNode, FC } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
}

const ReModal: FC<ModalProps> = ({ 
  isOpen,
  onClose, 
  title, 
  children 
}) => {
  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0  bg-opacity-50 transition-opacity" 
          aria-hidden="true"
        />
      )}

      {/* Modal */}
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="fixed  w-[60%] max-w-4xl  -translate-x-1/2 -translate-y-1/2 rounded-lg bg-gray-100 p-6 shadow-xl">
          <DialogHeader className="relative  border-b pb-6  border-gray-200">
            <DialogTitle className="text-xl font-semibold">
              {title}
            </DialogTitle>
           
          </DialogHeader>

          <div className="overflow-y-auto py-4 h-full">
            {children}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};


export default ReModal;