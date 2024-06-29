export interface Story {
  id: number;
  title: string;
  score: number;
  by: string;
  kids: number[];
  url: string;
  descendants: number;
}

export interface Comment {
  id: number;
  text: string;
  by: string;
  kids?: number[];
  score?: number;
}
