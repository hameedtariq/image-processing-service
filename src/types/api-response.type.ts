type ApiResponseType<T> = {
  data: T;
  error: string;
  message: string;
};

export default ApiResponseType;
