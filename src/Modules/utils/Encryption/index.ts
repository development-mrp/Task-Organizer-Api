import bcrypt from 'bcrypt';
import q from 'q';

const salt = 5;

export class Encryption {

  constructor() { }

  public generateHash(password: string) {
    let defer: q.Deffered<Error | any> = q.defer<Error | any>();

    try {
      defer.resolve(bcrypt.hash(password, salt));
    } catch (err) {
      defer.reject(err);
    }

    return defer.promise;
  }

  public verifyHash(password: string, hash: string) {
    let defer: q.Deffered<Error | any> = q.defer<Error | any>();

    try {
      defer.resolve(bcrypt.compare(password, hash));
    } catch (err) {
      defer.reject(err);
    }

    return defer.promise;
  }
}
