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

    setUser({
      id: localId ?? randomId(),
      name: localName ?? "Guest"
    });
  }, []);

  useEffect(() => {
    if (user) {
      localStorage.setItem("userId", user.id);
      localStorage.setItem("userName", user.name);
    }
  }, [user]);

  return [user, setUser] as const;
}
