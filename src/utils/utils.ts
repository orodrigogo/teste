export const STATUS = ["available", "sold", "cancelled"] as const;
export type Status = (typeof STATUS)[number];

export function getFormmatedStatus(status: string) {
  switch (status) {
    case "available":
      return "anunciado";
    case "sold":
      return "vendido";
    case "cancelled":
      return "desativado";
    default:
      return "invalid-status";
  }
}

export const CATEGORY = [
  "toys",
  "furniture",
  "health and beauty",
  "stationery",
  "utensils",
  "clothing",
  "home appliances",
  "electronics",
  "others",
] as const;
export type Category = (typeof CATEGORY)[number];

export function getFormmatedCategory(category: string) {
  switch (category) {
    case "toys":
      return "Brinquedo";
    case "furniture":
      return "Móvel";
    case "health and beauty":
      return "Saúde & Beleza";
    case "stationery":
      return "Papelaria";
    case "utensils":
      return "Utensílio";
    case "clothing":
      return "Vestuário";
    case "home appliances":
      return "Eletrodoméstico";
    case "electronics":
      return "Eletrônico";
    case "books":
      return "Livro";
    case "others":
      return "Outros";
    default:
      return "invalid-category";
  }
}

export function areFilesEqual({ file1, file2 }: { file1: File; file2: File }) {
  return (
    file1.name === file2.name &&
    file1.size === file2.size &&
    file1.type === file2.type &&
    file1.lastModified === file2.lastModified
  );
}
