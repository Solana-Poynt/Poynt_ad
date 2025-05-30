import { Check, Trophy, ArrowRight } from "lucide-react";

interface SuccessStateProps {
  formData: any;
  paymentSignature: string;
  onClose: () => void;
}

const SuccessState = ({
  formData,
  paymentSignature,
  onClose,
}: SuccessStateProps) => {
  return (
    <div className="text-center py-8">
      <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <Check className="w-8 h-8 text-green-500" />
      </div>
      <h3 className="text-xl font-bold text-gray-900 mb-2">
        Campaign Created Successfully!
      </h3>
      <p className="text-gray-600 mb-6">
        Your campaign has been submitted and is now being reviewed. Your ad will
        be shown to users who can complete your specified tasks to earn Poynts.
      </p>
      {formData.selectedLoyaltyProgram && (
        <div className="bg-green-50 rounded-lg p-4 mb-6 border border-green-200">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Trophy className="w-5 h-5 text-green-600" />
            <span className="font-medium text-green-800">
              Loyalty Program Active
            </span>
          </div>
          <p className="text-sm text-green-700">
            Users will earn points in "{formData.selectedLoyaltyProgram.name}"
            when they complete your campaign tasks.
          </p>
        </div>
      )}
      <div className="space-y-3">
        <button
          onClick={onClose}
          className="w-full px-6 py-3 bg-side text-white rounded-lg hover:bg-side/90 transition-colors font-medium"
        >
          View My Campaigns
        </button>
        <a
          href={`https://explorer.solana.com/tx/${paymentSignature}?cluster=devnet`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 text-sm"
        >
          <ArrowRight className="w-4 h-4" />
          View Transaction on Explorer
        </a>
      </div>
    </div>
  );
};

export default SuccessState;
