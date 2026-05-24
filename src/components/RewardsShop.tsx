import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Gift, Check, Search, BadgeAlert, Award, Sparkles, ShoppingBag, Mail, Copy } from 'lucide-react';
import { Reward, Profile, Redemption } from '../types';

interface RewardsShopProps {
  rewards: Reward[];
  profile: Profile;
  onRedeemReward: (reward: Reward, discountCode: string) => void;
  redemptions: Redemption[];
}

export default function RewardsShop({ rewards, profile, onRedeemReward, redemptions }: RewardsShopProps) {
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'gaming' | 'supplements' | 'food'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Selection and modal state
  const [selectedReward, setSelectedReward] = useState<Reward | null>(null);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [showInvoiceCode, setShowInvoiceCode] = useState<string | null>(null);

  // Filter rewards list
  const filteredRewards = rewards.filter((r) => {
    const matchesCategory = selectedCategory === 'all' || r.category === selectedCategory;
    const matchesSearch = r.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          r.provider.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleOpenRedemption = (reward: Reward) => {
    setSelectedReward(reward);
    setCopiedCode(null);
    setShowInvoiceCode(null);
  };

  const generatePromoCode = (reward: Reward) => {
    const prefix = reward.category.slice(0, 3).toUpperCase();
    const rand = Math.floor(1000 + Math.random() * 9000);
    return `WAY-${prefix}-${rand}`;
  };

  const handleConfirmRedemption = () => {
    if (!selectedReward) return;
    const code = generatePromoCode(selectedReward);
    // Call redemption action
    onRedeemReward(selectedReward, code);
    setShowInvoiceCode(code);
  };

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 3000);
  };

  const categories = [
    { id: 'all', label: 'Todos' },
    { id: 'gaming', label: 'Videojuegos' },
    { id: 'supplements', label: 'Suplementos' },
    { id: 'food', label: 'Cerveza y Refrescos' }
  ];

  return (
    <div className="space-y-6 pb-28">
      {/* Search and shop statistics */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between bg-white border border-gray-100 rounded-3xl p-5 shadow-sm">
        <div>
          <h2 className="font-extrabold text-lg text-gray-950">Tienda de Canjes Wayness</h2>
          <p className="text-xs text-gray-500">Canjea tus WPoints por códigos y cupones de descuento directos.</p>
        </div>
        <div className="flex items-center space-x-3 w-full sm:w-auto">
          {/* Search box */}
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar marcas..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-9 pr-4 py-2.5 text-xs text-gray-900 placeholder-gray-400 focus:outline-none focus:border-purple-400"
            />
          </div>
        </div>
      </div>

      {/* Category selector chips */}
      <div className="flex space-x-2 overflow-x-auto py-1 scrollbar-none">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id as any)}
            className={`px-5 py-2.5 rounded-xl font-bold text-xs tracking-wider uppercase shrink-0 transition-all cursor-pointer ${
              selectedCategory === cat.id
                ? 'bg-gradient-to-r from-purple-600 to-pink-500 text-white shadow-sm'
                : 'bg-white hover:bg-gray-50 text-gray-600 hover:text-gray-900 border border-gray-200 shadow-sm'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Grid listing of rewards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {filteredRewards.map((reward) => {
          const isAffordable = profile.wpointsBalance >= reward.wpointsCost;
          return (
            <div
              key={reward.id}
              className="bg-white border border-gray-100 rounded-3xl overflow-hidden shadow-sm flex flex-col justify-between hover:scale-[1.01] transition-transform group"
            >
              <div>
                {/* Reward photo */}
                <div className="relative aspect-video bg-gray-100 overflow-hidden">
                  <img
                    src={reward.imageUrl}
                    alt={reward.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    referrerPolicy="no-referrer"
                  />
                  <span className="absolute top-3 left-3 bg-white/95 border border-gray-150/80 text-[10px] font-extrabold px-2.5 py-1 rounded-full text-purple-705 font-mono tracking-widest uppercase shadow-sm">
                    {reward.category}
                  </span>
                  {reward.stockQuantity < 10 && (
                    <span className="absolute top-3 right-3 bg-amber-50 border border-amber-200 text-[10px] font-extrabold px-2.5 py-1 rounded-full text-amber-750 tracking-wider font-bold">
                      POCAS UNIDADES
                    </span>
                  )}
                </div>

                {/* Body details */}
                <div className="p-5 space-y-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">{reward.provider}</span>
                      <h4 className="font-extrabold text-sm text-gray-900 mt-0.5 group-hover:text-purple-600 transition-colors">
                        {reward.name}
                      </h4>
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 leading-relaxed line-clamp-2">
                    {reward.description}
                  </p>
                </div>
              </div>

              {/* Action bar and price tag */}
              <div className="p-5 border-t border-gray-100 flex items-center justify-between bg-gray-50/40">
                <div>
                  <span className="text-[9px] text-gray-400 font-bold uppercase tracking-wider block">PRECIO CANJE</span>
                  <span className="text-base font-black font-mono text-purple-600">
                    {reward.wpointsCost.toLocaleString()} WP
                  </span>
                </div>

                <button
                  id={`redeem-btn-${reward.id}`}
                  onClick={() => handleOpenRedemption(reward)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold tracking-widest uppercase transition-all shadow-sm active:scale-95 cursor-pointer ${
                    isAffordable
                      ? 'bg-gradient-to-tr from-purple-600 to-pink-500 hover:opacity-90 text-white'
                      : 'bg-gray-100 border border-gray-200 text-gray-400 cursor-not-allowed hover:bg-gray-50'
                  }`}
                >
                  {isAffordable ? 'Canjear' : 'Falta WP'}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Redemption History Table / List */}
      {redemptions.length > 0 && (
        <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm space-y-4">
          <div className="flex items-center space-x-2">
            <ShoppingBag className="w-5 h-5 text-purple-600" />
            <h3 className="font-bold text-sm text-gray-900 uppercase tracking-widest">Tus Cupones Canjeados</h3>
          </div>

          <div className="space-y-3">
            {redemptions.map((red) => (
              <div
                key={red.id}
                className="flex flex-col sm:flex-row items-center justify-between p-4 rounded-2xl bg-gray-50 border border-gray-200 gap-4"
              >
                <div className="flex items-center space-x-3.5">
                  <img
                    src={red.rewardImageUrl}
                    alt={red.rewardName}
                    className="w-12 h-12 rounded-xl object-cover shrink-0 border border-gray-200 bg-white"
                    referrerPolicy="no-referrer"
                  />
                  <div>
                    <h4 className="font-extrabold text-sm text-gray-900">{red.rewardName}</h4>
                    <p className="text-[10px] text-gray-500 font-mono">
                      Canjeado el {new Date(red.redeemedAt).toLocaleDateString()} • Spend {red.wpointsSpent.toLocaleString()} WP
                    </p>
                  </div>
                </div>

                {/* Display discount coupled promo */}
                <div className="flex items-center space-x-2">
                  <div className="bg-white border border-gray-200 inline-flex items-center pl-3 pr-2.5 py-1.5 rounded-xl text-xs font-bold font-mono text-purple-700 shadow-sm">
                    <span className="mr-3 tracking-widest">{red.discountCode}</span>
                    <button
                      onClick={() => handleCopyCode(red.discountCode)}
                      className="p-1 text-gray-400 hover:text-gray-950 transition-colors hover:bg-gray-100 rounded cursor-pointer"
                      title="Copiar código"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  {copiedCode === red.discountCode && (
                    <span className="text-[10px] text-emerald-600 font-bold">¡Copiado!</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Confirmation & Ticket Modal sheet */}
      <AnimatePresence>
        {selectedReward && (
          <div className="fixed inset-0 bg-white/80 backdrop-blur-md flex items-center justify-center p-4 z-50">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-md bg-white border border-gray-200 rounded-3xl p-6 shadow-2xl space-y-5"
            >
              {/* Header */}
              <div className="flex justify-between items-center pb-2 border-b border-gray-150">
                <h3 className="font-extrabold text-base text-gray-900 uppercase tracking-wider">Confirmar Canje</h3>
                <button
                  onClick={() => setSelectedReward(null)}
                  className="text-gray-400 hover:text-gray-700 text-lg w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center cursor-pointer font-bold"
                >
                  &times;
                </button>
              </div>

              {/* Body ticket details representation */}
              {!showInvoiceCode ? (
                <div className="space-y-5">
                  <div className="flex items-center space-x-3.5">
                    <img
                      src={selectedReward.imageUrl}
                      alt={selectedReward.name}
                      className="w-16 h-16 rounded-2xl object-cover shrink-0 border border-gray-200 bg-white"
                      referrerPolicy="no-referrer"
                    />
                    <div>
                      <span className="text-[10px] text-gray-400 font-bold uppercase">{selectedReward.provider}</span>
                      <h4 className="font-extrabold text-sm text-gray-950">{selectedReward.name}</h4>
                      <p className="text-xs text-gray-500 mt-1">Cost: {selectedReward.wpointsCost.toLocaleString()} WP</p>
                    </div>
                  </div>

                  {/* Calculations ledger */}
                  <div className="bg-gray-50 p-4 rounded-2xl border border-gray-200 font-mono text-xs space-y-2.5">
                    <div className="flex justify-between text-gray-500">
                      <span>Tu Balance Actual:</span>
                      <span>{profile.wpointsBalance.toLocaleString()} WP</span>
                    </div>
                    <div className="flex justify-between text-rose-600 font-bold">
                      <span>Costo del Producto:</span>
                      <span>-{selectedReward.wpointsCost.toLocaleString()} WP</span>
                    </div>
                    <hr className="border-gray-200" />
                    <div className="flex justify-between font-bold text-gray-900 text-sm">
                      <span>Balance Restante:</span>
                      <span className="text-emerald-600 font-bold">
                        {(profile.wpointsBalance - selectedReward.wpointsCost).toLocaleString()} WP
                      </span>
                    </div>
                  </div>

                  {profile.wpointsBalance >= selectedReward.wpointsCost ? (
                    <button
                      id="confirm-canje-btn"
                      onClick={handleConfirmRedemption}
                      className="w-full bg-gradient-to-r from-purple-600 to-pink-500 py-3 rounded-xl font-bold text-xs tracking-wider uppercase shadow-sm hover:opacity-95 transition-all cursor-pointer text-white"
                    >
                      ✓ Sí, Canjear Ahora
                    </button>
                  ) : (
                    <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 flex gap-2.5 text-xs text-rose-700 font-semibold leading-relaxed">
                      <BadgeAlert className="w-5 h-5 shrink-0 text-rose-500" />
                      <div>
                        <strong>Saldo Insuficiente.</strong> Te faltan {(selectedReward.wpointsCost - profile.wpointsBalance).toLocaleString()} WPoints para poder adquirir este canje. ¡Registra tus entrenamientos!
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                /* Invoice code coupon successful screen */
                <div className="space-y-6 text-center py-4">
                  <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-purple-600 to-pink-500 flex items-center justify-center text-white mx-auto shadow-sm">
                    <Check className="w-7 h-7 font-bold" />
                  </div>
                  
                  <div className="space-y-2">
                    <h4 className="font-extrabold text-gray-900 text-lg">💰 ¡Canje Completado!</h4>
                    <p className="text-xs text-gray-500 uppercase tracking-widest leading-relaxed">
                      "¡Tu esfuerzo vale oro! ¡Disfruta tu recompensa! ¡Tu cupón estará visible abajo!"
                    </p>
                  </div>

                  {/* Display code beautifully */}
                  <div className="bg-gray-50 border border-gray-200 p-4 rounded-2xl space-y-2.5">
                    <span className="text-[10px] text-purple-600 font-extrabold tracking-widest uppercase block">
                      CÓDIGO DE CUPÓN DE DESCUENTO
                    </span>
                    <div className="flex items-center justify-center space-x-2">
                      <span className="font-mono font-black text-gray-950 text-lg tracking-widest">
                        {showInvoiceCode}
                      </span>
                      <button
                        onClick={() => handleCopyCode(showInvoiceCode)}
                        className="p-1 px-1.5 bg-white border border-gray-205 text-gray-500 hover:text-gray-900 transition-colors hover:bg-gray-100 rounded-lg cursor-pointer"
                        title="Copiar"
                      >
                        <Copy className="w-4 h-4" />
                      </button>
                    </div>
                    {copiedCode === showInvoiceCode && (
                      <span className="text-[10px] text-emerald-400 font-bold block">¡Copiado al portapapeles!</span>
                    )}
                  </div>

                  <div className="text-[11px] text-gray-500 flex items-center justify-center gap-1">
                    <Mail className="w-3.5 h-3.5 text-purple-600 animate-pulse" />
                    <span>Enviado correo electrónico detallado a {profile.fullName.split(' ')[0]}</span>
                  </div>

                  <button
                    onClick={() => setSelectedReward(null)}
                    className="w-full bg-gray-100 hover:bg-gray-200 py-3 rounded-xl font-bold text-xs tracking-wider uppercase transition-all cursor-pointer text-gray-700 border border-gray-200"
                  >
                    Cerrar Ticket
                  </button>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
