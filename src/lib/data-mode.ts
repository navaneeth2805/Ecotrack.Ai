import { useEffect, useState } from "react";

const KEY = "ecotrack.includeSample";

function read(): boolean {
  if (typeof window === "undefined") return true;
  const v = window.localStorage.getItem(KEY);
  return v === null ? true : v === "1";
}

export function useIncludeSample(): [boolean, (v: boolean) => void] {
  const [value, setValue] = useState<boolean>(read);

  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === KEY) setValue(read());
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const update = (v: boolean) => {
    window.localStorage.setItem(KEY, v ? "1" : "0");
    setValue(v);
    // notify same-tab listeners
    window.dispatchEvent(new StorageEvent("storage", { key: KEY, newValue: v ? "1" : "0" }));
  };

  return [value, update];
}
