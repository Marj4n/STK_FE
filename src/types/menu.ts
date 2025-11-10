export type Menu = {
  id: string;
  name: string;
  parentId: string | null;
  parentNames?: string | null;
  order: number | null;
  createdAt?: string;
  updatedAt?: string;
  children?: Menu[];
};
