'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  XIcon,
  PhoneIcon,
  CalendarIcon,
  ZapIcon,
  ChevronDown,
  CheckCircleIcon,
  GiftIcon,
  ShareIcon,
} from '@/components/icons';

type Step = 1 | 2 | 3;
type RecipientTab = 'PHONE' | 'EMAIL' | 'CONTACTS';
type ScheduleTiming = 'NOW' | 'LATER';

export default function SendGiftPage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>(1);

  // Step 1 State
  const [recipientTab, setRecipientTab] = useState<RecipientTab>('PHONE');
  const [countryCode, setCountryCode] = useState('US +1');
  const [phoneNumber, setPhoneNumber] = useState('(213) 555-0198');
  const [email, setEmail] = useState('alex.rivera@example.com');
  const [timing, setTiming] = useState<ScheduleTiming>('LATER');
  const [scheduleDate, setScheduleDate] = useState('2025-10-24');
  const [scheduleTime, setScheduleTime] = useState('09:30');
  const [scheduleNote, setScheduleNote] = useState('Birthday coffee for Alex');

  // Step 2 State
  const [message, setMessage] = useState('Happy Birthday! Hope this brightens your day! - John');
  const [cardTheme, setCardTheme] = useState('Birthday');

  // Step 3 State
  const [isProcessing, setIsSaving] = useState(false);
  const [isSent, setIsSent] = useState(false);

  // Selected item (passed or fallback)
  const item = {
    name: 'Caramel Latte',
    price: '$6.50',
    vendor: 'Brew Haven Cafe',
    image: 'https://images.unsplash.com/photo-1541167760496-1628856ab772?auto=format&fit=crop&q=80&w=200',
  };

  const handleNext = () => {
    if (step === 1) setStep(2);
    else if (step === 2) setStep(3);
  };

  const handleCompleteSend = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      setIsSent(true);
    }, 1200);
  };

  return (
    <main className="min-h-screen bg-[#f6f4eb] pb-32 font-body selection:bg-[#4a6410] selection:text-white">
      {/* ---- Header ---- */}
      <header className="sticky top-0 z-40 border-b border-[#1b1c19]/5 bg-[#f6f4eb] px-5 pt-12 pb-4">
        <div className="mx-auto flex max-w-lg items-center justify-between">
          <button
            onClick={() => {
              if (step > 1) setStep((s) => (s - 1) as Step);
              else router.push('/gifts');
            }}
            className="flex h-10 w-10 items-center justify-center rounded-full text-[#4a6410] transition hover:bg-[#1b1c19]/5"
          >
            <ArrowLeft className="h-6 w-6" />
          </button>

          <div className="text-center">
            <h1 className="font-display text-lg font-bold text-[#4a6410]">Send Gift</h1>
            <p className="font-label text-[10px] font-extrabold uppercase tracking-widest text-[#44483a]/60">
              STEP {step} OF 3
            </p>
          </div>

          <Link
            href="/gifts"
            className="flex h-10 w-10 items-center justify-center rounded-full text-[#44483a] transition hover:bg-[#1b1c19]/5"
          >
            <XIcon className="h-6 w-6" />
          </Link>
        </div>
      </header>

      <div className="mx-auto max-w-lg px-5 pt-6">
        {/* ========================================================= */}
        {/* STEP 1: RECIPIENT & TIMING (Matches Screenshot) */}
        {/* ========================================================= */}
        {step === 1 && (
          <div className="animate-fade-in space-y-6">
            <div>
              <h2 className="font-display text-3xl font-extrabold text-[#2d3b0c]">
                Who&apos;s this gift for?
              </h2>
              <p className="mt-1 font-body text-sm text-[#44483a]/70">
                They&apos;ll receive a link to claim it
              </p>
            </div>

            {/* YOU'RE SENDING Banner */}
            <div className="flex items-center gap-4 rounded-2xl bg-[#ebe8db] p-4 shadow-sm">
              <img
                src={item.image}
                alt={item.name}
                className="h-16 w-16 rounded-xl object-cover shadow-sm"
              />
              <div>
                <p className="font-label text-[10px] font-extrabold uppercase tracking-wider text-[#924700]">
                  YOU&apos;RE SENDING:
                </p>
                <h3 className="font-display text-lg font-bold text-[#4a6410]">
                  {item.name}
                </h3>
                <p className="font-display text-sm font-bold text-[#924700]">
                  {item.price}
                </p>
              </div>
            </div>

            {/* Delivery Method Tabs */}
            <div className="flex rounded-xl bg-[#ebe8db] p-1">
              <button
                onClick={() => setRecipientTab('PHONE')}
                className={`flex-1 rounded-lg py-2.5 font-label text-xs font-bold transition-all ${
                  recipientTab === 'PHONE'
                    ? 'bg-white text-[#4a6410] shadow-sm'
                    : 'text-[#44483a]/60 hover:text-[#1b1c19]'
                }`}
              >
                PHONE NUMBER
              </button>
              <button
                onClick={() => setRecipientTab('EMAIL')}
                className={`flex-1 rounded-lg py-2.5 font-label text-xs font-bold transition-all ${
                  recipientTab === 'EMAIL'
                    ? 'bg-white text-[#4a6410] shadow-sm'
                    : 'text-[#44483a]/60 hover:text-[#1b1c19]'
                }`}
              >
                EMAIL
              </button>
              <button
                onClick={() => setRecipientTab('CONTACTS')}
                className={`flex-1 rounded-lg py-2.5 font-label text-xs font-bold transition-all ${
                  recipientTab === 'CONTACTS'
                    ? 'bg-white text-[#4a6410] shadow-sm'
                    : 'text-[#44483a]/60 hover:text-[#1b1c19]'
                }`}
              >
                CONTACTS
              </button>
            </div>

            {/* Input Row */}
            {recipientTab === 'PHONE' && (
              <div className="flex gap-2">
                <div className="relative flex items-center rounded-xl bg-[#ebe8db] px-3 py-3.5 font-label text-xs font-bold text-[#1b1c19]">
                  <span>US +1</span>
                  <ChevronDown className="ml-1 h-3.5 w-3.5 text-[#44483a]" />
                </div>
                <div className="relative flex flex-1 items-center rounded-xl bg-[#ebe8db] px-4 py-3.5">
                  <input
                    type="text"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    className="w-full bg-transparent font-display text-base font-bold text-[#1b1c19] outline-none"
                  />
                  <PhoneIcon className="h-5 w-5 text-[#4a6410]" />
                </div>
              </div>
            )}

            {recipientTab === 'EMAIL' && (
              <div className="relative flex items-center rounded-xl bg-[#ebe8db] px-4 py-3.5">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-transparent font-display text-base font-bold text-[#1b1c19] outline-none"
                />
              </div>
            )}

            {/* Found Recipient Badge */}
            <div className="flex items-center gap-3 rounded-xl border-l-4 border-[#4a6410] bg-[#ebe8db]/70 p-3.5">
              <img
                src="https://i.pravatar.cc/150?u=alex"
                alt="Alex Rivera"
                className="h-10 w-10 rounded-full object-cover"
              />
              <div>
                <p className="font-display text-sm font-bold text-[#4a6410]">
                  Alex Rivera
                </p>
                <p className="font-label text-[9px] font-extrabold uppercase tracking-wider text-[#44483a]/70">
                  RECIPIENT HAS OGURU ACCOUNT
                </p>
              </div>
            </div>

            {/* WHEN TO SEND Section */}
            <div className="pt-2">
              <h3 className="font-label text-xs font-extrabold uppercase tracking-wider text-[#44483a]">
                WHEN TO SEND?
              </h3>

              <div className="mt-3 space-y-3">
                {/* Send Now Radio */}
                <button
                  onClick={() => setTiming('NOW')}
                  className={`flex w-full items-center justify-between rounded-2xl p-4 transition-all ${
                    timing === 'NOW'
                      ? 'border-2 border-[#4a6410] bg-[#ebe8db]'
                      : 'border border-[#1b1c19]/10 bg-[#ebe8db]/40'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <ZapIcon className="h-5 w-5 text-[#1b1c19]" />
                    <span className="font-display text-base font-bold text-[#1b1c19]">
                      Send Now
                    </span>
                  </div>
                  <div
                    className={`h-5 w-5 rounded-full border-2 flex items-center justify-center ${
                      timing === 'NOW' ? 'border-[#4a6410] bg-[#4a6410]' : 'border-[#1b1c19]/30'
                    }`}
                  >
                    {timing === 'NOW' && <div className="h-2 w-2 rounded-full bg-white" />}
                  </div>
                </button>

                {/* Schedule for Later Radio */}
                <div
                  className={`rounded-2xl p-4 transition-all ${
                    timing === 'LATER'
                      ? 'border-2 border-[#4a6410] bg-[#ebe8db]'
                      : 'border border-[#1b1c19]/10 bg-[#ebe8db]/40'
                  }`}
                >
                  <button
                    onClick={() => setTiming('LATER')}
                    className="flex w-full items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <CalendarIcon className="h-5 w-5 text-[#4a6410]" />
                      <span className="font-display text-base font-bold text-[#4a6410]">
                        Schedule for Later
                      </span>
                    </div>
                    <div
                      className={`h-5 w-5 rounded-full border-2 flex items-center justify-center ${
                        timing === 'LATER' ? 'border-[#4a6410] bg-[#4a6410]' : 'border-[#1b1c19]/30'
                      }`}
                    >
                      {timing === 'LATER' && <div className="h-2 w-2 rounded-full bg-white" />}
                    </div>
                  </button>

                  {/* Date/Time pickers (shown when Schedule selected) */}
                  {timing === 'LATER' && (
                    <div className="mt-4 pt-4 border-t border-[#1b1c19]/10 space-y-3">
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="font-label text-[10px] font-extrabold uppercase tracking-wider text-[#44483a]">
                            DATE
                          </label>
                          <input
                            type="date"
                            value={scheduleDate}
                            onChange={(e) => setScheduleDate(e.target.value)}
                            className="mt-1 w-full rounded-xl bg-white p-3 font-display text-sm font-bold text-[#1b1c19] outline-none border border-[#1b1c19]/10"
                          />
                        </div>
                        <div>
                          <label className="font-label text-[10px] font-extrabold uppercase tracking-wider text-[#44483a]">
                            TIME
                          </label>
                          <input
                            type="time"
                            value={scheduleTime}
                            onChange={(e) => setScheduleTime(e.target.value)}
                            className="mt-1 w-full rounded-xl bg-white p-3 font-display text-sm font-bold text-[#1b1c19] outline-none border border-[#1b1c19]/10"
                          />
                        </div>
                      </div>

                      <input
                        type="text"
                        value={scheduleNote}
                        onChange={(e) => setScheduleNote(e.target.value)}
                        placeholder="Schedule note (e.g. Birthday coffee)"
                        className="w-full bg-transparent font-body text-xs italic text-[#44483a] outline-none"
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Bottom CTA Button */}
            <div className="fixed bottom-0 left-0 right-0 z-50 bg-gradient-to-t from-[#f6f4eb] via-[#f6f4eb] to-transparent p-5 pt-8">
              <button
                onClick={handleNext}
                className="mx-auto flex w-full max-w-lg items-center justify-center rounded-2xl bg-[#4a6410] py-4 font-display text-base font-bold text-white shadow-lg transition active:scale-[0.98]"
              >
                Next: Add Message
              </button>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* STEP 2: PERSONAL MESSAGE */}
        {/* ========================================================= */}
        {step === 2 && (
          <div className="animate-fade-in space-y-6">
            <div>
              <h2 className="font-display text-3xl font-extrabold text-[#2d3b0c]">
                Add a Message
              </h2>
              <p className="mt-1 font-body text-sm text-[#44483a]/70">
                Make Alex feel special with a note
              </p>
            </div>

            {/* Preset Themes */}
            <div className="flex gap-2 overflow-x-auto scrollbar-hide py-1">
              {['Birthday', 'Thank You', 'Congrats', 'Thinking of You'].map((t) => (
                <button
                  key={t}
                  onClick={() => setCardTheme(t)}
                  className={`shrink-0 rounded-full px-4 py-1.5 font-label text-xs font-bold transition-all ${
                    cardTheme === t
                      ? 'bg-[#4a6410] text-white'
                      : 'bg-[#ebe8db] text-[#44483a]'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>

            {/* Message Area */}
            <div className="rounded-2xl bg-white p-5 shadow-sm border border-[#1b1c19]/10">
              <label className="font-label text-[10px] font-extrabold uppercase tracking-wider text-[#44483a]">
                YOUR PERSONAL NOTE
              </label>
              <textarea
                rows={4}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="mt-2 w-full bg-transparent font-body text-base text-[#1b1c19] outline-none resize-none"
              />
            </div>

            {/* Bottom CTA Button */}
            <div className="fixed bottom-0 left-0 right-0 z-50 bg-gradient-to-t from-[#f6f4eb] via-[#f6f4eb] to-transparent p-5 pt-8">
              <button
                onClick={handleNext}
                className="mx-auto flex w-full max-w-lg items-center justify-center rounded-2xl bg-[#4a6410] py-4 font-display text-base font-bold text-white shadow-lg transition active:scale-[0.98]"
              >
                Next: Payment ($6.50)
              </button>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* STEP 3: PAYMENT & CONFIRMATION */}
        {/* ========================================================= */}
        {step === 3 && (
          <div className="animate-fade-in space-y-6">
            {!isSent ? (
              <>
                <div>
                  <h2 className="font-display text-3xl font-extrabold text-[#2d3b0c]">
                    Confirm & Pay
                  </h2>
                  <p className="mt-1 font-body text-sm text-[#44483a]/70">
                    Review details before sending
                  </p>
                </div>

                <div className="rounded-2xl bg-white p-5 shadow-sm space-y-4 border border-[#1b1c19]/10">
                  <div className="flex justify-between border-b border-[#1b1c19]/5 pb-3">
                    <span className="font-body text-sm text-[#44483a]">Recipient</span>
                    <span className="font-display text-sm font-bold text-[#1b1c19]">Alex Rivera</span>
                  </div>
                  <div className="flex justify-between border-b border-[#1b1c19]/5 pb-3">
                    <span className="font-body text-sm text-[#44483a]">Item</span>
                    <span className="font-display text-sm font-bold text-[#4a6410]">Caramel Latte ($6.50)</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-body text-sm text-[#44483a]">Scheduled For</span>
                    <span className="font-display text-sm font-bold text-[#1b1c19]">{scheduleDate} at {scheduleTime}</span>
                  </div>
                </div>

                <div className="fixed bottom-0 left-0 right-0 z-50 bg-gradient-to-t from-[#f6f4eb] via-[#f6f4eb] to-transparent p-5 pt-8">
                  <button
                    onClick={handleCompleteSend}
                    disabled={isProcessing}
                    className="mx-auto flex w-full max-w-lg items-center justify-center gap-2 rounded-2xl bg-[#4a6410] py-4 font-display text-base font-bold text-white shadow-lg transition active:scale-[0.98] disabled:opacity-50"
                  >
                    {isProcessing ? 'Processing Pay...' : 'Pay $6.50 & Schedule Gift'}
                  </button>
                </div>
              </>
            ) : (
              /* Success View */
              <div className="py-12 text-center space-y-4 animate-fade-in">
                <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-[#4a6410]/10 text-[#4a6410]">
                  <CheckCircleIcon className="h-10 w-10" />
                </div>
                <h2 className="font-display text-3xl font-extrabold text-[#4a6410]">
                  Gift Scheduled!
                </h2>
                <p className="font-body text-sm text-[#44483a]/80 max-w-xs mx-auto">
                  Alex will receive a link to claim their Caramel Latte on {scheduleDate}.
                </p>

                <div className="pt-6 space-y-3">
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText('https://oguru.app/claim?id=g-4821');
                      alert('Gift Link copied!');
                    }}
                    className="flex w-full items-center justify-center gap-2 rounded-2xl bg-[#ebe8db] py-3.5 font-label text-xs font-extrabold text-[#1b1c19]"
                  >
                    <ShareIcon className="h-4 w-4" />
                    Copy Shareable Link
                  </button>
                  <Link
                    href="/gifts"
                    className="inline-block w-full rounded-2xl bg-[#4a6410] py-3.5 font-label text-xs font-extrabold text-white"
                  >
                    Return to Gifts
                  </Link>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </main>
  );
}
