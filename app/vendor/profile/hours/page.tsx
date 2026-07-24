'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import type { Business, Location, OpeningHours } from '@/lib/supabase/types';
import {
  ArrowLeft,
  Clock,
  Loader2,
  Check,
  AlertCircle,
  Copy,
  Plus,
  X,
  Sun,
  Moon,
} from 'lucide-react';

const DAYS_OF_WEEK = [
  { value: 1, short: 'Mon', full: 'Monday' },
  { value: 2, short: 'Tue', full: 'Tuesday' },
  { value: 3, short: 'Wed', full: 'Wednesday' },
  { value: 4, short: 'Thu', full: 'Thursday' },
  { value: 5, short: 'Fri', full: 'Friday' },
  { value: 6, short: 'Sat', full: 'Saturday' },
  { value: 0, short: 'Sun', full: 'Sunday' },
];

// Ensure time is always HH:MM:SS format for PostgreSQL time type
const toPgTime = (time: string): string => {
  if (!time) return '09:00:00';
  const parts = time.split(':');
  const hours = (parts[0] || '09').padStart(2, '0');
  const minutes = (parts[1] || '00').padStart(2, '0');
  const seconds = (parts[2] || '00').padStart(2, '0');
  return `${hours}:${minutes}:${seconds}`;
};

// Convert HH:MM:SS to HH:MM for time input
const formatTimeForInput = (time: string | null): string => {
  if (!time) return '';
  return time.substring(0, 5);
};

const PRESETS = [
  {
    name: 'Standard café hours',
    description: 'Mon-Fri 7-5, Sat-Sun 8-4',
    schedule: [
      { day: 1, open: '07:00:00', close: '17:00:00' },
      { day: 2, open: '07:00:00', close: '17:00:00' },
      { day: 3, open: '07:00:00', close: '17:00:00' },
      { day: 4, open: '07:00:00', close: '17:00:00' },
      { day: 5, open: '07:00:00', close: '17:00:00' },
      { day: 6, open: '08:00:00', close: '16:00:00' },
      { day: 0, open: '08:00:00', close: '16:00:00' },
    ],
  },
  {
    name: 'Weekdays only',
    description: 'Mon-Fri 8-4, closed weekends',
    schedule: [
      { day: 1, open: '08:00:00', close: '16:00:00' },
      { day: 2, open: '08:00:00', close: '16:00:00' },
      { day: 3, open: '08:00:00', close: '16:00:00' },
      { day: 4, open: '08:00:00', close: '16:00:00' },
      { day: 5, open: '08:00:00', close: '16:00:00' },
    ],
  },
  {
    name: 'Weekend brunch',
    description: 'Sat-Sun 8-3, closed weekdays',
    schedule: [
      { day: 6, open: '08:00:00', close: '15:00:00' },
      { day: 0, open: '08:00:00', close: '15:00:00' },
    ],
  },
];

export default function OpeningHoursEditor() {
  const router = useRouter();
  const supabase = createClient();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [business, setBusiness] = useState<Business | null>(null);
  const [location, setLocation] = useState<Location | null>(null);
  const [hoursByDay, setHoursByDay] = useState<Record<number, OpeningHours[]>>({
    0: [],
    1: [],
    2: [],
    3: [],
    4: [],
    5: [],
    6: [],
  });
  const [savedIndicator, setSavedIndicator] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copyFromDay, setCopyFromDay] = useState<number | null>(null);

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

      if (!locationData) {
        setError('No primary location found');
        return;
      }

      setLocation(locationData);

      const { data: hoursData, error: hoursError } = await supabase
        .from('opening_hours')
        .select('*')
        .eq('location_id', locationData.id)
        .order('day_of_week')
        .order('shift_order');

      if (hoursError) {
        console.error('Error loading hours:', hoursError);
      }

      if (hoursData) {
        const grouped: Record<number, OpeningHours[]> = {
          0: [], 1: [], 2: [], 3: [], 4: [], 5: [], 6: [],
        };
        hoursData.forEach((h) => {
          if (grouped[h.day_of_week]) {
            grouped[h.day_of_week].push(h);
          }
        });
        setHoursByDay(grouped);
      }
    } catch (err) {
      console.error(err);
      setError('Failed to load hours');
    } finally {
      setLoading(false);
    }
  };

  const showSavedIndicator = () => {
    setSavedIndicator(true);
    setTimeout(() => setSavedIndicator(false), 2000);
  };

  const applyPreset = async (preset: typeof PRESETS[0]) => {
    if (!location) return;

    if (!confirm(`Apply "${preset.name}"? This will replace your current hours.`)) {
      return;
    }

    setSaving(true);
    setError(null);

    try {
      // Delete all existing hours
      const { error: deleteError } = await supabase
        .from('opening_hours')
        .delete()
        .eq('location_id', location.id);

      if (deleteError) {
        throw new Error(`Delete failed: ${deleteError.message}`);
      }

      // Insert new hours
      const hoursToInsert = preset.schedule.map((h) => ({
        location_id: location.id,
        day_of_week: h.day,
        opens_at: h.open,
        closes_at: h.close,
        is_closed: false,
        shift_order: 1,
      }));

      console.log('Inserting hours:', hoursToInsert);

      const { data, error: insertError } = await supabase
        .from('opening_hours')
        .insert(hoursToInsert)
        .select();

      if (insertError) {
        console.error('Insert error details:', insertError);
        throw new Error(`Insert failed: ${insertError.message}`);
      }

      console.log('Inserted:', data);

      await loadData();
      showSavedIndicator();
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Failed';
      console.error('Full error:', err);
      setError(msg);
    } finally {
      setSaving(false);
    }
  };

  const addShift = async (dayOfWeek: number) => {
    if (!location) return;
    setSaving(true);
    setError(null);

    const existingShifts = hoursByDay[dayOfWeek] || [];
    const shiftOrder = existingShifts.length + 1;

    const defaultOpen = shiftOrder === 2 ? '18:00:00' : '09:00:00';
    const defaultClose = shiftOrder === 2 ? '22:00:00' : '17:00:00';

    const insertData = {
      location_id: location.id,
      day_of_week: dayOfWeek,
      opens_at: defaultOpen,
      closes_at: defaultClose,
      is_closed: false,
      shift_order: shiftOrder,
    };

    console.log('Adding shift:', insertData);

    const { data, error: insertError } = await supabase
      .from('opening_hours')
      .insert(insertData)
      .select()
      .single();

    if (!insertError && data) {
      setHoursByDay((prev) => ({
        ...prev,
        [dayOfWeek]: [...(prev[dayOfWeek] || []), data],
      }));
      showSavedIndicator();
    } else if (insertError) {
      console.error('Add shift error:', insertError);
      setError(insertError.message);
    }

    setSaving(false);
  };

  const removeShift = async (shiftId: string, dayOfWeek: number) => {
    setSaving(true);
    setError(null);

    const { error: deleteError } = await supabase
      .from('opening_hours')
      .delete()
      .eq('id', shiftId);

    if (!deleteError) {
      setHoursByDay((prev) => ({
        ...prev,
        [dayOfWeek]: (prev[dayOfWeek] || []).filter((s) => s.id !== shiftId),
      }));
      showSavedIndicator();
    } else {
      setError(deleteError.message);
    }

    setSaving(false);
  };

  const updateShift = async (
    shiftId: string,
    dayOfWeek: number,
    field: 'opens_at' | 'closes_at',
    value: string
  ) => {
    if (!value) return;

    const pgTime = toPgTime(value);

    // Optimistic update
    setHoursByDay((prev) => ({
      ...prev,
      [dayOfWeek]: (prev[dayOfWeek] || []).map((s) =>
        s.id === shiftId ? { ...s, [field]: pgTime } : s
      ),
    }));

    const { error: updateError } = await supabase
      .from('opening_hours')
      .update({ [field]: pgTime })
      .eq('id', shiftId);

    if (!updateError) {
      showSavedIndicator();
    } else {
      console.error('Update error:', updateError);
      setError(updateError.message);
    }
  };

  const toggleClosed = async (dayOfWeek: number) => {
    if (!location) return;
    setSaving(true);
    setError(null);

    const existingShifts = hoursByDay[dayOfWeek] || [];

    if (existingShifts.length > 0) {
      // Delete to mark as closed
      const { error: deleteError } = await supabase
        .from('opening_hours')
        .delete()
        .eq('location_id', location.id)
        .eq('day_of_week', dayOfWeek);

      if (!deleteError) {
        setHoursByDay((prev) => ({ ...prev, [dayOfWeek]: [] }));
        showSavedIndicator();
      } else {
        console.error('Toggle close error:', deleteError);
        setError(deleteError.message);
      }
    } else {
      // Add default shift to open
      const insertData = {
        location_id: location.id,
        day_of_week: dayOfWeek,
        opens_at: '09:00:00',
        closes_at: '17:00:00',
        is_closed: false,
        shift_order: 1,
      };

      console.log('Opening day with:', insertData);

      const { data, error: insertError } = await supabase
        .from('opening_hours')
        .insert(insertData)
        .select()
        .single();

      if (!insertError && data) {
        setHoursByDay((prev) => ({ ...prev, [dayOfWeek]: [data] }));
        showSavedIndicator();
      } else if (insertError) {
        console.error('Toggle open error:', insertError);
        setError(insertError.message);
      }
    }

    setSaving(false);
  };

  const copyFromDayToDay = async (fromDay: number, toDay: number) => {
    if (!location) return;
    setSaving(true);
    setError(null);

    const sourceShifts = hoursByDay[fromDay] || [];

    if (sourceShifts.length === 0) {
      setError('Source day has no hours to copy');
      setSaving(false);
      return;
    }

    // Delete existing on target day
    await supabase
      .from('opening_hours')
      .delete()
      .eq('location_id', location.id)
      .eq('day_of_week', toDay);

    const copies = sourceShifts.map((s) => ({
      location_id: location.id,
      day_of_week: toDay,
      opens_at: s.opens_at,
      closes_at: s.closes_at,
      is_closed: false,
      shift_order: s.shift_order,
    }));

    const { error: insertError } = await supabase
      .from('opening_hours')
      .insert(copies);

    if (!insertError) {
      await loadData();
      showSavedIndicator();
      setCopyFromDay(null);
    } else {
      setError(insertError.message);
    }

    setSaving(false);
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

  const daysWithHours = DAYS_OF_WEEK.filter((d) => hoursByDay[d.value]?.length > 0).length;

  return (
    <main className="min-h-screen bg-surface">
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

      <div className="max-w-3xl mx-auto px-4 md:px-6 py-8 md:py-12">
        <div className="mb-8">
          <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mb-4">
            <Clock size={28} />
          </div>
          <h1 className="font-display text-3xl md:text-4xl font-bold text-on-surface tracking-tight">
            Opening Hours
          </h1>
          <p className="text-base text-on-surface-variant mt-2">
            When can customers visit or pick up orders?
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-error-container border border-error/20 rounded-xl flex items-start gap-3">
            <AlertCircle size={20} className="text-error flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm font-semibold text-on-error-container mb-1">
                Something went wrong
              </p>
              <p className="text-xs text-on-error-container/80">{error}</p>
            </div>
            <button
              onClick={() => setError(null)}
              className="text-on-error-container/60 hover:text-on-error-container"
            >
              ✕
            </button>
          </div>
        )}

        <section className="mb-8">
          <h2 className="font-display text-lg font-semibold text-on-surface mb-3">
            Quick start
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {PRESETS.map((preset, i) => (
              <button
                key={i}
                onClick={() => applyPreset(preset)}
                disabled={saving}
                className="p-4 bg-surface-container-lowest border border-outline-variant rounded-xl hover:border-primary/40 hover:shadow-organic-sm transition-all text-left disabled:opacity-50"
              >
                <p className="font-display font-semibold text-sm text-on-surface">
                  {preset.name}
                </p>
                <p className="text-xs text-on-surface-variant mt-1">
                  {preset.description}
                </p>
              </button>
            ))}
          </div>
        </section>

        <section className="mb-8">
          <h2 className="font-display text-lg font-semibold text-on-surface mb-3">
            Weekly hours
          </h2>
          <p className="text-sm text-on-surface-variant mb-4">
            Set your own or override the presets above.
          </p>

          <div className="space-y-3">
            {DAYS_OF_WEEK.map((day) => {
              const shifts = hoursByDay[day.value] || [];
              const isClosed = shifts.length === 0;
              const isCopySource = copyFromDay === day.value;

              return (
                <div
                  key={day.value}
                  className={`bg-surface-container-lowest border rounded-2xl p-4 transition-all ${
                    isCopySource
                      ? 'border-primary shadow-organic-sm'
                      : 'border-outline-variant'
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-12 h-12 rounded-xl flex items-center justify-center font-display font-bold text-sm ${
                          isClosed
                            ? 'bg-surface-container-highest text-on-surface-variant'
                            : 'bg-primary/10 text-primary'
                        }`}
                      >
                        {day.short}
                      </div>
                      <div>
                        <p className="font-display font-semibold text-on-surface">
                          {day.full}
                        </p>
                        <p className="text-xs text-on-surface-variant">
                          {isClosed
                            ? 'Closed'
                            : shifts.length === 1
                              ? 'Open'
                              : `${shifts.length} shifts`}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {!isClosed && shifts.length > 0 && (
                        <button
                          onClick={() => setCopyFromDay(day.value)}
                          disabled={saving}
                          className={`p-2 rounded-lg transition-colors ${
                            isCopySource
                              ? 'bg-primary text-on-primary'
                              : 'text-on-surface-variant hover:bg-surface-container'
                          }`}
                          title="Copy hours to another day"
                        >
                          <Copy size={16} />
                        </button>
                      )}
                      <button
                        onClick={() => toggleClosed(day.value)}
                        disabled={saving}
                        className={`px-3 py-1.5 rounded-lg text-xs font-label font-semibold uppercase tracking-wider transition-colors ${
                          isClosed
                            ? 'bg-primary text-on-primary hover:opacity-90'
                            : 'bg-surface-container-highest text-on-surface-variant hover:bg-error/10 hover:text-error'
                        }`}
                      >
                        {isClosed ? 'Open' : 'Close'}
                      </button>
                    </div>
                  </div>

                  {isCopySource && (
                    <div className="p-3 bg-primary/5 border border-primary/20 rounded-lg mb-3">
                      <p className="text-xs font-semibold text-primary mb-2">
                        Copy these hours to which day?
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {DAYS_OF_WEEK.filter((d) => d.value !== day.value).map(
                          (targetDay) => (
                            <button
                              key={targetDay.value}
                              onClick={() =>
                                copyFromDayToDay(day.value, targetDay.value)
                              }
                              disabled={saving}
                              className="px-3 py-1.5 bg-primary text-on-primary rounded-lg text-xs font-label font-semibold uppercase hover:opacity-90 transition-opacity"
                            >
                              {targetDay.short}
                            </button>
                          )
                        )}
                        <button
                          onClick={() => setCopyFromDay(null)}
                          className="px-3 py-1.5 bg-surface-container-high text-on-surface-variant rounded-lg text-xs font-label font-semibold uppercase hover:opacity-90"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  )}

                  {!isClosed && shifts.length > 0 && (
                    <div className="space-y-2">
                      {shifts.map((shift, idx) => (
                        <div
                          key={shift.id}
                          className="flex items-center gap-2 p-3 bg-surface-container rounded-xl"
                        >
                          <div className="flex-shrink-0 text-on-surface-variant">
                            {idx === 0 ? <Sun size={16} /> : <Moon size={16} />}
                          </div>

                          <input
                            type="time"
                            value={formatTimeForInput(shift.opens_at)}
                            onChange={(e) =>
                              updateShift(shift.id, day.value, 'opens_at', e.target.value)
                            }
                            className="flex-1 px-3 py-2 bg-surface-container-lowest border border-outline-variant rounded-lg text-sm font-medium text-on-surface focus:outline-none focus:border-primary"
                          />

                          <span className="text-xs text-on-surface-variant">to</span>

                          <input
                            type="time"
                            value={formatTimeForInput(shift.closes_at)}
                            onChange={(e) =>
                              updateShift(shift.id, day.value, 'closes_at', e.target.value)
                            }
                            className="flex-1 px-3 py-2 bg-surface-container-lowest border border-outline-variant rounded-lg text-sm font-medium text-on-surface focus:outline-none focus:border-primary"
                          />

                          {shifts.length > 1 && (
                            <button
                              onClick={() => removeShift(shift.id, day.value)}
                              disabled={saving}
                              className="p-2 text-on-surface-variant hover:text-error transition-colors"
                              title="Remove shift"
                            >
                              <X size={16} />
                            </button>
                          )}
                        </div>
                      ))}

                      {shifts.length < 2 && (
                        <button
                          onClick={() => addShift(day.value)}
                          disabled={saving}
                          className="w-full flex items-center justify-center gap-2 p-2 border border-dashed border-outline-variant rounded-lg text-xs text-on-surface-variant hover:border-primary/40 hover:text-primary transition-colors"
                        >
                          <Plus size={14} />
                          Add split shift (e.g., lunch break)
                        </button>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        <div className="p-4 bg-surface-container-low border border-outline-variant rounded-xl flex items-center gap-3">
          <div
            className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
              daysWithHours >= 3
                ? 'bg-primary text-on-primary'
                : 'bg-surface-container-highest text-on-surface-variant'
            }`}
          >
            {daysWithHours >= 3 ? <Check size={20} /> : <Clock size={18} />}
          </div>
          <div className="flex-1">
            <p className="font-display font-semibold text-sm text-on-surface">
              {daysWithHours >= 3 ? 'Section complete!' : `Set at least 3 days (${daysWithHours}/3)`}
            </p>
            <p className="text-xs text-on-surface-variant">
              {daysWithHours >= 3
                ? "Customers can see when you're open"
                : 'Add more days or apply a preset above'}
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