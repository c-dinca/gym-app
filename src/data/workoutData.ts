import { WorkoutDay, VolumeData, ProgressionData, Exercise, WarmupPhase, ExerciseSet } from '@typesProject/index';

export const DAYS = [
  { id: '0', short: "Mi", label: "Miercuri", title: "UPPER BODY", subtitle: "Forță", color: "#E63946" },
  { id: '1', short: "Jo", label: "Joi", title: "LOWER BODY", subtitle: "Forță", color: "#E63946" },
  { id: '2', short: "Vi", label: "Vineri", title: "PUSH", subtitle: "Hipertrofie", color: "#E63946" },
  { id: '3', short: "Sâ", label: "Sâmbătă", title: "PULL", subtitle: "Hipertrofie", color: "#E63946" },
  { id: '4', short: "Du", label: "Duminică", title: "LEGS", subtitle: "Hipertrofie", color: "#E63946" },
];

const generateSets = (count: number, reps: number): ExerciseSet[] => {
  return Array.from({ length: count }).map((_, i) => ({
    id: `set-${i + 1}`,
    reps,
    weight: 0,
    completed: false,
  }));
};

const D1_WARMUP: WarmupPhase[] = [
  { id: 'w1', title: 'Încălzire', description: "5 min cardio ușor + mobilitate umeri/torace + 2 seturi progresive la bench press (50% și 70%)" }
];

const D1_EXERCISES: Exercise[] = [
  { id: 'e1-1', name: 'Barbell Bench Press', targetMuscle: 'Piept', sets: generateSets(4, 5), restTimeSeconds: 180, restTimeDisplay: '3 min', rpe: 'RPE 7-8', alternative: 'DB Bench Press', formInstruction: 'Retrage scapulele, arc toracic natural. Coboară controlat la piept inferior.' },
  { id: 'e1-2', name: 'Barbell Bent-Over Row', targetMuscle: 'Spate', sets: generateSets(4, 5), restTimeSeconds: 180, restTimeDisplay: '3 min', rpe: 'RPE 7-8', alternative: 'Pendlay Row', formInstruction: 'Spate neutru, trage cu coatele nu cu mâinile, scapule retrase complet sus.' },
  { id: 'e1-3', name: 'Overhead Press', targetMuscle: 'Umeri', sets: generateSets(3, 6), restTimeSeconds: 150, restTimeDisplay: '2-3 min', rpe: 'RPE 7-8', alternative: 'DB Shoulder Press', formInstruction: 'Abdomen și fesieri activi. Nu te lăsa pe spate. Împinge drept, treci pe lângă cap.' },
  { id: 'e1-4', name: 'Weighted Pull-ups', targetMuscle: 'Spate', sets: generateSets(3, 6), restTimeSeconds: 150, restTimeDisplay: '2-3 min', rpe: 'RPE 7-8', alternative: 'Lat Pulldown', formInstruction: 'Extensie completă jos, bărbie peste bară sus. Controlează negativa.' },
  { id: 'e1-5', name: 'DB Incline Press', targetMuscle: 'Piept', sets: generateSets(3, 10), restTimeSeconds: 90, restTimeDisplay: '90 sec', rir: 'RIR 2', alternative: 'Cable Incline Fly', formInstruction: 'Bancă la 30°. Coboară ganterele la nivelul pieptului, nu mai jos de umăr.' },
  { id: 'e1-6', name: 'Face Pulls', targetMuscle: 'Delt. Post.', sets: generateSets(3, 15), restTimeSeconds: 60, restTimeDisplay: '60 sec', rir: 'RIR 2', alternative: 'Band Pull-Apart', formInstruction: 'Trage spre față cu rotație externă. Coatele sus, peste nivelul umerilor.' },
  { id: 'e1-7', name: 'Barbell Curl', targetMuscle: 'Biceps', sets: generateSets(2, 10), restTimeSeconds: 60, restTimeDisplay: '60 sec', rir: 'RIR 2', alternative: 'DB Curl', formInstruction: 'Coatele fixe lângă corp. Fără legănare. Controlează faza negativă 2-3 sec.' }
];

const D2_WARMUP: WarmupPhase[] = [
  { id: 'w2', title: 'Încălzire', description: "5 min cardio + mobilitate șolduri/glezne + 2 seturi progresive la squat (50% și 70%)" }
];

const D2_EXERCISES: Exercise[] = [
  { id: 'e2-1', name: 'Barbell Back Squat', targetMuscle: 'Cvadriceps', sets: generateSets(4, 5), restTimeSeconds: 180, restTimeDisplay: '3 min', rpe: 'RPE 7-8', alternative: 'Front Squat', formInstruction: 'Genunchii urmăresc direcția degetelor. Sub paralel. Piept sus, abdomen activat.' },
  { id: 'e2-2', name: 'Romanian Deadlift', targetMuscle: 'Hamstrings', sets: generateSets(4, 6), restTimeSeconds: 150, restTimeDisplay: '2-3 min', rpe: 'RPE 7-8', alternative: 'Stiff-Leg DL', formInstruction: 'Împinge șoldul înapoi, genunchii ușor flexați. Bara lipită de picioare. Spate NEUTRU.' },
  { id: 'e2-3', name: 'Barbell Hip Thrust', targetMuscle: 'Fesieri', sets: generateSets(3, 8), restTimeSeconds: 150, restTimeDisplay: '2-3 min', rpe: 'RPE 7-8', alternative: 'Glute Bridge', formInstruction: 'Scapulele pe bancă. Squeeze maxim la fesieri sus. Nu hiperextinde lombar.' },
  { id: 'e2-4', name: 'Leg Press', targetMuscle: 'Cvadriceps', sets: generateSets(3, 10), restTimeSeconds: 120, restTimeDisplay: '2 min', rir: 'RIR 2', alternative: 'Hack Squat', formInstruction: 'Picioare la lățimea umerilor, mijlocul platformei. Nu bloca genunchii sus.' },
  { id: 'e2-5', name: 'Leg Curl', targetMuscle: 'Hamstrings', sets: generateSets(3, 12), restTimeSeconds: 90, restTimeDisplay: '90 sec', rir: 'RIR 2', alternative: 'Nordic Curl', formInstruction: 'Mișcare controlată, squeeze 1 sec sus. Nu ridica fesierul de pe bancă.' },
  { id: 'e2-6', name: 'Standing Calf Raise', targetMuscle: 'Gambe', sets: generateSets(4, 12), restTimeSeconds: 60, restTimeDisplay: '60 sec', rir: 'RIR 1-2', alternative: 'Seated Calf Raise', formInstruction: 'Extensie completă sus, stretch complet jos. Pauză 1 sec în ambele poziții.' }
];

const D3_WARMUP: WarmupPhase[] = [
  { id: 'w3', title: 'Încălzire', description: "5 min cardio + mobilitate umeri + 2 seturi progresive la incline press (50% și 70%)" }
];

const D3_EXERCISES: Exercise[] = [
  { id: 'e3-1', name: 'Incline Barbell Press', targetMuscle: 'Piept sus', sets: generateSets(4, 10), restTimeSeconds: 120, restTimeDisplay: '2 min', rir: 'RIR 2', alternative: 'Incline DB Press', formInstruction: 'Bancă 30-45°. Retrage scapulele. Coboară controlat, nu ricosa.' },
  { id: 'e3-2', name: 'Flat Dumbbell Press', targetMuscle: 'Piept', sets: generateSets(3, 12), restTimeSeconds: 90, restTimeDisplay: '90 sec', rir: 'RIR 1-2', alternative: 'Machine Chest Press', formInstruction: 'Arc ușor de ganteră. Coatele la 45° de corp, nu 90°.' },
  { id: 'e3-3', name: 'Cable Crossover', targetMuscle: 'Piept', sets: generateSets(3, 15), restTimeSeconds: 60, restTimeDisplay: '60 sec', rir: 'RIR 1', alternative: 'Pec Deck', formInstruction: 'Cabluri de jos în sus pentru piept superior. Squeeze 1 sec la contracție.' },
  { id: 'e3-4', name: 'Lateral Raise', targetMuscle: 'Delt. Lat.', sets: generateSets(4, 15), restTimeSeconds: 60, restTimeDisplay: '60 sec', rir: 'RIR 1', alternative: 'Cable Lateral Raise', formInstruction: 'Ușoară flexie în coate. Ridică până la nivelul umerilor, nu mai sus. Controlat.' },
  { id: 'e3-5', name: 'Overhead Tricep Ext.', targetMuscle: 'Triceps', sets: generateSets(3, 15), restTimeSeconds: 60, restTimeDisplay: '60 sec', rir: 'RIR 1', alternative: 'Skull Crushers', formInstruction: 'Coatele orientate înainte, fixe. Extensie completă. Stretch bun jos.' },
  { id: 'e3-6', name: 'Tricep Pushdown', targetMuscle: 'Triceps', sets: generateSets(3, 15), restTimeSeconds: 60, restTimeDisplay: '60 sec', rir: 'RIR 1', alternative: 'Dips la bancă', formInstruction: 'Coatele lipite de corp. Extensie completă jos. Nu folosi impuls.' }
];

const D4_WARMUP: WarmupPhase[] = [
  { id: 'w4', title: 'Încălzire', description: "5 min cardio + mobilitate umeri/torace + 2 seturi progresive la deadlift (50% și 70%)" }
];

const D4_EXERCISES: Exercise[] = [
  { id: 'e4-1', name: 'Conventional Deadlift', targetMuscle: 'Spate/Post.', sets: generateSets(3, 5), restTimeSeconds: 180, restTimeDisplay: '3 min', rpe: 'RPE 7-8', alternative: 'Trap Bar DL', formInstruction: 'Spate neutru MEREU. Împinge cu picioarele de pe podea. Bara lipită de corp.' },
  { id: 'e4-2', name: 'Chest-Supported Row', targetMuscle: 'Spate', sets: generateSets(4, 12), restTimeSeconds: 90, restTimeDisplay: '90 sec', rir: 'RIR 1-2', alternative: 'Seated Cable Row', formInstruction: 'Pieptul pe bancă elimină cheating. Retrage scapulele complet. Squeeze sus.' },
  { id: 'e4-3', name: 'Lat Pulldown', targetMuscle: 'Spate', sets: generateSets(3, 12), restTimeSeconds: 90, restTimeDisplay: '90 sec', rir: 'RIR 1-2', alternative: 'Pull-ups', formInstruction: 'Priză largă. Trage spre piept, nu după cap. Ușoară înclinare spate.' },
  { id: 'e4-4', name: 'Cable Row (neutră)', targetMuscle: 'Spate', sets: generateSets(3, 12), restTimeSeconds: 90, restTimeDisplay: '90 sec', rir: 'RIR 2', alternative: 'One-Arm DB Row', formInstruction: 'Priză neutră. Trage la abdomen, nu la piept. Squeeze scapular 1 sec.' },
  { id: 'e4-5', name: 'Rear Delt Fly', targetMuscle: 'Delt. Post.', sets: generateSets(3, 15), restTimeSeconds: 60, restTimeDisplay: '60 sec', rir: 'RIR 1', alternative: 'Reverse Pec Deck', formInstruction: 'Înclinare la 45°. Ridică lateral cu coatele ușor flexate. Fără momentum.' },
  { id: 'e4-6', name: 'Incline DB Curl', targetMuscle: 'Biceps', sets: generateSets(3, 12), restTimeSeconds: 60, restTimeDisplay: '60 sec', rir: 'RIR 1', alternative: 'Cable Curl', formInstruction: 'Bancă la 45°. Stretch complet jos. Nu balansa coatele.' },
  { id: 'e4-7', name: 'Hammer Curl', targetMuscle: 'Biceps', sets: generateSets(2, 12), restTimeSeconds: 60, restTimeDisplay: '60 sec', rir: 'RIR 1', alternative: 'Cross-body Curl', formInstruction: 'Priză neutră. Coatele fixe. Lucrează brahialul și brahioradialul.' }
];

const D5_WARMUP: WarmupPhase[] = [
  { id: 'w5', title: 'Încălzire', description: "5 min cardio + mobilitate șolduri/glezne + 2 seturi progresive la front squat (50% și 70%)" }
];

const D5_EXERCISES: Exercise[] = [
  { id: 'e5-1', name: 'Front Squat', targetMuscle: 'Cvadriceps', sets: generateSets(4, 10), restTimeSeconds: 150, restTimeDisplay: '2-3 min', rir: 'RIR 2', alternative: 'Goblet Squat', formInstruction: 'Coatele sus, bare pe deltoizi. Coboară adânc, genunchii pot trece de degete.' },
  { id: 'e5-2', name: 'Bulgarian Split Squat', targetMuscle: 'Cvadriceps', sets: generateSets(3, 12), restTimeSeconds: 90, restTimeDisplay: '90 sec', rir: 'RIR 1-2', alternative: 'Lunges cu DB', formInstruction: 'Piciorul din spate pe bancă. Trunchi vertical. Coboară până genunchiul atinge aproape solul.' },
  { id: 'e5-3', name: 'Leg Extension', targetMuscle: 'Cvadriceps', sets: generateSets(3, 15), restTimeSeconds: 60, restTimeDisplay: '60 sec', rir: 'RIR 1', alternative: 'Sissy Squat', formInstruction: 'Extensie completă cu squeeze 1 sec. Controlează negativa 2-3 sec.' },
  { id: 'e5-4', name: 'Seated Leg Curl', targetMuscle: 'Hamstrings', sets: generateSets(3, 12), restTimeSeconds: 90, restTimeDisplay: '90 sec', rir: 'RIR 1-2', alternative: 'Lying Leg Curl', formInstruction: 'Flexie completă cu squeeze. Negativa controlată. Nu ridica fesierul.' },
  { id: 'e5-5', name: 'Seated Calf Raise', targetMuscle: 'Gambe', sets: generateSets(4, 15), restTimeSeconds: 60, restTimeDisplay: '60 sec', rir: 'RIR 1', alternative: 'Leg Press Calf', formInstruction: 'Stretch complet jos (2 sec), extensie completă sus (1 sec squeeze).' },
  { id: 'e5-6', name: 'Cable Crunch', targetMuscle: 'Abdomen', sets: generateSets(3, 15), restTimeSeconds: 60, restTimeDisplay: '60 sec', rir: 'RIR 1-2', alternative: 'Hanging Leg Raise', formInstruction: 'Flexie din trunchi, nu din șolduri. Expiră forțat la contracție.' },
  { id: 'e5-7', name: 'Plank', targetMuscle: 'Abdomen', sets: [{ id: 'set-1', reps: 0, weight: 0, completed: false }, { id: 'set-2', reps: 0, weight: 0, completed: false }, { id: 'set-3', reps: 0, weight: 0, completed: false }], restTimeSeconds: 60, restTimeDisplay: '60 sec', alternative: 'Ab Wheel', formInstruction: 'Corp drept ca o scândură. Abdomen și fesieri contractate. Nu lăsa șoldurile să cadă.' }
];

export const workoutDays: WorkoutDay[] = [
  { id: '0', dayOfWeek: 'Miercuri', shortName: 'Mi', title: 'UPPER BODY', subtitle: 'Forță', exercises: D1_EXERCISES, warmup: D1_WARMUP },
  { id: '1', dayOfWeek: 'Joi', shortName: 'Jo', title: 'LOWER BODY', subtitle: 'Forță', exercises: D2_EXERCISES, warmup: D2_WARMUP },
  { id: '2', dayOfWeek: 'Vineri', shortName: 'Vi', title: 'PUSH', subtitle: 'Hipertrofie', exercises: D3_EXERCISES, warmup: D3_WARMUP },
  { id: '3', dayOfWeek: 'Sâmbătă', shortName: 'Sâ', title: 'PULL', subtitle: 'Hipertrofie', exercises: D4_EXERCISES, warmup: D4_WARMUP },
  { id: '4', dayOfWeek: 'Duminică', shortName: 'Du', title: 'LEGS', subtitle: 'Hipertrofie', exercises: D5_EXERCISES, warmup: D5_WARMUP }
];

export const volumeData: VolumeData[] = [
  { muscleGroup: 'Piept', currentSets: 0, targetSets: 17 }, // 16-17 (85%)
  { muscleGroup: 'Spate', currentSets: 0, targetSets: 18 }, // 17-18 (90%)
  { muscleGroup: 'Umeri (lateral)', currentSets: 0, targetSets: 8 }, // 7-8 (40%)
  { muscleGroup: 'Umeri (posterior)', currentSets: 0, targetSets: 6 }, // 6 (30%)
  { muscleGroup: 'Biceps', currentSets: 0, targetSets: 12 }, // 10-12 (55%)
  { muscleGroup: 'Triceps', currentSets: 0, targetSets: 14 }, // 12-14 (65%)
  { muscleGroup: 'Cvadriceps', currentSets: 0, targetSets: 18 }, // 16-18 (88%)
  { muscleGroup: 'Hamstrings', currentSets: 0, targetSets: 14 }, // 12-14 (65%)
  { muscleGroup: 'Fesieri', currentSets: 0, targetSets: 12 }, // 10-12 (55%)
  { muscleGroup: 'Gambe', currentSets: 0, targetSets: 8 }, // 8 (40%)
  { muscleGroup: 'Abdomen', currentSets: 0, targetSets: 6 }, // 3-6 (22%)
];

export const progressionData: ProgressionData[] = [
  { week: 1, mesocyclePhase: "Adaptare (Săpt. 1-2)", description: "Formă corectă. RPE 6-7 pe compuse, RIR 3 pe izolări.", isActive: true },
  { week: 3, mesocyclePhase: "Creștere (Săpt. 3-4)", description: "+2.5 kg compuse, +1-2.5 kg izolări (dacă RIR-ul permite).", isActive: false },
  { week: 5, mesocyclePhase: "Push (Săpt. 5-6)", description: "RPE 8 pe compuse, RIR 1-2 pe izolări. +1 set la 2-3 exerciții cheie.", isActive: false },
  { week: 7, mesocyclePhase: "Peak (Săpt. 7-8)", description: "RPE 8-9 pe compuse. Cele mai mari greutăți din mezociclu.", isActive: false },
  { week: 9, mesocyclePhase: "Deload (Săpt. 9)", description: "Volum -50%, greutate -15%. Focus recuperare, mobilitate, somn.", isActive: false }
];
