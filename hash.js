import bcrypt from "bcrypt";

const plainPassword = "admin"; // 평문 비밀번호
bcrypt.hash(plainPassword, 10).then((hash) => {
  console.log("Hashed password:", hash);
});
