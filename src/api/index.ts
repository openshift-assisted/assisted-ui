type OK = string;
type Status = OK | Error;

// Generic API reponse type
//
// We can always expect a status and some data
export interface ApiResponse<T> {
  status: Status;
  data: T;
}

export interface K8sListApiResponse<T> {
  items: T[];
}
