export interface Board {
  id: number;
  title: string;
  content: string;
  createdAt: string;
  imageUrl?: string;
  boardCategory: string;
}

export interface BoardListResponse {
  content: Board[];
  totalPages: number;
  totalElements: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
}
