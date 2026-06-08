export type Store = {
  id: number;
  name: string;
  email: string;
  address: string;
  avgRating: string | number | null;
  totalRatings?: number;
  createdAt: string;
  updatedAt: string;
};
