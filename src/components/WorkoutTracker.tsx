import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Dumbbell, Plus, Trash2, Heart, Award, Sparkles, Check, Info, Flame, AlertCircle } from 'lucide-react';
import { Workout, Exercise } from '../types';

interface WorkoutTrackerProps {
  onAddWorkout: (workout: Omit<Workout, 'id' | 'userId' | 'workoutDate'>) => void;
}

const EXERCISE_SUGGESTIONS = [
  'Sentadillas', 'Sujeciones en Plancha', 'Flexiones', 'Bíceps con mancuerna', 
  'Prensa de Piernas', 'Zancadas', 'Dominadas', 'Abdominales de Bicicleta'
];

export default function WorkoutTracker({ onAddWorkout }: WorkoutTrackerProps) {
  const [type, setType] = useState('Gym');
  const [duration, setDuration] = useState(45);
  const [calories, setCalories] = useState(380);
  const [distance, setDistance] = useState<number | ''>('');
  const [heartRate, setHeartRate] = useState<number>(120);
  const [notes, setNotes] = useState('');
  
  // Custom list of exercises added for gym/sets logging
  const [exercises, setExercises] = useState<Omit<Exercise, 'id'>[]>([]);
  const [newExerciseName, setNewExerciseName] = useState('');
  const [newExerciseSets, setNewExerciseSets] = useState<number | ''>(3);
  const [newExerciseReps, setNewExerciseReps] = useState<number | ''>(12);
  const [newExerciseWeight, setNewExerciseWeight] = useState<number | ''>(20);

  // Success indicator
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Dynamic WPoints estimation
  const [estimatedWPoints, setEstimatedWPoints] = useState(0);
  const [activeZone, setActiveZone] = useState<{ name: string; multiplier: number; color: string; bg: string }>({
    name: 'Naranja',
    multiplier: 5,
    color: 'text-orange-700',
    bg: 'bg-orange-50 border border-orange-100'
  });

  // Calculate zones dynamically on duration/bpm change
  useEffect(() => {
    let multiplier = 4;
    let name = 'Verde (Bajo/Yoga)';
    let color = 'text-green-700';
    let bg = 'bg-green-50 border border-green-100';

    if (heartRate >= 90 && heartRate <= 109) {
      multiplier = 4;
      name = 'Verde (Cardio Ligero)';
      color = 'text-emerald-700';
      bg = 'bg-emerald-50 border border-emerald-100';
    } else if (heartRate >= 110 && heartRate <= 129) {
      multiplier = 5;
      name = 'Naranja (Quema de Grasa)';
      color = 'text-orange-700';
      bg = 'bg-orange-50 border border-orange-100';
    } else if (heartRate >= 130 && heartRate <= 149) {
      multiplier = 6;
      name = 'Roja (Cardio Intenso)';
      color = 'text-rose-700';
      bg = 'bg-rose-50 border border-rose-100';
    } else if (heartRate >= 150) {
      multiplier = 7;
      name = 'Púrpura (Máximo Esfuerzo)';
      color = 'text-fuchsia-700';
      bg = 'bg-fuchsia-50 border border-fuchsia-100';
    }

    setActiveZone({ name, multiplier, color, bg });
    setEstimatedWPoints(duration * multiplier);
  }, [heartRate, duration]);

  // Handle calorie auto-estimator on type select
  const handleTypeChange = (newType: string) => {
    setType(newType);
    if (newType === 'Running') {
      setCalories(Math.round(duration * 12));
      setHeartRate(140);
    } else if (newType === 'Cycling') {
      setCalories(Math.round(duration * 9));
      setHeartRate(115);
    } else if (newType === 'Yoga') {
      setCalories(Math.round(duration * 4));
      setHeartRate(95);
    } else if (newType === 'Gym') {
      setCalories(Math.round(duration * 8));
      setHeartRate(118);
    } else {
      setCalories(Math.round(duration * 7));
    }
  };

  const handleAddExercise = () => {
    if (!newExerciseName.trim()) return;
    setExercises([
      ...exercises,
      {
        name: newExerciseName,
        sets: newExerciseSets || undefined,
        reps: newExerciseReps || undefined,
        weightKg: newExerciseWeight || undefined,
      }
    ]);
    setNewExerciseName('');
    setNewExerciseSets(3);
    setNewExerciseReps(12);
    setNewExerciseWeight(20);
  };

  const handleRemoveExercise = (idx: number) => {
    setExercises(exercises.filter((_, i) => i !== idx));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (duration <= 0 || calories <= 0) return;

    onAddWorkout({
      type,
      durationMinutes: Number(duration),
      caloriesBurned: Number(calories),
      wpointsEarned: estimatedWPoints,
      heartRateAvg: heartRate || undefined,
      distanceKm: distance ? Number(distance) : undefined,
      notes: notes || undefined,
      exercises: exercises.map((ex, i) => ({ id: `ex_spawn_${i}`, ...ex }))
    });

    setSuccessMessage(`¡Entrenamiento registrado! Has ganado +${estimatedWPoints} WPoints.`);
    
    // Reset inputs
    setDuration(45);
    setCalories(380);
    setDistance('');
    setHeartRate(120);
    setNotes('');
    setExercises([]);

    setTimeout(() => {
      setSuccessMessage(null);
    }, 4000);
  };

  return (
    <div className="space-y-6 pb-28">
      {/* Title */}
      <div className="flex items-center space-x-3 bg-white border border-gray-100 rounded-3xl p-5 shadow-sm">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-purple-600 to-pink-500 flex items-center justify-center text-white shadow-sm">
          <Flame className="w-6 h-6 animate-pulse" />
        </div>
        <div>
          <h2 className="font-extrabold text-lg text-gray-950">Registrar Sesión Fitness</h2>
          <p className="text-xs text-gray-500">Introduce tus estadísticas de hoy y reclama tus WPoints al instante.</p>
        </div>
      </div>

      {/* Success Alarm */}
      <AnimatePresence>
        {successMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="p-5 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-500 text-white font-medium flex items-center justify-between shadow-md"
          >
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-white">
                <Check className="w-5 h-5 font-bold" />
              </div>
              <div>
                <h4 className="font-bold text-sm">¡Éxito!</h4>
                <p className="text-xs text-emerald-50">{successMessage}</p>
              </div>
            </div>
            <Sparkles className="w-6 h-6 text-yellow-300 animate-spin" />
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Core settings and calculation formula */}
        <div className="lg:col-span-2 bg-white border border-gray-100 rounded-3xl p-6 shadow-sm space-y-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <h3 className="font-bold text-base text-gray-950 border-b border-gray-100 pb-2">Estadísticas de la Actividad</h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Exercise type select dropdown */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-500">Tipo de Actividad</label>
                <div className="grid grid-cols-4 gap-2">
                  {['Gym', 'Running', 'Cycling', 'Yoga'].map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => handleTypeChange(t)}
                      className={`py-2 px-1 text-xs font-bold rounded-xl border text-center transition-all cursor-pointer ${
                        type === t 
                        ? 'bg-purple-50 border-purple-300 text-purple-700 font-extrabold' 
                        : 'bg-gray-50 border-gray-100 hover:bg-gray-100 text-gray-500'
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              {/* Dynamic distance input if applicable */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-500">Distancia Km (Opcional)</label>
                <input
                  type="number"
                  step="0.1"
                  placeholder="Ej: 5.2"
                  value={distance}
                  onChange={(e) => setDistance(e.target.value !== '' ? Number(e.target.value) : '')}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-purple-400 transition-colors text-gray-950"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Duration slider or input */}
              <div className="space-y-1">
                <div className="flex justify-between items-center text-xs font-bold text-gray-500">
                  <span>Duración de Sesión</span>
                  <span className="font-mono text-purple-600">{duration} minutos</span>
                </div>
                <input
                  type="range"
                  min="5"
                  max="180"
                  step="5"
                  value={duration}
                  onChange={(e) => {
                    const dur = Number(e.target.value);
                    setDuration(dur);
                    // recalculate calories based on activity factor
                    const mult = type === 'Running' ? 12 : type === 'Cycling' ? 9 : type === 'Yoga' ? 4 : 8;
                    setCalories(dur * mult);
                  }}
                  className="w-full py-2 accent-purple-600 cursor-pointer"
                />
              </div>

              {/* Energy burned */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-500">Calorías Quemadas (Kcal)</label>
                <input
                  type="number"
                  required
                  value={calories}
                  onChange={(e) => setCalories(Number(e.target.value))}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-mono text-pink-600 focus:outline-none focus:border-purple-400 transition-colors"
                />
              </div>
            </div>

            {/* Frecuencia Cardíaca Tracker slider with Zone indicator */}
            <div className="p-4 bg-gray-50 rounded-2xl border border-gray-200/60 space-y-4">
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-2">
                  <Heart className="w-5 h-5 text-rose-500 fill-rose-500 animate-pulse" />
                  <span className="text-xs font-bold text-gray-700">Frecuencia Cardíaca Promedio</span>
                </div>
                <span className="font-mono text-sm font-extrabold text-rose-600">{heartRate} BPM</span>
              </div>

              <input
                type="range"
                min="70"
                max="200"
                value={heartRate}
                onChange={(e) => setHeartRate(Number(e.target.value))}
                className="w-full accent-rose-500 cursor-pointer"
              />

              {/* Display Calculated Zone and Reward scale */}
              <div className={`p-3.5 rounded-xl border flex items-center justify-between ${activeZone.bg}`}>
                <div>
                  <span className="text-[9px] text-gray-400 block leading-none mb-1 uppercase tracking-wider font-bold">
                    ZONA DE ENTRENAMIENTO ACTIVADA
                  </span>
                  <span className={`text-sm font-black tracking-wide ${activeZone.color}`}>
                    🎨 {activeZone.name}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-[9px] text-gray-400 block leading-none mb-1 uppercase tracking-wider font-bold">
                    MULTIPLICADOR
                  </span>
                  <span className="text-sm font-black font-mono text-purple-700">
                    ✕ {activeZone.multiplier} WP/MIN
                  </span>
                </div>
              </div>

              {/* Guide tool info */}
              <div className="text-[10px] text-gray-500 flex items-start gap-1 pb-1">
                <Info className="w-3.5 h-3.5 shrink-0 text-gray-400" />
                <span>
                  Fórmula: Verde (90-109 bpm) = 4 WP/m • Naranja (110-129 bpm) = 5 WP/m • Roja (130-149 bpm) = 6 WP/m • Púrpura (150+ bpm) = 7 WP/m.
                </span>
              </div>
            </div>

            {/* Optional Gym sets / Exercise details nested logger */}
            {type === 'Gym' && (
              <div className="space-y-4 pt-2">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-gray-700 flex items-center gap-1.5 uppercase">
                    <Dumbbell className="w-4 h-4 text-purple-600" /> Registro de Ejercicios Sets (Opcional)
                  </h4>
                  <span className="text-[10px] text-gray-400 font-mono">
                    {exercises.length} agregados
                  </span>
                </div>

                {/* Inline Exercise Input Add */}
                <div className="bg-gray-50 p-4 rounded-2xl border border-gray-200 grid grid-cols-1 sm:grid-cols-4 gap-3">
                  <div className="sm:col-span-2 space-y-1">
                    <input
                      type="text"
                      placeholder="Nombre (ej: Sentadillas)"
                      value={newExerciseName}
                      onChange={(e) => setNewExerciseName(e.target.value)}
                      className="w-full bg-white border border-gray-200 text-gray-900 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-purple-300"
                    />
                    {/* Suggestions list chips */}
                    <div className="flex gap-1 overflow-x-auto py-1 scrollbar-none max-w-full">
                      {EXERCISE_SUGGESTIONS.slice(0, 4).map((suggest) => (
                        <button
                          key={suggest}
                          type="button"
                          onClick={() => setNewExerciseName(suggest)}
                          className="bg-gray-200/60 hover:bg-gray-200 text-gray-600 text-[9px] font-semibold px-2 py-0.5 rounded cursor-pointer"
                        >
                          {suggest}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-1 sm:col-span-2">
                    <input
                      type="number"
                      placeholder="Sets"
                      value={newExerciseSets}
                      onChange={(e) => setNewExerciseSets(e.target.value !== '' ? Number(e.target.value) : '')}
                      className="bg-white border border-gray-200 rounded-lg px-2 text-center text-xs text-gray-900 focus:outline-none"
                      title="Sets de carga"
                    />
                    <input
                      type="number"
                      placeholder="Reps"
                      value={newExerciseReps}
                      onChange={(e) => setNewExerciseReps(e.target.value !== '' ? Number(e.target.value) : '')}
                      className="bg-white border border-gray-200 rounded-lg px-2 text-center text-xs text-gray-900 focus:outline-none"
                      title="Repeticiones"
                    />
                    <input
                      type="number"
                      placeholder="Kg"
                      value={newExerciseWeight}
                      onChange={(e) => setNewExerciseWeight(e.target.value !== '' ? Number(e.target.value) : '')}
                      className="bg-white border border-gray-200 rounded-lg px-2 text-center text-xs text-gray-900 focus:outline-none"
                      title="Peso Kg"
                    />
                  </div>

                  <div className="sm:col-span-4 text-right">
                    <button
                      type="button"
                      onClick={handleAddExercise}
                      className="bg-purple-50 hover:bg-purple-100 text-purple-600 border border-purple-200/50 px-3 py-1.5 rounded-lg text-[10px] font-bold tracking-wider uppercase inline-flex items-center gap-1 cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" /> Añadir Set
                    </button>
                  </div>
                </div>

                {/* Display Exercises added so far list */}
                {exercises.length > 0 && (
                  <div className="space-y-1.5">
                    {exercises.map((item, idx) => (
                      <div key={idx} className="flex items-center justify-between text-xs bg-white p-2.5 rounded-xl border border-gray-100 shadow-sm">
                        <span className="font-extrabold text-gray-800">🚀 {item.name}</span>
                        <div className="flex items-center space-x-3">
                          <span className="font-mono text-gray-500">
                            {item.sets} sets × {item.reps} reps {item.weightKg ? `(${item.weightKg} Kg)` : ''}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleRemoveExercise(idx)}
                            className="text-gray-400 hover:text-red-500 transition-colors cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Workout Notes */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-500">Notas Adicionales (Opcional)</label>
              <textarea
                rows={2}
                placeholder="¿Cómo te sentiste? Registra fatiga, clima o logros especiales..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-purple-400 text-gray-950 transition-colors"
              />
            </div>

            {/* Bottom calculation button */}
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-purple-600 to-pink-500 py-4 rounded-2xl font-bold tracking-wide shadow-sm text-white font-sans uppercase hover:opacity-95 active:scale-[0.99] transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              <Award className="w-5 h-5" /> RECLAMAR +{estimatedWPoints} WPOINTS Y GUARDAR
            </button>
          </form>
        </div>

        {/* Dynamic points simulator dashboard side-gauge */}
        <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm flex flex-col justify-between">
          <div className="space-y-6">
            <h3 className="font-semibold text-xs text-gray-400 tracking-wider uppercase border-b border-gray-100 pb-2">
              Estimador de Ganancias
            </h3>

            {/* Glowing calculator balance representation */}
            <div className="bg-purple-50/50 border border-purple-100/70 p-6 rounded-2xl text-center shadow-sm space-y-2 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-tr from-purple-600 to-pink-500 opacity-5 rounded-full blur-xl" />
              <p className="text-[10px] text-purple-500 font-bold uppercase tracking-widest leading-none">PUNTOS DE ESTA SESIÓN</p>
              <h2 className="text-4xl font-black font-mono tracking-tight text-gray-900 leading-none py-1">
                {estimatedWPoints.toLocaleString()} <span className="text-xl">WP</span>
              </h2>
              <p className="text-[9px] text-fuchsia-600 font-bold tracking-widest uppercase flex items-center justify-center gap-1 leading-none">
                <Sparkles className="w-3.5 h-3.5 animate-spin" /> GARANTIZADOS
              </p>
            </div>

            {/* Custom items equivalence gauge */}
            <div className="space-y-4">
              <h4 className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">
                Equivalente en Tienda:
              </h4>

              <div className="space-y-3">
                <div className="space-y-1">
                  <div className="flex justify-between items-center text-[11px]">
                    <span className="text-gray-700 font-medium">🍫 Barra de Proteína (1,500 WP)</span>
                    <span className="text-purple-600 font-bold font-mono">{Math.round((estimatedWPoints / 1500) * 100)}%</span>
                  </div>
                  <div className="w-full h-1.5 bg-gray-150 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-purple-600 rounded-full transition-all duration-300"
                      style={{ width: `${Math.min((estimatedWPoints / 1500) * 100, 100)}%` }}
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between items-center text-[11px]">
                    <span className="text-gray-700 font-medium">💪 Tarro MyProtein 1Kg (10,000 WP)</span>
                    <span className="text-purple-600 font-bold font-mono">{Math.round((estimatedWPoints / 10000) * 100)}%</span>
                  </div>
                  <div className="w-full h-1.5 bg-gray-150 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-pink-500 rounded-full transition-all duration-300"
                      style={{ width: `${Math.min((estimatedWPoints / 10000) * 100, 100)}%` }}
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between items-center text-[11px]">
                    <span className="text-gray-700 font-medium">🎮 Riot LoL Gift Card (50,000 WP)</span>
                    <span className="text-purple-600 font-bold font-mono">{Math.round((estimatedWPoints / 50000) * 100)}%</span>
                  </div>
                  <div className="w-full h-1.5 bg-gray-150 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-fuchsia-500 rounded-full transition-all duration-300"
                      style={{ width: `${Math.min((estimatedWPoints / 50000) * 100, 100)}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-purple-50 border border-purple-100 text-xs text-purple-705 leading-relaxed mt-6">
            🏆 <strong>¿Sabías qué?</strong> El promedio de nuestros corredores gana 250 WPoints por día. ¡Continúa la racha de entrenamiento para multiplicar tus puntos de bonificación semanales!
          </div>
        </div>
      </div>
    </div>
  );
}
