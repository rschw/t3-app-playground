import { useState, useEffect } from "react";

export function useUserId() {
  const [userId, setUserId] = useState("");

  useEffect(() => {
    const newId = () => Math.floor(Math.random() * 10 ** 6).toString();
    const existingId = () => localStorage.getItem("poker:userId");
    setUserId(existingId() ?? newId());
  }, [setUserId]);

  useEffect(() => {
    if (!!userId) {
      localStorage.setItem("poker:userId", userId);
    }
  }, [userId]);

  return userId;
}

export function useUserName() {
  const userId = useUserId();
  const [userName, setUserName] = useState("");

  useEffect(() => {
    const existingName = () => localStorage.getItem("poker:userName");
    setUserName(existingName() ?? userId);
  }, [userId, setUserName]);

  useEffect(() => {
    if (!!userName) {
      localStorage.setItem("poker:userName", userName);
    }
  }, [userName]);

  return [userName, setUserName] as const;
}
