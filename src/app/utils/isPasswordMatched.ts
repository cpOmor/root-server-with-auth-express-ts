import bcrypt from 'bcrypt';

export const isPasswordMatched = (oldPassword: string, hashPassword: string) => {
  bcrypt.compare(oldPassword, hashPassword, function (err, result) {
    if (result) {
      console.log(result, 'file name : isPasswordMatched line number : +-6');
    } else {
      console.log(err, 'file name : isPasswordMatched line number : +-6');
    }
  });
};
