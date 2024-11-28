const colorValue = {
  red: "#F05252",
  yellow: "#C27803",
  green: "#0E9F6E",
  blue: "#3F83F8",
  indigo: "#6875F5",
  purple: "#9061F9",
  pink: "#E74694",
};

type Color = keyof typeof colorValue;

export function getColorHex(color: Color) {
  return colorValue[color];
}

export function getRandomColorHex() {
  const colors = Object.keys(colorValue) as Color[];
  const color = colors[Math.floor(Math.random() * colors.length)];

  return colorValue[color];
}
