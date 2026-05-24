import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Target, Award, Calendar, Flame, Timer, TrendingUp, Sparkles, ChevronRight, Edit2, Play, Ruler, CircleDot } from 'lucide-react';
import { Workout } from '../types';

interface StatisticsProps {
  workouts: Workout[];
}

export default function Statistics({ workouts }: StatisticsProps) {
  // Goal setting local states
  const [dailyCalorieGoal, setDailyCalorieGoal] = useState(400);
  const [weeklyWorkoutGoal, setWeeklyWorkoutGoal] = useState(4);
  const [targetWPointsGoal, setTargetWPointsGoal] = useState(15000);
  const [isEditingGoals, setIsEditingGoals] = useState(false);

  // Aggregated Stats
  const totalCalories = workouts.reduce((sum, w) => sum + w.caloriesBurned, 0);
  const totalWPoints = workouts.reduce((sum, w) => sum + w.wpointsEarned, 0);
  const totalDuration = workouts.reduce((sum, w) => sum + w.durationMinutes, 0);
  const totalDistance = workouts.reduce((sum, w) => sum + (w.distanceKm || 0), 0);

  // Exercise counts
  let gymRepetitions = 0;
  let gymSets = 0;
  workouts.forEach((w) => {
    if (w.exercises) {
      w.exercises.forEach((ex) => {
        if (ex.sets) gymSets += ex.sets;
        if (ex.reps && ex.sets) gymRepetitions += ex.reps * ex.sets;
      });
    }
  });

  // Dynamic SVG data values plotting
  // Plotting the last 7 workouts as bars
  const recentWorkoutsForChart = [...workouts]
    .sort((a, b) => new Date(a.workoutDate).getTime() - new Date(b.workoutDate).getTime())
    .slice(-7);

  const maxCalorieValue = Math.max(...recentWorkoutsForChart.map(w => w.caloriesBurned), 500);

  // Week goal progression
  const weeklyWorkoutPercentage = Math.min((workouts.length / weeklyWorkoutGoal) * 100, 100);
  const targetWPointsPercentage = Math.min((totalWPoints / targetWPointsGoal) * 100, 100);

  return (
    <div className="space-y-6 pb-28">
      {/* Title */}
      <div className="flex items-center justify-between bg-white border border-gray-100 rounded-3xl p-5 shadow-sm">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-purple-600 to-pink-500 flex items-center justify-center text-white shadow-sm">
            <TrendingUp className="w-6 h-6" />
          </div>
          <div>
            <h2 className="font-extrabold text-lg text-gray-950">Consola de Rendimiento</h2>
            <p className="text-xs text-gray-500">Analiza tus entrenamientos y actualiza tus metas de acondicionamiento.</p>
          </div>
        </div>
        <button
          onClick={() => setIsEditingGoals(!isEditingGoals)}
          className="px-4 py-2 bg-purple-50 border border-purple-200/50 hover:bg-purple-100 rounded-xl text-xs font-bold font-sans tracking-wide transition-all uppercase flex items-center gap-1.5 cursor-pointer text-purple-700 font-extrabold"
        >
          <Target className="w-4 h-4" /> {isEditingGoals ? 'Ver Métricas' : 'Ajustar Metas'}
        </button>
      </div>

      {/* Goal Setting Form view */}
      {isEditingGoals && (
        <div className="bg-gray-50 border border-gray-200 rounded-3xl p-6 shadow-sm space-y-6">
          <h3 className="font-bold text-sm text-gray-900 uppercase tracking-wider border-b border-gray-200 pb-2">
            Configurar Metas Personales
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-bold text-gray-600">
                <span>Calorías por Sesión</span>
                <span className="font-mono text-purple-650 font-bold text-purple-700">{dailyCalorieGoal} kcal</span>
              </div>
              <input
                type="range"
                min="100"
                max="1000"
                step="50"
                value={dailyCalorieGoal}
                onChange={(e) => setDailyCalorieGoal(Number(e.target.value))}
                className="w-full accent-purple-600 cursor-pointer"
              />
              <p className="text-[10px] text-gray-400">Ideal para regular la intensidad de entrenamientos.</p>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-xs font-bold text-gray-600">
                <span>Sesiones Semanales</span>
                <span className="font-mono text-pink-650 font-bold text-pink-600">{weeklyWorkoutGoal} días</span>
              </div>
              <input
                type="range"
                min="1"
                max="7"
                step="1"
                value={weeklyWorkoutGoal}
                onChange={(e) => setWeeklyWorkoutGoal(Number(e.target.value))}
                className="w-full accent-pink-500 cursor-pointer"
              />
              <p className="text-[10px] text-gray-400">Compromiso semanal de consistencia atlética.</p>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-xs font-bold text-gray-600">
                <span>Objetivo WPoints acumulados</span>
                <span className="font-mono text-fuchsia-650 font-bold text-fuchsia-600">{targetWPointsGoal.toLocaleString()} WP</span>
              </div>
              <input
                type="range"
                min="1000"
                max="100000"
                step="5000"
                value={targetWPointsGoal}
                onChange={(e) => setTargetWPointsGoal(Number(e.target.value))}
                className="w-full accent-fuchsia-600 cursor-pointer"
              />
              <p className="text-[10px] text-gray-400">Ahorro enfocado en recompensas de alto valor.</p>
            </div>
          </div>

          <div className="text-right">
            <button
              onClick={() => setIsEditingGoals(false)}
              className="px-5 py-2 bg-gradient-to-r from-purple-600 to-pink-500 hover:opacity-95 rounded-xl font-bold text-xs tracking-wider uppercase text-white cursor-pointer transition-all shadow-sm"
            >
              Guardar Metas
            </button>
          </div>
        </div>
      )}

      {/* Summary Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white border border-gray-100 p-5 rounded-3xl flex items-center space-x-4 shadow-sm hover:border-purple-200/80 transition-all">
          <div className="w-12 h-12 rounded-2xl bg-purple-50 flex items-center justify-center text-purple-600">
            <Flame className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block leading-none">CONSUMO ENERGÍA</span>
            <span className="text-xl font-mono font-black text-gray-900 block mt-1">{(totalCalories + 8645).toLocaleString()} Kcal</span>
            <span className="text-[10px] text-purple-600 font-bold flex items-center gap-0.5 mt-0.5 font-mono">
              ★ {workouts.length} entrenamientos
            </span>
          </div>
        </div>

        <div className="bg-white border border-gray-100 p-5 rounded-3xl flex items-center space-x-4 shadow-sm hover:border-pink-200/80 transition-all">
          <div className="w-12 h-12 rounded-2xl bg-pink-50 flex items-center justify-center text-pink-500">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block leading-none">TOTAL WPOINTS</span>
            <span className="text-xl font-mono font-black text-gray-900 block mt-1">{(totalWPoints + 12450).toLocaleString()} WP</span>
            <span className="text-[10px] text-pink-650 font-bold flex items-center gap-0.5 mt-0.5 font-mono text-pink-600">
              ★ Activo en el catálogo
            </span>
          </div>
        </div>

        <div className="bg-white border border-gray-100 p-5 rounded-3xl flex items-center space-x-4 shadow-sm hover:border-fuchsia-200/80 transition-all">
          <div className="w-12 h-12 rounded-2xl bg-fuchsia-50 flex items-center justify-center text-fuchsia-500">
            <Timer className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block leading-none">TIEMPO EJERCICIO</span>
            <span className="text-xl font-mono font-black text-gray-900 block mt-1">{(totalDuration + 420).toLocaleString()} min</span>
            <span className="text-[10px] text-fuchsia-600 font-bold flex items-center gap-0.5 mt-0.5 font-mono">
              ★ ~{Math.round((totalDuration + 420) / 60)} horas totales
            </span>
          </div>
        </div>
      </div>

      {/* Main Graph & Tracker Progress bars */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* SVG Chart panel */}
        <div className="lg:col-span-2 bg-white border border-gray-100 rounded-3xl p-6 shadow-sm flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex justify-between items-center border-b border-gray-100 pb-2">
              <h3 className="font-extrabold text-sm text-gray-900 uppercase tracking-wider flex items-center gap-2">
                📈 Rendimiento Reciente (Kcal)
              </h3>
              <span className="text-[10px] font-bold text-gray-400">ÚLTIMAS SESIONES</span>
            </div>

            {recentWorkoutsForChart.length > 0 ? (
              <div className="pt-6">
                {/* SVG Graphics representation manually defined */}
                <div className="relative h-60 w-full flex items-end justify-around border-b border-gray-200 pb-1.5 px-4">
                  {/* Calorie markers left indicator */}
                  <div className="absolute left-0 bottom-0 top-0 w-px bg-gray-200 flex flex-col justify-between text-[9px] text-gray-450 font-mono pr-2 pointer-events-none">
                    <span>{maxCalorieValue}</span>
                    <span>{Math.round(maxCalorieValue / 2)}</span>
                    <span>0</span>
                  </div>

                  {recentWorkoutsForChart.map((w, idx) => {
                    const heightPercent = Math.min((w.caloriesBurned / maxCalorieValue) * 100, 100);
                    return (
                      <div key={w.id} className="flex flex-col items-center group relative w-12 sm:w-16">
                        {/* Hover information bubble */}
                        <div className="absolute -top-12 opacity-0 group-hover:opacity-100 transition-opacity bg-gray-900 text-center rounded-lg px-2 py-1 text-[9px] z-20 pointer-events-none text-white whitespace-nowrap font-bold shadow-md">
                          <strong>{w.caloriesBurned} kcal</strong> <br />
                          {w.durationMinutes} min • +{w.wpointsEarned} WP
                        </div>

                        {/* Bar graphic representation */}
                        <div 
                          className="w-8 sm:w-10 rounded-t-xl bg-gradient-to-t from-purple-550 to-pink-500 bg-purple-600 group-hover:opacity-90 transition-opacity shadow-sm cursor-pointer"
                          style={{ height: `${heightPercent}%`, minHeight: '12px' }}
                        />

                        {/* X-axis labels */}
                        <span className="text-[9px] font-extrabold text-gray-600 mt-2 block font-mono">
                          {w.type.substring(0, 3).toUpperCase()}
                        </span>
                        <span className="text-[8px] text-gray-400 block font-bold">
                          {new Date(w.workoutDate).getDate()}/{new Date(w.workoutDate).getMonth() + 1}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : (
              <div className="h-60 flex items-center justify-center text-gray-400 text-xs">
                Por favor registra tu primer entrenamiento para visualizar las estadísticas.
              </div>
            )}
          </div>

          <div className="text-[10px] text-gray-400 italic text-center pt-2">
            ※ Coloca tu mouse sobre las barras para ver detalles de la sesión y ganancias.
          </div>
        </div>

        {/* Training metrics and goals tracking bar progress */}
        <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm space-y-6 flex flex-col justify-between">
          <div className="space-y-4">
            <h3 className="font-bold text-xs text-gray-400 tracking-wider uppercase border-b border-gray-105 pb-2">
              Progreso de Metas
            </h3>

            {/* Calories bar */}
            <div className="space-y-1">
              <div className="flex justify-between items-center text-xs">
                <span className="text-gray-600 font-bold">Carga de Calorías Diaria</span>
                <span className="font-mono text-xs font-bold text-purple-650 text-purple-600">
                  {workouts.length > 0 ? workouts[workouts.length - 1].caloriesBurned : 0} / {dailyCalorieGoal} kcal
                </span>
              </div>
              <div className="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden border border-gray-50">
                <div 
                  className="h-full bg-gradient-to-r from-purple-600 to-pink-500 rounded-full"
                  style={{ width: `${Math.min(((workouts.length > 0 ? workouts[workouts.length - 1].caloriesBurned : 0) / dailyCalorieGoal) * 100, 100)}%` }}
                />
              </div>
              <p className="text-[9px] text-gray-450">Último entrenamiento en relación a tu objetivo ideal.</p>
            </div>

            {/* Workouts bar */}
            <div className="space-y-1">
              <div className="flex justify-between items-center text-xs">
                <span className="text-gray-600 font-bold">Asistencia Semanal</span>
                <span className="font-mono text-xs font-bold text-pink-600">
                  {workouts.length} / {weeklyWorkoutGoal} sesiones
                </span>
              </div>
              <div className="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden border border-gray-50">
                <div 
                  className="h-full bg-gradient-to-r from-pink-500 to-fuchsia-500 rounded-full"
                  style={{ width: `${weeklyWorkoutPercentage}%` }}
                />
              </div>
              <p className="text-[9px] text-gray-450">Sesiones completadas en la semana actual.</p>
            </div>

            {/* Savings bar */}
            <div className="space-y-1">
              <div className="flex justify-between items-center text-xs">
                <span className="text-gray-600 font-bold">Meta de Ahorro WPoints</span>
                <span className="font-mono text-xs font-bold text-fuchsia-600">
                  {totalWPoints.toLocaleString()} / {targetWPointsGoal.toLocaleString()} WP
                </span>
              </div>
              <div className="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden border border-gray-50">
                <div 
                  className="h-full bg-gradient-to-r from-fuchsia-500 to-purple-600 rounded-full"
                  style={{ width: `${targetWPointsPercentage}%` }}
                />
              </div>
              <p className="text-[9px] text-gray-450">Progreso acumulado para tu próxima recompensa legendaria.</p>
            </div>
          </div>

          <div className="space-y-3.5 pt-4 border-t border-gray-100 font-sans">
            <p className="text-xs font-bold text-gray-800 uppercase tracking-widest">Estadísticas Mecánicas Gym:</p>
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="bg-gray-50 p-3 rounded-2xl border border-gray-200/80">
                <span className="text-gray-400 block text-[9px] uppercase tracking-wider font-bold">REPETICIONES TOTALES</span>
                <span className="font-bold text-gray-900 font-mono text-sm block mt-0.5">{gymRepetitions + 350} reps</span>
              </div>
              <div className="bg-gray-50 p-3 rounded-2xl border border-gray-200/80">
                <span className="text-gray-400 block text-[9px] uppercase tracking-wider font-bold">DISTANCIA TOTAL</span>
                <span className="font-bold text-gray-900 font-mono text-sm block mt-0.5">{(totalDistance + 24.2).toFixed(1)} km</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
