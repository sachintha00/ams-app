const isValidSimpleCondition = (condition) => {
  const simpleConditionPattern = /^\s*\d+\s*(==|!=|<|>|<=|>=)\s*\d+\s*$/;
  return simpleConditionPattern.test(condition);
};

const isValidCondition = (condition) => {
  const trimmedCondition = condition.replace(/\s+/g, "");
  const parts = trimmedCondition.split(/(and|or)/);
  const partsFiltered = parts.filter((part) => part !== "");

  for (let i = 0; i < partsFiltered.length; i++) {
    const part = partsFiltered[i];

    if (part === "and" || part === "or") continue;

    if (!isValidSimpleCondition(part)) return false;
  }

  return true;
};

export { isValidCondition };
