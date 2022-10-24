import { observer } from "mobx-react-lite";
import { useContext, useEffect, useState } from "react";
import { Context } from ".";
import "./app.scss";
import LoginForm from "./components/LoginForm";
import { IUser } from "./models/IUser";
import UserService from "./services/UserService";

function App() {
  const { store } = useContext(Context);
  const [users, setUsers] = useState<IUser[]>([]);
  const [isLoading, setLoading] = useState(false);
  useEffect(() => {
    if (localStorage.getItem("token")) {
      store.checkAuth();
    }
  }, []);

  async function getUsers() {
    setLoading(true);
    try {
      const response = await UserService.fetchUsers();
      setUsers(response.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }

  if (store.isMountLoading) {
    return <div>Загрузка...</div>;
  }

  if (!store.isAuth) {
    return <LoginForm />;
  }
  return (
    <div className="App">
      {store.isAuth && store.user.isActivated && (
        <h1 className="activated">Пользователь авторизован {store.user.email}</h1>
      )}
      {!store.user.isActivated && <h1 className="noActivated">Вам нужно активировать аккаунт с помощью почты</h1>}
      <button className="logOut" onClick={() => store.logout()}>
        Выйти
      </button>
      {store.user.isActivated && (
        <div className="users-Wrapper">
          <button onClick={getUsers} className="getUsers" disabled={isLoading}>
            Получить пользователей
          </button>
          {users.length ? (
            <table>
              <thead>
                <tr>
                  <th>Email пользователя</th>
                  <th className="isActivated">Активирован</th>
                </tr>
              </thead>
              {users.map((user) => (
                <tbody key={user.email}>
                  <tr>
                    <td className="usersEmail">
                      {user.email.length > 31 ? user.email.slice(0, 29) + "..." : user.email}
                    </td>
                    <td className="isActivated">{user.isActivated ? "Да" : "Нет"}</td>
                  </tr>
                </tbody>
              ))}
            </table>
          ) : null}
        </div>
      )}
    </div>
  );
}

export default observer(App);
