'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import type { Business, Location } from '@/lib/supabase/types';
import {
  ArrowLeft,
  MapPin,
  Loader2,
  Check,
  AlertCircle,
  Info,
  Globe,
} from 'lucide-react';

const AUSTRALIAN_STATES = [
  { code: 'NSW', name: 'New South Wales' },
  { code: 'VIC', name: 'Victoria' },
  { code: 'QLD', name: 'Queensland' },
  { code: 'WA', name: 'Western Australia' },
  { code: 'SA', name: 'South Australia' },
  { code: 'TAS', name: 'Tasmania' },
  { code: 'ACT', name: 'Australian Capital Territory' },
  { code: 'NT', name: 'Northern Territory' },
];

export default function AddressEditor() {
  const router = useRouter();
  const supabase = createClient();

  const [loading, setLoading] = useState(true);
  const [business, setBusiness] = useState<Business | null>(null);
  const [location, setLocation] = useState<Location | null>(null);
  const [savedIndicator, setSavedIndicator] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form state
  const [addressLine1, setAddressLine1] = useState('');
  const [addressLine2, setAddressLine2] = useState('');
  const [suburb, setSuburb] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [postcode, setPostcode] = useState('');
  const [neighborhood, setNeighborhood] = useState('');
  const [accessNotes, setAccessNotes] = useState('');

  // Debounce timers
  const timers = useRef<Record<string, NodeJS.Timeout>>({});

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/login');
        return;
      }

      const { data: businessData } = await supabase
        .from('businesses')
        .select('*')
        .eq('owner_id', user.id)
        .single();

      if (!businessData || businessData.status !== 'approved') {
        router.push('/vendor/pending');
        return;
      }

      setBusiness(businessData);

      const { data: locationData } = await supabase
        .from('locations')
        .select('*')
        .eq('business_id', businessData.id)
        .eq('is_primary', true)
        .single();

      if (locationData) {
        setLocation(locationData);
        setAddressLine1(locationData.address_line_1 || '');
        setAddressLine2(locationData.address_line_2 || '');
        setSuburb(locationData.suburb || '');
        setCity(locationData.city || '');
        setState(locationData.state || '');
        setPostcode(locationData.postcode || '');
        setNeighborhood(locationData.neighborhood || '');
        setAccessNotes(locationData.access_notes || '');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const showSavedIndicator = () => {
    setSavedIndicator(true);
    setTimeout(() => setSavedIndicator(false), 2000);
  };

  const saveField = async (field: string, value: string | null) => {
    if (!location) return;

    const { error: updateError } = await supabase
      .from('locations')
      .update({ [field]: value || null })
      .eq('id', location.id);

    if (!updateError) {
      setLocation({ ...location, [field]: value || null } as Location);
      showSavedIndicator();
    } else {
      setError(updateError.message);
    }
  };

  const debounceSave = (field: string, value: string | null) => {
    if (timers.current[field]) {
      clearTimeout(timers.current[field]);
    }
    timers.current[field] = setTimeout(() => {
      saveField(field, value);
    }, 800);
  };

  const handleFieldChange = (
    field: string,
    value: string,
    setter: (v: string) => void
  ) => {
    setter(value);
    debounceSave(field, value);
  };

  // For dropdown — save immediately, no debounce
  const handleStateChange = async (value: string) => {
    setState(value);
    await saveField('state', value);
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-surface flex flex-col items-center justify-center">
        <Loader2 size={40} className="text-primary animate-spin mb-4" />
        <p className="text-on-surface-variant">Loading...</p>
      </main>
    );
  }

  if (!business || !location) return null;

  const isComplete = !!(addressLine1 && city && postcode);

  const inputClass =
    'w-full px-4 py-3 bg-surface-container-lowest border border-outline-variant rounded-xl text-base text-on-surface placeholder:text-on-surface-variant/50 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all';

  const labelClass =
    'block text-sm font-label font-semibold text-on-surface mb-2 uppercase tracking-wider';

  return (
    <main className="min-h-screen bg-surface">
      {/* Top Bar */}
      <header className="sticky top-0 z-40 bg-surface/95 backdrop-blur-md border-b border-outline-variant">
        <div className="max-w-3xl mx-auto px-4 md:px-6 py-4 flex items-center justify-between">
          <button
            onClick={() => router.push('/vendor/settings')}
            className="flex items-center gap-2 text-on-surface-variant hover:text-primary transition-colors font-label font-semibold text-sm"
          >
            <ArrowLeft size={18} />
            <span className="hidden sm:inline">Back to settings</span>
            <span className="sm:hidden">Back</span>
          </button>

          <div className="flex items-center gap-2 text-sm min-w-[80px] justify-end">
            {savedIndicator && (
              <span className="flex items-center gap-1.5 text-primary font-semibold text-xs animate-fade-in">
                <Check size={14} />
                Saved
              </span>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-3xl mx-auto px-4 md:px-6 py-8 md:py-12">
        {/* Header */}
        <div className="mb-8">
          <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mb-4">
            <MapPin size={28} />
          </div>
          <h1 className="font-display text-3xl md:text-4xl font-bold text-on-surface tracking-tight">
            Location
          </h1>
          <p className="text-base text-on-surface-variant mt-2">
            Where customers can find you.
          </p>
        </div>

        {/* Error banner */}
        {error && (
          <div className="mb-6 p-4 bg-error-container border border-error/20 rounded-xl flex items-start gap-3">
            <AlertCircle size={20} className="text-error flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm text-on-error-container">{error}</p>
            </div>
            <button
              onClick={() => setError(null)}
              className="text-on-error-container/60 hover:text-on-error-container"
            >
              ✕
            </button>
          </div>
        )}

        {/* Info banner about public address */}
        <div className="mb-6 p-4 bg-secondary-container/40 border border-secondary/20 rounded-xl flex items-start gap-3">
          <div className="w-8 h-8 rounded-lg bg-secondary/20 flex items-center justify-center text-secondary flex-shrink-0">
            <Info size={16} />
          </div>
          <div>
            <p className="text-sm font-semibold text-on-secondary-container mb-1">
              Your address appears on customer-facing pages
            </p>
            <p className="text-xs text-on-secondary-container/80">
              Customers need this to visit you or arrange pickups. It appears on your store page and on the map.
            </p>
          </div>
        </div>

        {/* Country (read-only for launch) */}
        <section className="mb-6">
          <label className={labelClass}>Country</label>
          <div className={`${inputClass} flex items-center gap-3 bg-surface-container cursor-not-allowed`}>
            <span className="text-2xl">🇦🇺</span>
            <span className="font-medium text-on-surface">Australia</span>
            <span className="text-xs text-on-surface-variant ml-auto">
              · {business.currency}
            </span>
          </div>
          <p className="text-xs text-on-surface-variant mt-1.5 ml-1">
            Contact support to change your country
          </p>
        </section>

        {/* Address Line 1 */}
        <section className="mb-6">
          <label className={labelClass}>Street address</label>
          <input
            type="text"
            value={addressLine1}
            onChange={(e) =>
              handleFieldChange('address_line_1', e.target.value, setAddressLine1)
            }
            placeholder="123 Main Street"
            className={inputClass}
          />
        </section>

        {/* Address Line 2 (optional) */}
        <section className="mb-6">
          <label className={labelClass}>
            Address line 2{' '}
            <span className="text-on-surface-variant lowercase font-normal normal-case ml-1">
              (optional)
            </span>
          </label>
          <input
            type="text"
            value={addressLine2}
            onChange={(e) =>
              handleFieldChange('address_line_2', e.target.value, setAddressLine2)
            }
            placeholder="Shop 4, Level 2, Building name..."
            className={inputClass}
          />
          <p className="text-xs text-on-surface-variant mt-1.5 ml-1">
            Unit, suite, floor, building name
          </p>
        </section>

        {/* Suburb (optional) */}
        <section className="mb-6">
          <label className={labelClass}>
            Suburb{' '}
            <span className="text-on-surface-variant lowercase font-normal normal-case ml-1">
              (optional)
            </span>
          </label>
          <input
            type="text"
            value={suburb}
            onChange={(e) =>
              handleFieldChange('suburb', e.target.value, setSuburb)
            }
            placeholder="Bondi"
            className={inputClass}
          />
        </section>

        {/* City & State side by side on desktop */}
        <section className="mb-6 grid md:grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>City</label>
            <input
              type="text"
              value={city}
              onChange={(e) =>
                handleFieldChange('city', e.target.value, setCity)
              }
              placeholder="Sydney"
              className={inputClass}
            />
          </div>

          <div>
            <label className={labelClass}>
              State{' '}
              <span className="text-on-surface-variant lowercase font-normal normal-case ml-1">
                (optional)
              </span>
            </label>
            <select
              value={state}
              onChange={(e) => handleStateChange(e.target.value)}
              className={`${inputClass} cursor-pointer`}
            >
              <option value="">Select state...</option>
              {AUSTRALIAN_STATES.map((s) => (
                <option key={s.code} value={s.code}>
                  {s.name} ({s.code})
                </option>
              ))}
            </select>
          </div>
        </section>

        {/* Postcode */}
        <section className="mb-6">
          <label className={labelClass}>Postcode</label>
          <input
            type="text"
            value={postcode}
            onChange={(e) =>
              handleFieldChange('postcode', e.target.value, setPostcode)
            }
            placeholder="2026"
            maxLength={4}
            className={inputClass}
          />
        </section>

        {/* Neighborhood (helps discovery) */}
        <section className="mb-6">
          <label className={labelClass}>
            Neighborhood{' '}
            <span className="text-on-surface-variant lowercase font-normal normal-case ml-1">
              (optional)
            </span>
          </label>
          <input
            type="text"
            value={neighborhood}
            onChange={(e) =>
              handleFieldChange('neighborhood', e.target.value, setNeighborhood)
            }
            placeholder="e.g., Bondi Junction, Newtown, Surry Hills"
            className={inputClass}
          />
          <p className="text-xs text-on-surface-variant mt-1.5 ml-1">
            💡 Helps customers find you when searching by area
          </p>
        </section>

        {/* Access Notes (very useful) */}
        <section className="mb-8">
          <label className={labelClass}>
            Access notes{' '}
            <span className="text-on-surface-variant lowercase font-normal normal-case ml-1">
              (optional)
            </span>
          </label>
          <textarea
            value={accessNotes}
            onChange={(e) =>
              handleFieldChange('access_notes', e.target.value, setAccessNotes)
            }
            rows={4}
            placeholder="Parking available at the back. Enter through the side alley. Ring the buzzer if door is closed..."
            className={`${inputClass} resize-none`}
          />
          <p className="text-xs text-on-surface-variant mt-1.5 ml-1">
            Help customers find the entrance, parking, or any special access info
          </p>
        </section>

        {/* Preview card */}
        {isComplete && (
          <section className="mb-8">
            <p className="text-xs font-label font-semibold text-on-surface-variant uppercase tracking-wider mb-3">
              How it appears
            </p>
            <div className="p-4 bg-surface-container-low border border-outline-variant rounded-xl flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary flex-shrink-0">
                <MapPin size={18} />
              </div>
              <div className="flex-1">
                <p className="font-display font-semibold text-on-surface">
                  {business.legal_name}
                </p>
                <p className="text-sm text-on-surface-variant mt-0.5">
                  {addressLine1}
                  {addressLine2 && `, ${addressLine2}`}
                </p>
                <p className="text-sm text-on-surface-variant">
                  {[suburb, city, state, postcode].filter(Boolean).join(', ')}
                </p>
                {neighborhood && (
                  <p className="text-xs text-primary mt-1">
                    📍 {neighborhood}
                  </p>
                )}
                {accessNotes && (
                  <p className="text-xs text-on-surface-variant mt-2 italic bg-surface-container-lowest p-2 rounded">
                    {accessNotes}
                  </p>
                )}
              </div>
            </div>
          </section>
        )}

        {/* Completion status */}
        <div className="p-4 bg-surface-container-low border border-outline-variant rounded-xl flex items-center gap-3">
          <div
            className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
              isComplete
                ? 'bg-primary text-on-primary'
                : 'bg-surface-container-highest text-on-surface-variant'
            }`}
          >
            {isComplete ? <Check size={20} /> : <MapPin size={18} />}
          </div>
          <div className="flex-1">
            <p className="font-display font-semibold text-sm text-on-surface">
              {isComplete ? 'Location complete!' : 'Add your address'}
            </p>
            <p className="text-xs text-on-surface-variant">
              {isComplete
                ? 'Customers can find your store'
                : 'At minimum: street address, city, and postcode'}
            </p>
          </div>
        </div>

        <p className="text-center text-sm text-on-surface-variant mt-6">
          Changes auto-save · Back to settings when done
        </p>
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(-4px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }
      `}</style>
    </main>
  );
}