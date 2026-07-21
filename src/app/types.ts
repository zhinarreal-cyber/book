export type Category = 'mndalan' | 'roman' | 'mejuy' | 'adults' | 'ayini';

export type AgeGroup = '4' | '6' | '8' | '10' | '12';

export interface Book {
  id: string;
  title: string;
  author: string;
  category: Category;
  ageGroup?: AgeGroup;
  coverUrl: string;
  synopsis: string;
  isbn: string;
  publisher: string;
  year: string;
  pages: number;
  language: string;
  locationCode: string;
  status: string;
  coverColor?: string; // Hex color for the book's primary visual theme (backdrop glow and stylized cover)
}
