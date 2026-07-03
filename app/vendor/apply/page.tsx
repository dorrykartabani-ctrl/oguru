'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  ArrowRight,
  Store,
  MapPin,
  Settings,
  ShieldCheck,
  Check,
  Coffee,
  Wheat,
  Beef,
  Apple,
  Sparkles,
} from 'lucide-react';

type FormData = {
  // Step 1
  businessName: string;
  businessType: string;
  aboutStory: string;
  specialty: string;
  // Step 2
  address: string;
  city: string;
  postcode: string;
  openingHours: string;
  // Step 3
  usesPos: string;
  posSystem: string;
  menuSize: string;
  instagram: string;
  // Step 4
  ownerName: string;
  ownerRole: string;
  email: string;
  phone: string;
  agreedToTerms: boolean;
};

const businessTypes = [
  { id: 'cafe', label: 'Café', icon: Coffee },
  { id: 'bakery', label: 'Bakery', icon: Wheat },
  { id: 'butcher', label: 'Butcher / Deli', icon: Beef },
  { id: 'farm', label: 'Farm / Producer', icon: Apple },
  { id: 'other', label: 'Something else', icon: Sparkles },
];

const posOptions = [
  'Square',
  'Toast',
  'Lightspeed',
  'Clover',
  'Zettle',
  'Other',
  "I'm not sure",
];

const menuSizes = [
  'Under 10 items',
  '10 - 30 items',
  '30 - 50 items',
  '50+ items',
];

export default function VendorApplyPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<FormData>({
    businessName: '',
    businessType: '',
    aboutStory: '',
    specialty: '',
    address: '',
    city: '',
    postcode: '',
    openingHours: '',
    usesPos: '',
    posSystem: '',
    menuSize: '',
    instagram: '',
    ownerName: '',
    ownerRole: '',
    email: '',
    phone: '',
    agreedToTerms: false,
  });

  const totalSteps = 4;
  const progress = (step / totalSteps) * 100;

  const updateField = (field: keyof FormData, value: string | boolean) => {
    setFormData({ ...formData, [field]: value });
  };

  const canProceed = () => {
    if (step === 1) {
      return formData.businessName && formData.businessType && formData.aboutStory;
    }
    if (step === 2) {
      return formData.address && formData.city && formData.postcode;
    }
    if (step === 3) {
      return formData.usesPos && formData.menuSize;
    }
    if (step === 4) {
      return (
        formData.ownerName &&
        formData.email &&
        formData.phone &&
        formData.agreedToTerms
      );
    }
    return false;
  };

  const handleNext = () => {
    if (step < totalSteps) {
      setStep(step + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      // Submit application
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

  const stepIcons = [Store, MapPin, Settings, ShieldCheck];
  const stepTitles = [
    'About your business',
    'Location & hours',
    'Your setup',
    'Verification',
  ];

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

          {/* Progress bar */}
          <div className="h-1.5 bg-surface-container-highest rounded-full overflow-hidden">
            <div
              className="h-full bg-primary rounded-full transition-all duration-500 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </header>

      {/* Main content */}
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
            {step === 1 && 'Tell us about what you do.'}
            {step === 2 && 'Where can customers find you?'}
            {step === 3 && 'Help us understand your workflow.'}
            {step === 4 && 'Almost done — a few final details.'}
          </p>
        </div>

        {/* Form content */}
        <div className="space-y-6">
          {/* STEP 1 */}
          {step === 1 && (
            <>
              <div>
                <label className="block text-sm font-label font-semibold text-on-surface mb-2 uppercase tracking-wider">
                  Business name
                </label>
                <input
                  type="text"
                  value={formData.businessName}
                  onChange={(e) => updateField('businessName', e.target.value)}
                  placeholder="e.g., BrewHouse Café"
                  className="w-full px-4 py-3.5 bg-surface-container-lowest border border-outline-variant rounded-xl text-base text-on-surface placeholder:text-on-surface-variant/50 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-label font-semibold text-on-surface mb-3 uppercase tracking-wider">
                  What kind of business?
                </label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {businessTypes.map((type) => {
                    const Icon = type.icon;
                    const isSelected = formData.businessType === type.id;
                    return (
                      <button
                        key={type.id}
                        type="button"
                        onClick={() => updateField('businessType', type.id)}
                        className={`flex flex-col items-center gap-2 p-4 rounded-2xl border-2 transition-all ${
                          isSelected
                            ? 'border-primary bg-primary/5'
                            : 'border-outline-variant bg-surface-container-lowest hover:border-primary/40'
                        }`}
                      >
                        <div
                          className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                            isSelected
                              ? 'bg-primary text-on-primary'
                              : 'bg-primary/10 text-primary'
                          }`}
                        >
                          <Icon size={20} />
                        </div>
                        <span
                          className={`text-sm font-semibold ${
                            isSelected ? 'text-primary' : 'text-on-surface'
                          }`}
                        >
                          {type.label}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="block text-sm font-label font-semibold text-on-surface mb-2 uppercase tracking-wider">
                  Tell your story
                </label>
                <textarea
                  value={formData.aboutStory}
                  onChange={(e) => updateField('aboutStory', e.target.value)}
                  placeholder="What's the heart of your business? What do you love about what you do?"
                  rows={4}
                  className="w-full px-4 py-3.5 bg-surface-container-lowest border border-outline-variant rounded-xl text-base text-on-surface placeholder:text-on-surface-variant/50 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all resize-none"
                />
              </div>

              <div>
                <label className="block text-sm font-label font-semibold text-on-surface mb-2 uppercase tracking-wider">
                  What makes you special?
                </label>
                <input
                  type="text"
                  value={formData.specialty}
                  onChange={(e) => updateField('specialty', e.target.value)}
                  placeholder="e.g., Single origin coffee, sourdough, organic produce"
                  className="w-full px-4 py-3.5 bg-surface-container-lowest border border-outline-variant rounded-xl text-base text-on-surface placeholder:text-on-surface-variant/50 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                />
                <p className="text-xs text-on-surface-variant mt-1.5 ml-1">
                  Optional — helps us feature you to the right customers
                </p>
              </div>
            </>
          )}

          {/* STEP 2 */}
          {step === 2 && (
            <>
              <div>
                <label className="block text-sm font-label font-semibold text-on-surface mb-2 uppercase tracking-wider">
                  Street address
                </label>
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) => updateField('address', e.target.value)}
                  placeholder="e.g., 123 Main Street"
                  className="w-full px-4 py-3.5 bg-surface-container-lowest border border-outline-variant rounded-xl text-base text-on-surface placeholder:text-on-surface-variant/50 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-label font-semibold text-on-surface mb-2 uppercase tracking-wider">
                    City
                  </label>
                  <input
                    type="text"
                    value={formData.city}
                    onChange={(e) => updateField('city', e.target.value)}
                    placeholder="London"
                    className="w-full px-4 py-3.5 bg-surface-container-lowest border border-outline-variant rounded-xl text-base text-on-surface placeholder:text-on-surface-variant/50 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-label font-semibold text-on-surface mb-2 uppercase tracking-wider">
                    Postcode
                  </label>
                  <input
                    type="text"
                    value={formData.postcode}
                    onChange={(e) => updateField('postcode', e.target.value)}
                    placeholder="EC1V 9BH"
                    className="w-full px-4 py-3.5 bg-surface-container-lowest border border-outline-variant rounded-xl text-base text-on-surface placeholder:text-on-surface-variant/50 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-label font-semibold text-on-surface mb-2 uppercase tracking-wider">
                  General opening hours
                </label>
                <textarea
                  value={formData.openingHours}
                  onChange={(e) => updateField('openingHours', e.target.value)}
                  placeholder="e.g., Mon-Fri 7am-5pm, Sat-Sun 8am-4pm"
                  rows={3}
                  className="w-full px-4 py-3.5 bg-surface-container-lowest border border-outline-variant rounded-xl text-base text-on-surface placeholder:text-on-surface-variant/50 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all resize-none"
                />
                <p className="text-xs text-on-surface-variant mt-1.5 ml-1">
                  You can set detailed hours later in your dashboard
                </p>
              </div>

              <div className="bg-primary/5 border border-primary/20 rounded-2xl p-4 flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary flex-shrink-0">
                  <MapPin size={16} />
                </div>
                <div>
                  <p className="text-sm font-semibold text-on-surface">
                    Your address stays private
                  </p>
                  <p className="text-xs text-on-surface-variant mt-1">
                    We only show your general neighbourhood publicly until customers confirm pickup.
                  </p>
                </div>
              </div>
            </>
          )}

          {/* STEP 3 */}
          {step === 3 && (
            <>
              <div>
                <label className="block text-sm font-label font-semibold text-on-surface mb-3 uppercase tracking-wider">
                  Do you use a POS system?
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {['Yes', 'No', 'Not sure'].map((option) => {
                    const isSelected = formData.usesPos === option;
                    return (
                      <button
                        key={option}
                        type="button"
                        onClick={() => updateField('usesPos', option)}
                        className={`p-4 rounded-2xl border-2 transition-all text-sm font-semibold ${
                          isSelected
                            ? 'border-primary bg-primary/5 text-primary'
                            : 'border-outline-variant bg-surface-container-lowest text-on-surface hover:border-primary/40'
                        } ${option === 'Not sure' ? 'col-span-2 md:col-span-1' : ''}`}
                      >
                        {option}
                      </button>
                    );
                  })}
                </div>
              </div>

              {formData.usesPos === 'Yes' && (
                <div>
                  <label className="block text-sm font-label font-semibold text-on-surface mb-3 uppercase tracking-wider">
                    Which one?
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {posOptions.map((pos) => {
                      const isSelected = formData.posSystem === pos;
                      return (
                        <button
                          key={pos}
                          type="button"
                          onClick={() => updateField('posSystem', pos)}
                          className={`p-3 rounded-xl border-2 transition-all text-sm font-medium ${
                            isSelected
                              ? 'border-primary bg-primary/5 text-primary'
                              : 'border-outline-variant bg-surface-container-lowest text-on-surface hover:border-primary/40'
                          }`}
                        >
                          {pos}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              <div>
                <label className="block text-sm font-label font-semibold text-on-surface mb-3 uppercase tracking-wider">
                  How many products / menu items?
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {menuSizes.map((size) => {
                    const isSelected = formData.menuSize === size;
                    return (
                      <button
                        key={size}
                        type="button"
                        onClick={() => updateField('menuSize', size)}
                        className={`p-4 rounded-2xl border-2 transition-all text-sm font-semibold ${
                          isSelected
                            ? 'border-primary bg-primary/5 text-primary'
                            : 'border-outline-variant bg-surface-container-lowest text-on-surface hover:border-primary/40'
                        }`}
                      >
                        {size}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="block text-sm font-label font-semibold text-on-surface mb-2 uppercase tracking-wider">
                  Instagram handle
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant text-base">
                    @
                  </span>
                  <input
                    type="text"
                    value={formData.instagram}
                    onChange={(e) => updateField('instagram', e.target.value)}
                    placeholder="brewhousecafe"
                    className="w-full pl-9 pr-4 py-3.5 bg-surface-container-lowest border border-outline-variant rounded-xl text-base text-on-surface placeholder:text-on-surface-variant/50 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                  />
                </div>
                <p className="text-xs text-on-surface-variant mt-1.5 ml-1">
                  Optional — helps us verify your business faster
                </p>
              </div>
            </>
          )}

          {/* STEP 4 */}
          {step === 4 && (
            <>
              <div>
                <label className="block text-sm font-label font-semibold text-on-surface mb-2 uppercase tracking-wider">
                  Your name
                </label>
                <input
                  type="text"
                  value={formData.ownerName}
                  onChange={(e) => updateField('ownerName', e.target.value)}
                  placeholder="Sarah Mitchell"
                  className="w-full px-4 py-3.5 bg-surface-container-lowest border border-outline-variant rounded-xl text-base text-on-surface placeholder:text-on-surface-variant/50 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-label font-semibold text-on-surface mb-2 uppercase tracking-wider">
                  Your role
                </label>
                <input
                  type="text"
                  value={formData.ownerRole}
                  onChange={(e) => updateField('ownerRole', e.target.value)}
                  placeholder="e.g., Owner, Manager, Head Baker"
                  className="w-full px-4 py-3.5 bg-surface-container-lowest border border-outline-variant rounded-xl text-base text-on-surface placeholder:text-on-surface-variant/50 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-label font-semibold text-on-surface mb-2 uppercase tracking-wider">
                  Email
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => updateField('email', e.target.value)}
                  placeholder="sarah@brewhouse.co.uk"
                  className="w-full px-4 py-3.5 bg-surface-container-lowest border border-outline-variant rounded-xl text-base text-on-surface placeholder:text-on-surface-variant/50 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-label font-semibold text-on-surface mb-2 uppercase tracking-wider">
                  Phone
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => updateField('phone', e.target.value)}
                  placeholder="+44 7700 900123"
                  className="w-full px-4 py-3.5 bg-surface-container-lowest border border-outline-variant rounded-xl text-base text-on-surface placeholder:text-on-surface-variant/50 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                />
              </div>

              <div className="bg-secondary-container/50 border border-secondary/20 rounded-2xl p-4">
                <p className="text-sm font-semibold text-on-secondary-container mb-2">
                  What happens next?
                </p>
                <ul className="space-y-2 text-sm text-on-secondary-container/80">
                  <li className="flex items-start gap-2">
                    <Check size={16} className="text-primary flex-shrink-0 mt-0.5" />
                    We&apos;ll review your application within 48 hours
                  </li>
                  <li className="flex items-start gap-2">
                    <Check size={16} className="text-primary flex-shrink-0 mt-0.5" />
                    You&apos;ll get an email with next steps
                  </li>
                  <li className="flex items-start gap-2">
                    <Check size={16} className="text-primary flex-shrink-0 mt-0.5" />
                    Once approved, we&apos;ll help you set up your store
                  </li>
                </ul>
              </div>

              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.agreedToTerms}
                  onChange={(e) => updateField('agreedToTerms', e.target.checked)}
                  className="mt-1 w-5 h-5 rounded border-2 border-outline-variant text-primary focus:ring-2 focus:ring-primary/20 cursor-pointer accent-primary"
                />
                <span className="text-sm text-on-surface leading-relaxed">
                  I agree to OGuru&apos;s{' '}
                  <a href="#" className="text-primary font-semibold underline">
                    Vendor Terms
                  </a>{' '}
                  and{' '}
                  <a href="#" className="text-primary font-semibold underline">
                    Privacy Policy
                  </a>
                </span>
              </label>
            </>
          )}
        </div>

        {/* Bottom action */}
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
