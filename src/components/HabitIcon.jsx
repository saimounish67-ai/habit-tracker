import React from 'react';
import * as Icons from 'lucide-react';

export function HabitIcon({ name, className = 'w-5 h-5', style }) {
  // Find matching Lucide icon or fallback to Target
  const IconComponent = Icons[name] || Icons.Target;
  return <IconComponent className={className} style={style} />;
}
