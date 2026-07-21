'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
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
  Globe,
  Loader2,
  AlertCircle,
  Eye,
  EyeOff,
} from 'lucide-react';

type FormData = {
  // Owner + Auth
  ownerName: string;
  ownerRole: string;
  ownerEmail: string;
  ownerPhone: string;
  password: string;
  confirmPassword: string;

  // Business
  businessCountry: string;
  businessName: string;
  businessAddress: string;
  businessCity: string;
  businessPostcode: string;
  businessPhone: string;
  businessEmail: string;
  businessRegNumber: string;
  documentName: string;
  documentFile: File | null;

  // Agreements
  agreedToTerms: boolean;
  agreedToDataPolicy: boolean;
};

// Australia only for launch, others go to waitlist
const countries = [
  {
    code: 'AU',
    flag: '🇦🇺',
    name: 'Australia',
    postcodeLabel: 'Postcode',
    currency: 'AUD',
    symbol: '$',
    timezone: 'Australia/Sydney',
    available: true,
  },
];

const waitlistCountries = [
  { code: 'US', flag: '🇺🇸', name: 'United States' },
  { code: 'GB', flag: '🇬🇧', name: 'United Kingdom' },
  { code: 'NZ', flag: '🇳🇿', name: 'New Zealand' },
  { code: 'CA', flag: '🇨🇦', name: 'Canada' },
  { code: 'IE', flag: '🇮🇪', name: 'Ireland' },
];

export default function VendorApplyPage() {
  const router = useRouter();
  const supabase = createClient();

  const [step, setStep] = useState(1);
  const [countryDropdownOpen, setCountryDropdownOpen] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState<FormData>({
    ownerName: '',
    ownerRole: '',
    ownerEmail: '',
    ownerPhone: '',
    password: '',
    confirmPassword: '',
    businessCountry: 'AU',
    businessName: '',
    businessAddress: '',
    businessCity: '',
    businessPostcode: '',
    businessPhone: '',
    businessEmail: '',
    businessRegNumber: '',
    documentName: '',
    documentFile: null,
    agreedToTerms: false,
    agreedToDataPolicy: false,
  });

  const totalSteps = 3;
  const progress = (step / totalSteps) * 100;
  const selectedCountry = countries[0];

  const updateField = <K extends keyof FormData>(
    field: K,
    value: FormData[K]
  ) => {
    setFormData({ ...formData, [field]: value });
    if (error) setError(null);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      updateField('documentFile', file);
      updateField('documentName', file.name);
    }
  };

  const canProceed = () => {
    if (step === 1) {
      return (
        formData.ownerName &&
        formData.ownerRole &&
        formData.ownerEmail &&
        formData.ownerPhone &&
        formData.password.length >= 8 &&
        formData.password === formData.confirmPassword
      );
    }
    if (step === 2) {
      return (
        formData.businessCountry &&
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

  const submitApplication = async () => {
    setSubmitting(true);
    setError(null);

    try {
      console.log('Step 1: Creating auth account...');

      // Step 1: Create auth account
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.ownerEmail,
        password: formData.password,
        options: {
          data: {
            full_name: formData.ownerName,
          },
        },
      });

      if (authError) {
        console.error('Auth error:', authError);
        throw new Error(`Signup failed: ${authError.message}`);
      }
      if (!authData.user) {
        throw new Error('Failed to create account — no user returned');
      }

      console.log('Step 1 complete. User ID:', authData.user.id);

      // Give Supabase a moment to establish the session
      console.log('Step 2: Waiting for session...');
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Verify session is active
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        console.warn('No session yet, trying to sign in explicitly...');
        // Try to sign in explicitly if signUp didn't create a session
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email: formData.ownerEmail,
          password: formData.password,
        });
        if (signInError) {
          console.error('Sign in error:', signInError);
          throw new Error(`Auto login failed: ${signInError.message}`);
        }
      }
      console.log('Step 2 complete. Session established.');

      const userId = authData.user.id;

      // Step 3: Update profile with phone
      console.log('Step 3: Updating profile...');
      const { error: profileError } = await supabase
        .from('profiles')
        .update({
          full_name: formData.ownerName,
          phone: formData.ownerPhone,
          role: 'vendor',
        })
        .eq('id', userId);

      if (profileError) {
        console.error('Profile update error:', profileError);
        throw new Error(`Profile update failed: ${profileError.message}`);
      }
      console.log('Step 3 complete.');

      // Step 4: Upload document if provided
      let docUrl = null;
      if (formData.documentFile) {
        console.log('Step 4: Uploading document...');
        const fileExt = formData.documentFile.name.split('.').pop();
        const filePath = `${userId}/verification-${Date.now()}.${fileExt}`;

        const { error: uploadError } = await supabase.storage
          .from('verification-documents')
          .upload(filePath, formData.documentFile);

        if (uploadError) {
          console.error('Upload error:', uploadError);
          // Don't fail the whole submission for document upload
          console.warn('Document upload failed, continuing...');
        } else {
          docUrl = filePath;
          console.log('Step 4 complete. Document uploaded to:', filePath);
        }
      }

      // Step 5: Create business record
      console.log('Step 5: Creating business record...');
      const businessData = {
        owner_id: userId,
        legal_name: formData.businessName,
        registration_number: formData.businessRegNumber,
        owner_full_name: formData.ownerName,
        owner_role: formData.ownerRole,
        owner_email: formData.ownerEmail,
        owner_phone: formData.ownerPhone,
        business_email: formData.businessEmail,
        business_phone: formData.businessPhone,
        country_code: 'AU',
        currency: 'AUD',
        timezone: 'Australia/Sydney',
        status: 'pending',
        verification_doc_url: docUrl,
        verification_doc_name: formData.documentName || null,
      };
      console.log('Business data to insert:', businessData);

      const { data: business, error: businessError } = await supabase
        .from('businesses')
        .insert(businessData)
        .select()
        .single();

      if (businessError) {
        console.error('Business insert error:', businessError);
        console.error('Error details:', {
          code: businessError.code,
          message: businessError.message,
          details: businessError.details,
          hint: businessError.hint,
        });
        throw new Error(`Business creation failed: ${businessError.message}`);
      }
      if (!business) {
        throw new Error('Business created but no data returned');
      }
      console.log('Step 5 complete. Business ID:', business.id);

      // Step 6: Create primary location
      console.log('Step 6: Creating location...');
      const locationData = {
        business_id: business.id,
        name: formData.businessName,
        is_primary: true,
        address_line_1: formData.businessAddress,
        city: formData.businessCity,
        postcode: formData.businessPostcode,
        country_code: 'AU',
        is_active: true,
        is_accepting_orders: false,
      };
      console.log('Location data to insert:', locationData);

      const { error: locationError } = await supabase
        .from('locations')
        .insert(locationData);

      if (locationError) {
        console.error('Location insert error:', locationError);
        throw new Error(`Location creation failed: ${locationError.message}`);
      }
      console.log('Step 6 complete. Application submitted successfully!');

      // Success! Redirect
      router.push('/vendor/pending');
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Something went wrong';
      console.error('Submission failed:', err);
      setError(message);
      setSubmitting(false);
    }
  };

  const handleNext = () => {
    if (step < totalSteps) {
      setStep(step + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      submitApplication();
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
    "Create your account and tell us who's applying.",
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
              disabled={submitting}
              className="flex items-center gap-2 text-on-surface-variant hover:text-primary transition-colors text-sm font-label font-semibold disabled:opacity-50"
            >
              <ArrowLeft size={18} />
              Back
            </button>

            <p className="text-xs font-label font-semibold text-on-surface-variant uppercase tracking-wider">
              Step {step} of {totalSteps}
            </p>

            <button
              onClick={() => router.push('/vendor')}
              disabled={submitting}
              className="text-sm text-on-surface-variant hover:text-primary transition-colors font-label disabled:opacity-50"
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

        {/* Error banner */}
        {error && (
          <div className="mb-6 p-4 bg-error-container border border-error/20 rounded-xl flex items-start gap-3">
            <AlertCircle
              size={20}
              className="text-error flex-shrink-0 mt-0.5"
            />
            <div>
              <p className="text-sm font-semibold text-on-error-container">
                Something went wrong
              </p>
              <p className="text-sm text-on-error-container/80 mt-0.5">
                {error}
              </p>
            </div>
          </div>
        )}

        <div className="space-y-6">
          {/* STEP 1 — OWNER + AUTH */}
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
                  disabled={submitting}
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
                  disabled={submitting}
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
                  disabled={submitting}
                />
                <p className="text-xs text-on-surface-variant mt-1.5 ml-1">
                  This is your login email. We&apos;ll send approval decision
                  here.
                </p>
              </div>

              <div>
                <label className={labelClass}>Personal phone</label>
                <input
                  type="tel"
                  value={formData.ownerPhone}
                  onChange={(e) => updateField('ownerPhone', e.target.value)}
                  placeholder="+61 400 000 000"
                  className={inputClass}
                  disabled={submitting}
                />
                <p className="text-xs text-on-surface-variant mt-1.5 ml-1">
                  Kept private — never shown to customers
                </p>
              </div>

              <div>
                <label className={labelClass}>Create password</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={(e) => updateField('password', e.target.value)}
                    placeholder="At least 8 characters"
                    className={inputClass}
                    disabled={submitting}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-primary p-1"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {formData.password && formData.password.length < 8 && (
                  <p className="text-xs text-error mt-1.5 ml-1">
                    Password must be at least 8 characters
                  </p>
                )}
              </div>

              <div>
                <label className={labelClass}>Confirm password</label>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={formData.confirmPassword}
                  onChange={(e) =>
                    updateField('confirmPassword', e.target.value)
                  }
                  placeholder="Type your password again"
                  className={inputClass}
                  disabled={submitting}
                />
                {formData.confirmPassword &&
                  formData.password !== formData.confirmPassword && (
                    <p className="text-xs text-error mt-1.5 ml-1">
                      Passwords don&apos;t match
                    </p>
                  )}
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
              {/* Country selector — Australia only for launch */}
              <div className="relative">
                <label className={labelClass}>Country</label>
                <button
                  type="button"
                  onClick={() => setCountryDropdownOpen(!countryDropdownOpen)}
                  className={`${inputClass} flex items-center justify-between text-left`}
                  disabled={submitting}
                >
                  <span className="flex items-center gap-3">
                    <span className="text-2xl">{selectedCountry.flag}</span>
                    <span className="font-medium">{selectedCountry.name}</span>
                    <span className="text-sm text-on-surface-variant">
                      · {selectedCountry.currency}
                    </span>
                  </span>
                  <Globe size={18} className="text-on-surface-variant" />
                </button>

                {countryDropdownOpen && (
                  <>
                    <div
                      className="fixed inset-0 z-40"
                      onClick={() => setCountryDropdownOpen(false)}
                    />
                    <div className="absolute top-full left-0 right-0 mt-2 bg-surface-container-lowest border border-outline-variant rounded-xl shadow-organic-lg z-50 max-h-96 overflow-y-auto">
                      {/* Available */}
                      <div className="p-2 border-b border-outline-variant">
                        <p className="text-[10px] font-label font-bold text-on-surface-variant uppercase tracking-wider px-2 py-1">
                          Available now
                        </p>
                        {countries.map((country) => (
                          <button
                            key={country.code}
                            type="button"
                            onClick={() => {
                              updateField('businessCountry', country.code);
                              setCountryDropdownOpen(false);
                            }}
                            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-primary/5 transition-colors text-left ${
                              country.code === formData.businessCountry
                                ? 'bg-primary/10'
                                : ''
                            }`}
                          >
                            <span className="text-2xl">{country.flag}</span>
                            <div className="flex-1">
                              <p className="font-medium text-on-surface">
                                {country.name}
                              </p>
                              <p className="text-xs text-on-surface-variant">
                                {country.currency}
                              </p>
                            </div>
                            {country.code === formData.businessCountry && (
                              <Check size={18} className="text-primary" />
                            )}
                          </button>
                        ))}
                      </div>

                      {/* Waitlist */}
                      <div className="p-2">
                        <p className="text-[10px] font-label font-bold text-on-surface-variant uppercase tracking-wider px-2 py-1">
                          Coming soon
                        </p>
                        {waitlistCountries.map((country) => (
                          <div
                            key={country.code}
                            className="w-full flex items-center gap-3 px-3 py-2.5 opacity-60 cursor-not-allowed"
                          >
                            <span className="text-2xl">{country.flag}</span>
                            <div className="flex-1">
                              <p className="font-medium text-on-surface-variant text-sm">
                                {country.name}
                              </p>
                              <p className="text-xs text-on-surface-variant">
                                Join waitlist
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </>
                )}
                <p className="text-xs text-on-surface-variant mt-1.5 ml-1">
                  Currently launching in Australia
                </p>
              </div>

              <div>
                <label className={labelClass}>Business name</label>
                <input
                  type="text"
                  value={formData.businessName}
                  onChange={(e) => updateField('businessName', e.target.value)}
                  placeholder="e.g., Café Artisan"
                  className={inputClass}
                  disabled={submitting}
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
                  onChange={(e) =>
                    updateField('businessAddress', e.target.value)
                  }
                  placeholder="123 Bondi Road"
                  className={inputClass}
                  disabled={submitting}
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>City / Suburb</label>
                  <input
                    type="text"
                    value={formData.businessCity}
                    onChange={(e) =>
                      updateField('businessCity', e.target.value)
                    }
                    placeholder="Sydney"
                    className={inputClass}
                    disabled={submitting}
                  />
                </div>
                <div>
                  <label className={labelClass}>Postcode</label>
                  <input
                    type="text"
                    value={formData.businessPostcode}
                    onChange={(e) =>
                      updateField('businessPostcode', e.target.value)
                    }
                    placeholder="2026"
                    className={inputClass}
                    disabled={submitting}
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
                    Customers need to know where to visit and pick up orders.
                    Your address appears on your store page and maps.
                  </p>
                </div>
              </div>

              <div>
                <label className={labelClass}>Business phone</label>
                <input
                  type="tel"
                  value={formData.businessPhone}
                  onChange={(e) =>
                    updateField('businessPhone', e.target.value)
                  }
                  placeholder="+61 2 9000 0000"
                  className={inputClass}
                  disabled={submitting}
                />
              </div>

              <div>
                <label className={labelClass}>Business email</label>
                <input
                  type="email"
                  value={formData.businessEmail}
                  onChange={(e) =>
                    updateField('businessEmail', e.target.value)
                  }
                  placeholder="hello@cafeartisan.com.au"
                  className={inputClass}
                  disabled={submitting}
                />
              </div>

              <div>
                <label className={labelClass}>ABN</label>
                <input
                  type="text"
                  value={formData.businessRegNumber}
                  onChange={(e) =>
                    updateField('businessRegNumber', e.target.value)
                  }
                  placeholder="12 345 678 901"
                  className={inputClass}
                  disabled={submitting}
                />
                <p className="text-xs text-on-surface-variant mt-1.5 ml-1">
                  Australian Business Number
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
                        ABN registration, food licence, insurance certificate
                      </p>
                    </div>
                    <input
                      type="file"
                      onChange={handleFileUpload}
                      accept=".pdf,.jpg,.jpeg,.png"
                      className="hidden"
                      disabled={submitting}
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
                      <p className="text-xs text-on-surface-variant">
                        Ready to upload
                      </p>
                    </div>
                    <button
                      onClick={() => {
                        updateField('documentName', '');
                        updateField('documentFile', null);
                      }}
                      disabled={submitting}
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
                    Applicant & Login
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
                    <p className="text-xs text-on-surface-variant pt-1 italic">
                      Login email: {formData.ownerEmail}
                    </p>
                  </div>
                </div>

                <div className="h-px bg-outline/10" />

                <div>
                  <p className="text-xs font-label font-semibold text-outline uppercase tracking-widest mb-3">
                    Business
                  </p>
                  <div className="space-y-1.5">
                    <p className="font-semibold text-on-surface flex items-center gap-2">
                      <span className="text-lg">{selectedCountry.flag}</span>
                      {formData.businessName || 'Not provided'}
                    </p>
                    <p className="text-sm text-on-surface-variant">
                      {formData.businessAddress}
                    </p>
                    <p className="text-sm text-on-surface-variant">
                      {formData.businessCity}, {formData.businessPostcode}
                    </p>
                    <p className="text-sm text-on-surface-variant">
                      {selectedCountry.name} · {selectedCountry.currency}
                    </p>
                    <p className="text-sm text-on-surface-variant pt-2">
                      {formData.businessPhone}
                    </p>
                    <p className="text-sm text-on-surface-variant">
                      {formData.businessEmail}
                    </p>
                    <p className="text-sm text-on-surface-variant pt-2">
                      ABN: {formData.businessRegNumber}
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
                    <Check
                      size={16}
                      className="text-primary flex-shrink-0 mt-0.5"
                    />
                    We&apos;ll review your application within 48 hours
                  </li>
                  <li className="flex items-start gap-2">
                    <Check
                      size={16}
                      className="text-primary flex-shrink-0 mt-0.5"
                    />
                    You&apos;ll be logged in and can track your status
                  </li>
                  <li className="flex items-start gap-2">
                    <Check
                      size={16}
                      className="text-primary flex-shrink-0 mt-0.5"
                    />
                    Once approved, you can complete your store profile
                  </li>
                </ul>
              </div>

              <label className="flex items-start gap-3 cursor-pointer p-4 rounded-xl hover:bg-surface-container-low transition-colors">
                <input
                  type="checkbox"
                  checked={formData.agreedToTerms}
                  onChange={(e) =>
                    updateField('agreedToTerms', e.target.checked)
                  }
                  disabled={submitting}
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
                  disabled={submitting}
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
            disabled={submitting}
            className="flex items-center justify-center gap-2 px-6 py-4 border-2 border-outline-variant text-on-surface rounded-xl font-label font-semibold text-sm uppercase tracking-wider hover:bg-surface-container transition-colors disabled:opacity-50"
          >
            <ArrowLeft size={18} />
            {step === 1 ? 'Cancel' : 'Back'}
          </button>

          <button
            onClick={handleNext}
            disabled={!canProceed() || submitting}
            className={`flex items-center justify-center gap-2 px-8 py-4 rounded-xl font-label font-semibold text-sm uppercase tracking-wider transition-all shadow-lg ${
              canProceed() && !submitting
                ? 'bg-primary text-on-primary hover:scale-[1.02] active:scale-[0.98]'
                : 'bg-surface-container-highest text-on-surface-variant/50 cursor-not-allowed shadow-none'
            }`}
          >
            {submitting ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                Creating account...
              </>
            ) : step === totalSteps ? (
              'Submit application'
            ) : (
              <>
                Continue
                <ArrowRight size={18} />
              </>
            )}
          </button>
        </div>
      </div>
    </main>
  );
}