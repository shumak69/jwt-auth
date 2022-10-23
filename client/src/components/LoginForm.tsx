import { observer } from "mobx-react-lite";
import { useState, useContext, useEffect } from "react";
import { Context } from "../index";
function LoginForm() {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const { store } = useContext(Context);
  const [isCorrectEmail, setIsCorrectEmail] = useState<boolean | null>(null);
  const [isCorrectPassword, setIsCorrectPassword] = useState<boolean | null>(null);

  const checkEmail = (email: string) => {
    return email.search(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
  };
  const checkPassword = (password: string) => {
    return password.length >= 8 && password.length <= 32;
  };

  useEffect(() => {
    store.setError("");
  }, []);

  const registration = () => {
    if (checkEmail(email) === -1) {
      setIsCorrectEmail(false);
    } else {
      setIsCorrectEmail(true);
    }
    setIsCorrectPassword(checkPassword(password));
    store.registration(email, password);
  };
  return (
    <div className="login-form">
      <div className="email">
        <label htmlFor="email">Email</label>
        <input
          type="text"
          placeholder="email"
          onChange={(e) => setEmail(e.target.value)}
          value={email}
          id="email"
        />
        {isCorrectEmail === false && <div className="validationError">Введите корректный email</div>}
      </div>
      <div className="password">
        <label htmlFor="password">Пароль</label>
        <input
          type="password"
          placeholder="Пароль"
          onChange={(e) => setPassword(e.target.value)}
          value={password}
          id="password"
        />
        {isCorrectPassword === false && (
          <div className="validationError">Пароль должен быть от 8 до 32 символов</div>
        )}
      </div>
      {store.error && <div className="error">{store.error}</div>}
      <button onClick={() => store.login(email, password)} className="login">
        Логин
      </button>
      <button onClick={registration} className="registration">
        Регистрация
      </button>
    </div>
  );
}

export default observer(LoginForm);
