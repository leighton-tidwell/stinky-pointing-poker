export type DeckPreset = "fibonacci" | "powersOfTwo" | "tShirt";

type DeckDefinition = {
  value: DeckPreset;
  label: string;
  description: string;
  values: string[];
  supportsAverage: boolean;
};

const deckDefinitions: DeckDefinition[] = [
  {
    value: "fibonacci",
    label: "Fibonacci",
    description: "Classic sequence for engineering estimates with fine granularity.",
    values: ["0", "0.5", "1", "2", "3", "5", "8", "13", "21", "34"],
    supportsAverage: true,
  },
  {
    value: "powersOfTwo",
    label: "Powers of Two",
    description: "Great when you want fast growth between options.",
    values: ["1", "2", "4", "8", "16", "32", "64"],
    supportsAverage: true,
  },
  {
    value: "tShirt",
    label: "T-Shirt Sizes",
    description: "When your team prefers vibes over numbers.",
    values: ["XXS", "XS", "S", "M", "L", "XL", "XXL"],
    supportsAverage: false,
  },
];

const deckDefinitionByValue = deckDefinitions.reduce(
  (acc, definition) => ({ ...acc, [definition.value]: definition }),
  {} as Record<DeckPreset, DeckDefinition>,
);

export const getDeckDefinition = (
  preset: DeckPreset = "fibonacci",
): DeckDefinition => deckDefinitionByValue[preset] ?? deckDefinitionByValue.fibonacci;

type DeckOptions = {
  includeQuestionMark?: boolean;
  includeCoffeeBreak?: boolean;
};

export const resolveDeckValues = (
  preset: DeckPreset,
  { includeQuestionMark = true, includeCoffeeBreak = false }: DeckOptions,
) => {
  const definition = getDeckDefinition(preset);
  const values = [...definition.values];

  if (includeQuestionMark) {
    values.push("?");
  }

  if (includeCoffeeBreak) {
    values.push("☕");
  }

  return Array.from(new Set(values));
};

export const supportsAverageForDeck = (preset: DeckPreset) =>
  getDeckDefinition(preset).supportsAverage;

export const isNumericVoteValue = (value: string) => {
  if (!value) return false;
  const numeric = Number(value);

  return Number.isFinite(numeric);
};

export const deckOptionsCatalog = deckDefinitions;
