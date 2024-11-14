const WORKOUT_IMAGES = [
  'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=2000&q=80',
  'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=2000&q=80',
  'https://images.unsplash.com/photo-1599058945522-28d584b6f0ff?auto=format&fit=crop&w=2000&q=80',
  'https://images.unsplash.com/photo-1576678927484-cc907957088c?auto=format&fit=crop&w=2000&q=80',
  'https://images.unsplash.com/photo-1605296867724-fa87a8ef53fd?auto=format&fit=crop&w=2000&q=80'
];

export const getBackgroundImage = (seed?: string): string => {
  if (!seed) {
    return WORKOUT_IMAGES[0];
  }
  
  // Use the seed to consistently select the same image for a given plan
  const hash = seed.split('').reduce((acc, char) => {
    return char.charCodeAt(0) + ((acc << 5) - acc);
  }, 0);
  
  return WORKOUT_IMAGES[Math.abs(hash) % WORKOUT_IMAGES.length];
};