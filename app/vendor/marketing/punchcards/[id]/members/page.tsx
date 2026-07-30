'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import type { Business, Punchcard, PunchcardMember, Product } from '@/lib/supabase/types';
import {
  ArrowLeft,
  Loader2,
  AlertCircle,
  Plus,
  Search,
  Gift,
  Minus,
  User,
} from 'lucide-react';

export default function PunchcardMembersPage() {
  const router = useRouter();
  const params = useParams();
  const supabase = createClient();

  const cardId = params.id as string;

  const [loading, setLoading] = useState(true);
  const [business, setBusiness] = useState<Business | null>(null);
  const [card, setCard] = useState<Punchcard | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [members, setMembers] = useState<PunchcardMember[]>([]);
  const [search, setSearch] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  // Add member form
  const [showAddForm, setShowAddForm] = useState(false);
  const [newPhone, setNewPhone] = useState('');
  const [newName, setNewName] = useState('');
  const [addingMember, setAddingMember] = useState(false);

  useEffect(() => {
    loadData();
  }, [cardId]);

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

      const { data: cardData, error: cardError } = await supabase
        .from('punchcards')
        .select('*')
        .eq('id', cardId)
        .single();

      if (cardError || !cardData) {
        router.push('/vendor/marketing/punchcards');
        return;
      }

      setCard(cardData);

      if (cardData.eligible_product_ids?.length > 0) {
        const { data: productsData } = await supabase
          .from('products')
          .select('*')
          .in('id', cardData.eligible_product_ids);
        setProducts(productsData || []);
      }

      const { data: memberData } = await supabase
        .from('punchcard_members')
        .select('*')
        .eq('punchcard_id', cardId)
        .order('last_punch_at', { ascending: false, nullsFirst: false });

      setMembers(memberData || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const addMember = async () => {
    if (!newPhone.trim() || !card) return;
    setAddingMember(true);
    setError(null);

    try {
      const { data, error: insertError } = await supabase
        .from('punchcard_members')
        .insert({
          punchcard_id: card.id,
          business_id: card.business_id,
          customer_phone: newPhone.trim(),
          customer_name: newName.trim() || null,
          punches_count: 0,
          rewards_redeemed: 0,
        })
        .select()
        .single();

      if (insertError) {
        if (insertError.code === '23505') {
          setError('This customer is already enrolled in this punchcard.');
        } else {
          throw insertError;
        }
        return;
      }

      setMembers((prev) => [data, ...prev]);
      setNewPhone('');
      setNewName('');
      setShowAddForm(false);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to add customer';
      setError(message);
    } finally {
      setAddingMember(false);
    }
  };

  const addPunch = async (member: PunchcardMember) => {
    if (!card) return;
    setActionLoading(member.id);

    const newCount = member.punches_count + 1;
    const { error: updateError } = await supabase
      .from('punchcard_members')
      .update({ punches_count: newCount, last_punch_at: new Date().toISOString() })
      .eq('id', member.id);

    if (!updateError) {
      setMembers((prev) =>
        prev.map((m) =>
          m.id === member.id ? { ...m, punches_count: newCount, last_punch_at: new Date().toISOString() } : m
        )
      );
    }

    setActionLoading(null);
  };

  const removePunch = async (member: PunchcardMember) => {
    if (member.punches_count <= 0) return;
    setActionLoading(member.id);

    const newCount = member.punches_count - 1;
    const { error: updateError } = await supabase
      .from('punchcard_members')
      .update({ punches_count: newCount })
      .eq('id', member.id);

    if (!updateError) {
      setMembers((prev) => prev.map((m) => (m.id === member.id ? { ...m, punches_count: newCount } : m)));
    }

    setActionLoading(null);
  };

  const redeemReward = async (member: PunchcardMember) => {
    if (!card) return;
    if (!confirm(`Redeem reward for ${member.customer_name || member.customer_phone}? This resets their punch count to 0.`)) return;

    setActionLoading(member.id);

    const { error: updateError } = await supabase
      .from('punchcard_members')
      .update({
        punches_count: 0,
        rewards_redeemed: member.rewards_redeemed + 1,
      })
      .eq('id', member.id);

    if (!updateError) {
      setMembers((prev) =>
        prev.map((m) =>
          m.id === member.id ? { ...m, punches_count: 0, rewards_redeemed: m.rewards_redeemed + 1 } : m
        )
      );
    }

    setActionLoading(null);
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-surface flex flex-col items-center justify-center">
        <Loader2 size={40} className="text-primary animate-spin mb-4" />
        <p className="text-on-surface-variant">Loading...</p>
      </main>
    );
  }

  if (!business || !card) return null;

  const filteredMembers = members.filter((m) => {
    const q = search.trim().toLowerCase();
    if (!q) return true;
    return m.customer_phone.toLowerCase().includes(q) || (m.customer_name || '').toLowerCase().includes(q);
  });

  return (
    <main className="min-h-screen bg-surface">
      {/* Top Bar */}
      <header className="sticky top-0 z-40 bg-surface/95 backdrop-blur-md border-b border-outline-variant">
        <div className="max-w-2xl mx-auto px-4 md:px-6 py-4 flex items-center justify-between">
          <button
            onClick={() => router.push('/vendor/marketing/punchcards')}
            className="flex items-center gap-2 text-on-surface-variant hover:text-primary transition-colors font-label font-semibold text-sm"
          >
            <ArrowLeft size={18} />
            <span className="hidden sm:inline">Back to punchcards</span>
            <span className="sm:hidden">Back</span>
          </button>
          <button
            onClick={() => setShowAddForm((v) => !v)}
            className="flex items-center gap-2 bg-primary text-on-primary px-4 py-2 rounded-xl font-label font-semibold text-xs uppercase tracking-wider hover:opacity-90 active:scale-95 transition-all"
          >
            <Plus size={14} />
            Add Customer
          </button>
        </div>
      </header>

      <div className="max-w-2xl mx-auto px-4 md:px-6 py-8">
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-2xl">{card.emoji || '🎟️'}</span>
            <h1 className="font-display text-2xl md:text-3xl font-bold text-on-surface tracking-tight">
              {card.title}
            </h1>
          </div>
          <p className="text-sm text-on-surface-variant">
            Buy {card.punches_required}, get {card.reward_description.toLowerCase()}
          </p>
          <p className="text-xs text-on-surface-variant/70 mt-1">
            {products.length > 0
              ? `Applies to: ${products.map((p) => p.name).join(', ')}`
              : 'Applies to any item'}
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-error-container border border-error/20 rounded-xl flex items-start gap-3">
            <AlertCircle size={20} className="text-error flex-shrink-0 mt-0.5" />
            <p className="text-sm text-on-error-container flex-1">{error}</p>
            <button onClick={() => setError(null)} className="text-on-error-container/60 hover:text-on-error-container">
              ✕
            </button>
          </div>
        )}

        {/* Add member form */}
        {showAddForm && (
          <div className="mb-6 p-5 bg-surface-container-lowest border border-primary/20 rounded-2xl">
            <h3 className="font-display font-semibold text-on-surface mb-3">Enroll a customer</h3>
            <div className="space-y-3">
              <input
                type="tel"
                value={newPhone}
                onChange={(e) => setNewPhone(e.target.value)}
                placeholder="Phone number"
                className="w-full px-4 py-3 bg-surface-container-low border border-outline-variant rounded-xl text-sm text-on-surface placeholder:text-on-surface-variant/50 focus:outline-none focus:border-primary transition-colors"
              />
              <input
                type="text"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="Name (optional)"
                className="w-full px-4 py-3 bg-surface-container-low border border-outline-variant rounded-xl text-sm text-on-surface placeholder:text-on-surface-variant/50 focus:outline-none focus:border-primary transition-colors"
              />
              <div className="flex gap-2">
                <button
                  onClick={() => setShowAddForm(false)}
                  className="flex-1 px-4 py-2.5 border-2 border-outline-variant text-on-surface rounded-xl font-label font-semibold text-xs uppercase tracking-wider hover:bg-surface-container transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={addMember}
                  disabled={!newPhone.trim() || addingMember}
                  className="flex-1 flex items-center justify-center gap-2 bg-primary text-on-primary px-4 py-2.5 rounded-xl font-label font-semibold text-xs uppercase tracking-wider hover:opacity-90 transition-all disabled:opacity-50"
                >
                  {addingMember ? <Loader2 size={14} className="animate-spin" /> : <Plus size={14} />}
                  Enroll
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Search */}
        {members.length > 0 && (
          <div className="relative mb-5">
            <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name or phone"
              className="w-full pl-11 pr-4 py-3 bg-surface-container-lowest border border-outline-variant rounded-xl text-sm text-on-surface placeholder:text-on-surface-variant/50 focus:outline-none focus:border-primary transition-colors"
            />
          </div>
        )}

        {/* Empty state */}
        {members.length === 0 ? (
          <div className="bg-surface-container-lowest border border-outline-variant rounded-2xl p-12 text-center">
            <div className="w-16 h-16 mx-auto rounded-2xl bg-primary/10 flex items-center justify-center text-primary mb-4">
              <User size={28} />
            </div>
            <h3 className="font-display text-xl font-semibold text-on-surface mb-2">No customers yet</h3>
            <p className="text-sm text-on-surface-variant mb-6 max-w-md mx-auto">
              Enroll a customer's phone number to start tracking their punches.
            </p>
            <button
              onClick={() => setShowAddForm(true)}
              className="inline-flex items-center gap-2 bg-primary text-on-primary px-6 py-3 rounded-xl font-label font-semibold text-sm uppercase tracking-wider hover:opacity-90 active:scale-95 transition-all"
            >
              <Plus size={16} />
              Enroll First Customer
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredMembers.map((member) => {
              const isFull = member.punches_count >= card.punches_required;
              return (
                <div
                  key={member.id}
                  className={`bg-surface-container-lowest border rounded-2xl p-4 ${
                    isFull ? 'border-primary/40 shadow-organic-sm' : 'border-outline-variant'
                  }`}
                >
                  <div className="flex items-center justify-between gap-3 mb-3">
                    <div className="min-w-0">
                      <p className="font-display font-semibold text-on-surface truncate">
                        {member.customer_name || 'Unnamed customer'}
                      </p>
                      <p className="text-xs text-on-surface-variant">{member.customer_phone}</p>
                    </div>
                    {member.rewards_redeemed > 0 && (
                      <span className="flex-shrink-0 text-[10px] font-label font-bold uppercase tracking-wider bg-tertiary/10 text-tertiary px-2 py-1 rounded-full">
                        {member.rewards_redeemed} redeemed
                      </span>
                    )}
                  </div>

                  {/* Progress dots */}
                  <div className="flex flex-wrap gap-1.5 mb-3">
                    {Array.from({ length: card.punches_required }).map((_, i) => (
                      <div
                        key={i}
                        className={`w-7 h-7 rounded-full border-2 flex items-center justify-center text-sm transition-colors ${
                          i < member.punches_count
                            ? 'bg-primary border-primary text-on-primary'
                            : 'border-outline-variant text-on-surface-variant/40'
                        }`}
                      >
                        {i < member.punches_count ? card.emoji || '●' : ''}
                      </div>
                    ))}
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => removePunch(member)}
                      disabled={actionLoading === member.id || member.punches_count === 0}
                      className="flex items-center justify-center w-9 h-9 bg-surface-container-lowest border border-outline-variant text-on-surface-variant rounded-lg hover:border-error hover:text-error transition-colors disabled:opacity-40"
                    >
                      <Minus size={14} />
                    </button>
                    <button
                      onClick={() => addPunch(member)}
                      disabled={actionLoading === member.id || isFull}
                      className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-primary/10 text-primary rounded-lg hover:bg-primary/20 transition-colors font-label font-semibold text-xs uppercase tracking-wider disabled:opacity-40"
                    >
                      {actionLoading === member.id ? <Loader2 size={14} className="animate-spin" /> : <Plus size={14} />}
                      Add Punch
                    </button>
                    <button
                      onClick={() => redeemReward(member)}
                      disabled={actionLoading === member.id || !isFull}
                      className="flex items-center justify-center gap-2 px-3 py-2 bg-primary text-on-primary rounded-lg hover:opacity-90 transition-colors font-label font-semibold text-xs uppercase tracking-wider disabled:opacity-40 disabled:bg-surface-container-highest disabled:text-on-surface-variant"
                    >
                      <Gift size={14} />
                      Redeem
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}
