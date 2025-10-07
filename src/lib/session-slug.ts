import { faker } from "@faker-js/faker";

const sanitize = (value: string) =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

const adjectiveGenerators = [
  () => faker.word.adjective({ length: { min: 4, max: 12 } }),
  () => faker.hacker.adjective(),
  () => faker.commerce.productAdjective(),
  () => faker.color.human(),
  () => `${faker.person.firstName()}-esque`,
];

const nounGenerators = [
  () => faker.word.noun({ length: { min: 4, max: 12 } }),
  () => faker.animal.type(),
  () => faker.commerce.productName(),
  () => faker.hacker.noun(),
  () => faker.science.chemicalElement().name,
];

const pickWord = (generators: Array<() => string>) => {
  for (let attempt = 0; attempt < 10; attempt += 1) {
    const candidate = faker.helpers.arrayElement(generators)();
    const cleaned = sanitize(candidate);

    if (cleaned) {
      return cleaned;
    }
  }

  return sanitize(faker.string.alpha({ length: 6 }));
};

const capitalize = (value: string) =>
  value.length ? value[0].toUpperCase() + value.slice(1) : value;

export const generateSessionSlug = () => {
  const adjective = pickWord(adjectiveGenerators);
  const noun = pickWord(nounGenerators);

  return `${adjective}-${noun}`;
};

export const generateSessionTitle = () => {
  const motionNoun = faker.word.noun({ length: { min: 4, max: 10 } });
  const vibeAdjective = faker.word.adjective({ length: { min: 4, max: 10 } });
  const mascot = faker.animal.type();
  const suffix = faker.helpers.arrayElement(["Summit", "Council", "Lab", "Sync", "Assembly"]);

  return `${capitalize(vibeAdjective)} ${capitalize(motionNoun)} ${suffix} of the ${capitalize(mascot)}`;
};
