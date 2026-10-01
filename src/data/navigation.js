export const navigationItems = Object.freeze([
  { id: "overview", label: "Overview" },
  { id: "rules", label: "Rules" },
  { id: "access", label: "Access" },
  { id: "qa", label: "QA" }
]);

export const navigationIds = Object.freeze(
  navigationItems.map((item) => item.id)
);
