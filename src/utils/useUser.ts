import { useState, useEffect } from "react";

const defaultUser = {
  id: "Id",
  name: "Guest"
};

export function useUser() {
  const [user, setUser] = useState(defaultUser);

  useEffect(() => {
    const randomId = () => Math.floor(Math.random() * 10 ** 6).toString();

    const localId = localStorage.getItem("userId");
    const localName = localStorage.getItem("userName");

    const userId = () => (localId === null || localId === defaultUser.id ? randomId() : localId);

    setUser({
      id: userId(),
      name: localName ?? "Guest"
    });
  }, []);

  useEffect(() => {
    if (user && user.id !== defaultUser.id) {
      localStorage.setItem("userId", user.id);
      localStorage.setItem("userName", user.name);
    }
  }, [user]);

  return [user, setUser] as const;
}
