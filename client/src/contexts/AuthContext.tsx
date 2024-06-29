import {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import axios from "axios";
import { Account } from "..";

interface Props {
  children: ReactNode;
}

interface IAuthContext {
  account?: Account;
  isAuthenticated: boolean;
  token: string;
  logout: () => void;
}

const AuthContext = createContext<IAuthContext>({} as IAuthContext);

export function AuthProvider({ children }: Props) {
  const [account, setAccount] = useState<Account | undefined>();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [token, setToken] = useState("");
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const tokenFromLs = localStorage.getItem("token");
    if (!tokenFromLs) return setIsReady(true);
    const apiUri = import.meta.env.VITE_API_URI + "/auth/validate-token";
    axios
      .get(apiUri, { headers: { token: tokenFromLs } })
      .then((response) => {
        const { sub, ...rest } = response.data;
        const data = {
          accountId: sub,
          ...rest,
        } as Account;
        setAccount({ ...data });
        setIsAuthenticated(true);
        setToken(tokenFromLs);
        axios.defaults.headers.common[
          "Authorization"
        ] = `Bearer ${tokenFromLs}`;
      })
      .catch((e) => {
        setIsAuthenticated(false);
        setToken("");
        setAccount(undefined);
        console.error(e);
      })
      .finally(() => setIsReady(true));
  }, []);

  const logout = () => {
    localStorage.removeItem("token");
    setAccount(undefined);
    setIsAuthenticated(false);
    setToken("");
  };

  const value = useMemo(
    () => ({
      account,
      isAuthenticated,
      token,
      logout,
    }),
    [account, isAuthenticated, token]
  );
  return (
    <AuthContext.Provider value={value}>
      {isReady && children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
