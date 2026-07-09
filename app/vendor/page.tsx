'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  ArrowRight,
  User,
  Store,
  ShieldCheck,
  Check,
  Upload,
  FileText,
  X,
} from 'lucide-react';

type FormData = {
  // Owner
  ownerName: string;
  ownerRole: string;
  ownerEmail: string;
  ownerPhone: string;

  // Business
  businessName: string;
  businessAddress: string;
  businessCity: string;
  businessPostcode: string;
  businessPhone: string;
  businessEmail: string;
  businessRegNumber: string;
  documentName: string;

  // Agreements
  agreedToTerms: boolean;
  agreedToDataPolicy: boolean;
};

export default function VendorApplyPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<FormData>({
    ownerName: '',
    ownerRole: '',
    ownerEmail: '',
    ownerPhone: '',
    businessName: '',
    businessAddress: '',
    businessCity: '',
    businessPostcode: '',
    businessPhone: '',
    businessEmail: '',
    businessRegNumber: '',
    documentName: '',
    agreedToTerms: false,
    agreedToDataPolicy: false,
  });

  const totalSteps = 3;
  const progress = (step / totalSteps) * 100;

  const updateField = (field: keyof FormData, value: string | boolean) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      updateField('documentName', file.name);
    }
  };

  const canProceed = () => {
    if (step === 1) {
      return (
        formData.ownerName &&
        formData.ownerRole &&
        formData.ownerEmail &&
        formData.ownerPhone
      );
    }
    if (step === 2) {
      return (
        formData.businessName &&
        formData.businessAddress &&
        formData.businessCity &&
        formData.businessPostcode &&
        formData.businessPhone &&
        formData.businessEmail &&
        formData.businessRegNumber
      );
    }
    if (step === 3) {
      return formData.agreedToTerms && formData.agreedToDataPolicy;
    }
    return false;
  };

  const handleNext = () => {
    if (step < totalSteps) {
      setStep(step + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      router.push('/vendor/pending');
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      router.push('/vendor');
    }
  };

  const stepIcons = [User, Store, ShieldCheck];
  const stepTitles = ['About you', 'Your business', 'Review & submit'];
  const stepSubtitles = [
    'Tell us who\'s applying.',
    'Verify your business details.',
    'Almost there — confirm and submit.',
  ];

  const inputClass =
    'w-full px-4 py-3.5 bg-surface-container-lowest border border-outline-variant rounded-xl text-base text-on-surface placeholder:text-on-surface-variant/50 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all';

  const labelClass =
    'block text-sm font-label font-semibold text-on-surface mb-2 uppercase tracking-wider';

  return (
    <main className="min-h-screen bg-surface">
      {/* Top bar with progress */}
      <header className="bg-surface-container-low border-b border-outline/10 sticky top-0 z-40">
        <div className="max-w-2xl mx-auto px-4 md:px-6 py-4">
          <div className="flex items-center justify-between mb-3">
            <button
              onClick={handleBack}
              className="flex items-center gap-2 text-on-surface-variant hover:text-primary transition-colors text-sm font-label font-semibold"
            >
              <ArrowLeft size={18} />
              Back
            </button>

            <p className="text-xs font-label font-semibold text-on-surface-variant uppercase tracking-wider">
              Step {step} of {totalSteps}
            </p>

            <button
              onClick={() => router.push('/vendor')}
              className="text-sm text-on-surface-variant hover:text-primary transition-colors font-label"
            >
              Save & exit
            </button>
          </div>

          <div className="h-1.5 bg-surface-container-highest rounded-full overflow-hidden">
            <div
              className="h-full bg-primary rounded-full transition-all duration-500 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </header>

      {/* Main */}
      <div className="max-w-2xl mx-auto px-4 md:px-6 py-8 md:py-12">
        {/* Step header */}
        <div className="mb-8 md:mb-10">
          <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mb-4">
            {(() => {
              const Icon = stepIcons[step - 1];
              return <Icon size={28} />;
            })()}
          </div>
          <h1 className="font-display text-3xl md:text-4xl font-bold text-on-surface tracking-tight leading-tight">
            {stepTitles[step - 1]}
          </h1>
          <p className="text-base text-on-surface-variant mt-2">
            {stepSubtitles[step - 1]}
          </p>
        </div>

        <div className="space-y-6">
          {/* STEP 1 — OWNER */}
          {step === 1 && (
            <>
              <div>
                <label className={labelClass}>Full name</label>
                <input
                  type="text"
                  value={formData.ownerName}
                  onChange={(e) => updateField('ownerName', e.target.value)}
                  placeholder="Sarah Mitchell"
                  className={inputClass}
                />
              </div>

              <div>
                <label className={labelClass}>Your role</label>
                <input
                  type="text"
                  value={formData.ownerRole}
                  onChange={(e) => updateField('ownerRole', e.target.value)}
                  placeholder="Owner, Manager, Head Baker..."
                  className={inputClass}
                />
              </div>

              <div>
                <label className={labelClass}>Personal email</label>
                <input
                  type="email"
                  value={formData.ownerEmail}
                  onChange={(e) => updateField('ownerEmail', e.target.value)}
                  placeholder="sarah@email.com"
                  className={inputClass}
                />
                <p className="text-xs text-on-surface-variant mt-1.5 ml-1">
                  We&apos;ll send you the approval decision here
                </p>
              </div>

              <div>
                <label className={labelClass}>Personal phone</label>
                <input
                  type="tel"
                  value={formData.ownerPhone}
                  onChange={(e) => updateField('ownerPhone', e.target.value)}
                  placeholder="+44 7700 900123"
                  className={inputClass}
                />
                <p className="text-xs text-on-surface-variant mt-1.5 ml-1">
                  Kept private — never shown to customers
                </p>
              </div>

              <div className="bg-primary/5 border border-primary/20 rounded-2xl p-4 flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary flex-shrink-0">
                  <ShieldCheck size={16} />
                </div>
                <div>
                  <p className="text-sm font-semibold text-on-surface">
                    Your personal info stays private
                  </p>
                  <p className="text-xs text-on-surface-variant mt-1">
                    Only your business details are shown publicly on OGuru.
                  </p>
                </div>
              </div>
            </>
          )}

          {/* STEP 2 — BUSINESS */}
          {step === 2 && (
            <>
              <div>
                <label className={labelClass}>Business name</label>
                <input
                  type="text"
                  value={formData.businessName}
                  onChange={(e) => updateField('businessName', e.target.value)}
                  placeholder="e.g., BrewHouse Café"
                  className={inputClass}
                />
                <p className="text-xs text-on-surface-variant mt-1.5 ml-1">
                  This is what customers will see
                </p>
              </div>

              <div>
                <label className={labelClass}>Business address</label>
                <input
                  type="text"
                  value={formData.businessAddress}
                  onChange={(e) => updateField('businessAddress', e.target.value)}
                  placeholder="123 Main Street"
                  className={inputClass}
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>City</label>
                  <input
                    type="text"
                    value={formData.businessCity}
                    onChange={(e) => updateField('businessCity', e.target.value)}
                    placeholder="London"
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className={labelClass}>Postcode</label>
                  <input
                    type="text"
                    value={formData.businessPostcode}
                    onChange={(e) => updateField('businessPostcode', e.target.value)}
                    placeholder="EC1V 9BH"
                    className={inputClass}
                  />
                </div>
              </div>

              <div className="bg-secondary-container/40 border border-secondary/20 rounded-2xl p-4 flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-secondary/20 flex items-center justify-center text-secondary flex-shrink-0">
                  <Store size={16} />
                </div>
                <div>
                  <p className="text-sm font-semibold text-on-secondary-container">
                    Your address will be public
                  </p>
                  <p className="text-xs text-on-secondary-container/80 mt-1">
                    Customers need to know where to visit and pick up orders. Your address appears on your store page and maps.
                  </p>
                </div>
              </div>

              <div>
                <label className={labelClass}>Business phone</label>
                <input
                  type="tel"
                  value={formData.businessPhone}
                  onChange={(e) => updateField('businessPhone', e.target.value)}
                  placeholder="+44 20 7000 0000"
                  className={inputClass}
                />
              </div>

              <div>
                <label className={labelClass}>Business email</label>
                <input
                  type="email"
                  value={formData.businessEmail}
                  onChange={(e) => updateField('businessEmail', e.target.value)}
                  placeholder="hello@brewhouse.co.uk"
                  className={inputClass}
                />
              </div>

              <div>
                <label className={labelClass}>Business registration number</label>
                <input
                  type="text"
                  value={formData.businessRegNumber}
                  onChange={(e) => updateField('businessRegNumber', e.target.value)}
                  placeholder="e.g., 12345678"
                  className={inputClass}
                />
                <p className="text-xs text-on-surface-variant mt-1.5 ml-1">
                  Companies House, ABN, EIN, or equivalent
                </p>
              </div>

              <div>
                <label className={labelClass}>
                  Verification document{' '}
                  <span className="text-on-surface-variant lowercase font-normal normal-case ml-1">
                    (optional)
                  </span>
                </label>

                {!formData.documentName ? (
                  <label className="flex flex-col items-center justify-center gap-3 px-4 py-8 bg-surface-container-lowest border-2 border-dashed border-outline-variant rounded-xl cursor-pointer hover:border-primary/40 hover:bg-primary/5 transition-all">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                      <Upload size={24} />
                    </div>
                    <div className="text-center">
                      <p className="text-sm font-semibold text-on-surface">
                        Upload a document
                      </p>
                      <p className="text-xs text-on-surface-variant mt-1">
                        Business registration, food hygiene cert, or licence
                      </p>
                    </div>
                    <input
                      type="file"
                      onChange={handleFileUpload}
                      accept=".pdf,.jpg,.jpeg,.png"
                      className="hidden"
                    />
                  </label>
                ) : (
                  <div className="flex items-center gap-3 p-4 bg-primary/5 border border-primary/20 rounded-xl">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary flex-shrink-0">
                      <FileText size={20} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-on-surface truncate">
                        {formData.documentName}
                      </p>
                      <p className="text-xs text-on-surface-variant">Uploaded</p>
                    </div>
                    <button
                      onClick={() => updateField('documentName', '')}
                      className="w-8 h-8 rounded-lg hover:bg-error/10 hover:text-error text-on-surface-variant flex items-center justify-center transition-colors flex-shrink-0"
                    >
                      <X size={16} />
                    </button>
                  </div>
                )}

                <p className="text-xs text-on-surface-variant mt-2 ml-1">
                  Speeds up approval, but not required
                </p>
              </div>
            </>
          )}

          {/* STEP 3 — REVIEW */}
          {step === 3 && (
            <>
              <div className="bg-surface-container-lowest border border-outline/10 rounded-2xl p-6 space-y-6">
                <div>
                  <p className="text-xs font-label font-semibold text-outline uppercase tracking-widest mb-3">
                    Applicant
                  </p>
                  <div className="space-y-1.5">
                    <p className="font-semibold text-on-surface">
                      {formData.ownerName || 'Not provided'}
                    </p>
                    <p className="text-sm text-on-surface-variant">
                      {formData.ownerRole}
                    </p>
                    <p className="text-sm text-on-surface-variant">
                      {formData.ownerEmail}
                    </p>
                    <p className="text-sm text-on-surface-variant">
                      {formData.ownerPhone}
                    </p>
                  </div>
                </div>

                <div className="h-px bg-outline/10" />

                <div>
                  <p className="text-xs font-label font-semibold text-outline uppercase tracking-widest mb-3">
                    Business
                  </p>
                  <div className="space-y-1.5">
                    <p className="font-semibold text-on-surface">
                      {formData.businessName || 'Not provided'}
                    </p>
                    <p className="text-sm text-on-surface-variant">
                      {formData.businessAddress}
                    </p>
                    <p className="text-sm text-on-surface-variant">
                      {formData.businessCity}, {formData.businessPostcode}
                    </p>
                    <p className="text-sm text-on-surface-variant pt-2">
                      {formData.businessPhone}
                    </p>
                    <p className="text-sm text-on-surface-variant">
                      {formData.businessEmail}
                    </p>
                    <p className="text-sm text-on-surface-variant pt-2">
                      Reg: {formData.businessRegNumber}
                    </p>
                    {formData.documentName && (
                      <div className="flex items-center gap-2 pt-2">
                        <FileText size={14} className="text-primary" />
                        <span className="text-sm text-primary font-semibold">
                          {formData.documentName}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="bg-secondary-container/40 border border-secondary/20 rounded-2xl p-5">
                <p className="text-sm font-semibold text-on-secondary-container mb-3">
                  What happens next?
                </p>
                <ul className="space-y-2 text-sm text-on-secondary-container/80">
                  <li className="flex items-start gap-2">
                    <Check size={16} className="text-primary flex-shrink-0 mt-0.5" />
                    We&apos;ll review your application within 48 hours
                  </li>
                  <li className="flex items-start gap-2">
                    <Check size={16} className="text-primary flex-shrink-0 mt-0.5" />
                    You&apos;ll get an email at{' '}
                    <strong>{formData.ownerEmail || 'your address'}</strong>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check size={16} className="text-primary flex-shrink-0 mt-0.5" />
                    Once approved, you can log in and complete your store profile
                  </li>
                </ul>
              </div>

              <label className="flex items-start gap-3 cursor-pointer p-4 rounded-xl hover:bg-surface-container-low transition-colors">
                <input
                  type="checkbox"
                  checked={formData.agreedToTerms}
                  onChange={(e) => updateField('agreedToTerms', e.target.checked)}
                  className="mt-1 w-5 h-5 rounded border-2 border-outline-variant text-primary focus:ring-2 focus:ring-primary/20 cursor-pointer accent-primary flex-shrink-0"
                />
                <span className="text-sm text-on-surface leading-relaxed">
                  I agree to the OGuru{' '}
                  <a href="#" className="text-primary font-semibold underline">
                    Vendor Terms of Service
                  </a>
                </span>
              </label>

              <label className="flex items-start gap-3 cursor-pointer p-4 rounded-xl hover:bg-surface-container-low transition-colors">
                <input
                  type="checkbox"
                  checked={formData.agreedToDataPolicy}
                  onChange={(e) =>
                    updateField('agreedToDataPolicy', e.target.checked)
                  }
                  className="mt-1 w-5 h-5 rounded border-2 border-outline-variant text-primary focus:ring-2 focus:ring-primary/20 cursor-pointer accent-primary flex-shrink-0"
                />
                <span className="text-sm text-on-surface leading-relaxed">
                  I agree to the{' '}
                  <a href="#" className="text-primary font-semibold underline">
                    Privacy & Data Policy
                  </a>
                </span>
              </label>
            </>
          )}
        </div>

        {/* Bottom actions */}
        <div className="mt-10 flex flex-col-reverse sm:flex-row gap-3 sm:justify-between">
          <button
            onClick={handleBack}
            className="flex items-center justify-center gap-2 px-6 py-4 border-2 border-outline-variant text-on-surface rounded-xl font-label font-semibold text-sm uppercase tracking-wider hover:bg-surface-container transition-colors"
          >
            <ArrowLeft size={18} />
            {step === 1 ? 'Cancel' : 'Back'}
          </button>

          <button
            onClick={handleNext}
            disabled={!canProceed()}
            className={`flex items-center justify-center gap-2 px-8 py-4 rounded-xl font-label font-semibold text-sm uppercase tracking-wider transition-all shadow-lg ${
              canProceed()
                ? 'bg-primary text-on-primary hover:scale-[1.02] active:scale-[0.98]'
                : 'bg-surface-container-highest text-on-surface-variant/50 cursor-not-allowed shadow-none'
            }`}
          >
            {step === totalSteps ? 'Submit application' : 'Continue'}
            {step < totalSteps && <ArrowRight size={18} />}
          </button>
        </div>
      </div>
    </main>
  );
}