import { useCallback, useState } from "react";
import { isSoundEnabled, setSoundEnabled, sfx } from "../lib/sound";

export function useSound() {
  const [on, setOn] = useState(isSoundEnabled());

  const toggle = useCallback(async () => {
    const next = !on;
    await setSoundEnabled(next);
    setOn(next);
  }, [on]);

  const play = useCallback((name) => {
    const fn = sfx[name];
    if (fn) fn();
  }, []);

  return { on, toggle, play };
}
