export const BUBBLE_COLORS = [
  '#bc4749', '#386641', '#6a994e', '#a7c957', '#E76F51',
  '#264653', '#2A9D8F', '#E9C46A', '#F4A261', '#8338EC',
];

export function getRandomColor(): string {
  return BUBBLE_COLORS[Math.floor(Math.random() * BUBBLE_COLORS.length)];
}
