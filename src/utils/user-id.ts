import { useState, useEffect } from "react";

export function useUserId() {
  const [userId, setUserId] = useState("");

  useEffect(() => {
    const newId = () => Math.floor(Math.random() * 10 ** 6).toString();
    const existingId = () => localStorage.getItem("poker:userId");
    setUserId(existingId() ?? newId());
  }, []);

  useEffect(() => {
    if (!!userId) {
      localStorage.setItem("poker:userId", userId);
    }
  }, [userId]);

  return userId;
}

export function useUserName() {
  const [userName, setUserName] = useState("");

  useEffect(() => {
    const existingName = () => localStorage.getItem("poker:userName");
    setUserName(existingName() ?? "Guest");
  }, []);

  useEffect(() => {
    if (!!userName) {
      localStorage.setItem("poker:userName", userName);
    }
  }, [userName]);

  return [userName, setUserName] as const;
}
