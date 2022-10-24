import { AxiosError } from "axios";
import { makeAutoObservable } from "mobx";
import { IUser } from "../models/IUser";
import AuthService from "../services/AuthService";
import axios from "axios";
import { AuthResponse } from "../models/response/AuthResponse";
import { API_URL } from "../http";

export default class Store {
  user = {} as IUser;
  isAuth = false;
  isLoading = false;
  error = "" as string | undefined;
  isMountLoading = false;
  constructor() {
    makeAutoObservable(this);
  }

  setAuth(bool: boolean) {
    this.isAuth = bool;
  }

  setUser(user: IUser) {
    this.user = user;
  }

  setLoading(bool: boolean) {
    this.isLoading = bool;
  }

  setMountLoading(bool: boolean) {
    this.isMountLoading = bool;
  }

  setError(err: string | undefined) {
    this.error = err;
  }

  async login(email: string, password: string) {
    this.setLoading(true);
    try {
      const response = await AuthService.login(email, password);
      console.log(response);

      localStorage.setItem("token", response.data.accessToken);
      this.setAuth(true);
      this.setUser(response.data.user);
    } catch (error) {
      this.setError((error as AxiosError<{ message: string }>).response?.data.message);
      console.log((error as AxiosError<{ message: string }>).response?.data.message);
    } finally {
      this.setLoading(false);
    }
  }

  async registration(email: string, password: string) {
    this.setLoading(true);
    try {
      const response = await AuthService.registration(email, password);
      console.log(response);
      localStorage.setItem("token", response.data.accessToken);
      this.setAuth(true);
      this.setUser(response.data.user);
      this.setError("");
    } catch (error) {
      this.setError((error as AxiosError<{ message: string }>).response?.data.message);
      console.log((error as AxiosError<{ message: string }>).response?.data.message);
    } finally {
      this.setLoading(false);
    }
  }

  async logout() {
    try {
      await AuthService.logout();
      localStorage.removeItem("token");
      this.setAuth(false);
      this.setUser({} as IUser);
    } catch (error) {
      console.log((error as AxiosError<{ message: string }>).response?.data.message);
    }
  }

  async checkAuth() {
    this.setMountLoading(true);
    try {
      const response = await axios.get<AuthResponse>(`${API_URL}/refresh`, { withCredentials: true });
      console.log(response);
      localStorage.setItem("token", response.data.accessToken);
      this.setAuth(true);
      this.setUser(response.data.user);
    } catch (error) {
      console.log((error as AxiosError<{ message: string }>).response?.data.message);
    } finally {
      this.setMountLoading(false);
    }
  }
}
