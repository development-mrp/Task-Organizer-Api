export default class HttpException extends Error {
  status: number;
  message: string;
  data: any; 

  constructor(status: number, message: string) {
    super(message);
    this.status = status;
    this.message = message;
  }
}