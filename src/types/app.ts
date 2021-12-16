export interface APIResponse {
  status_code?: number;
  data?: any;
}

export interface BasicMap {
  [key: string]: object;
}

export interface PunctuationsMap {
  [key: string]: { [key: string]: boolean };
}
