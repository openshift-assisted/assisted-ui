export interface ValidationErrors {
  [name: string]: ValidationError[];
}

export interface ValidationError {
  name: string;
  message: string;
}
