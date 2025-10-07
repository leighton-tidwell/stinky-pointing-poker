export type DeckPreset = "fibonacci" | "powersOfTwo" | "tShirt" | "custom";

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
  {
    value: "custom",
    label: "Custom Signals",
    description: "Craft a bespoke vocabulary that matches how your squad estimates.",
    values: [],
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
  customValues?: string[] | null,
) => {
  const definition = getDeckDefinition(preset);
  const baseValues =
    preset === "custom" && customValues?.length
      ? customValues
      : definition.values;
  const values = baseValues
    .map((value) => value.trim())
    .filter((value) => value.length > 0);

  if (includeQuestionMark) {
    values.push("?");
  }

  if (includeCoffeeBreak) {
    values.push("☕");
  }

  return Array.from(new Set(values));
};

export const supportsAverageForDeck = (
  preset: DeckPreset,
  customValues?: string[] | null,
  allowCustomAverage?: boolean,
) => {
  if (preset === "custom") {
    if (!allowCustomAverage) {
      return false;
    }

    if (!customValues || customValues.length === 0) {
      return false;
    }

    return customValues.every((value) => isNumericVoteValue(value.trim())) ?? false;
  }

  return getDeckDefinition(preset).supportsAverage;
};

export const isNumericVoteValue = (value: string) => {
  if (!value) return false;
  const numeric = Number(value);

  return Number.isFinite(numeric);
};

export const deckOptionsCatalog = deckDefinitions;
