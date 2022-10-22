import { observer } from "mobx-react-lite";
import { useState, useContext } from "react";
import { Context } from "../index";
function LoginForm() {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const { store } = useContext(Context);
  return (
    <div>
      <input type="text" placeholder="email" onChange={(e) => setEmail(e.target.value)} value={email} />
      <input type="password" placeholder="Пароль" onChange={(e) => setPassword(e.target.value)} value={password} />
      <button onClick={() => store.login(email, password)}>Логин</button>
      <button onClick={() => store.registration(email, password)}>Регистрация</button>
    </div>
  );
}

export default observer(LoginForm);
