import * as React from "react";
import { gameStatus } from "./App";

function TimeWatch(prm) {
  const intervalRef = React.useRef(null);
  const start = React.useCallback(() => {
    if (intervalRef.current !== null) {
      return;
    }
    intervalRef.current = setInterval(() => {
      prm.setTime((c) => c + 1);
    }, 1000);
  }, []);
  const stop = React.useCallback(() => {
    if (intervalRef.current === null) {
      return;
    }
    clearInterval(intervalRef.current);
    intervalRef.current = null;
  }, []);

  if (prm.flgGame === gameStatus.Now) {
    start();
  } else {
    stop();
  }

  return <div>経過時間：{prm.time}</div>;
}

export default React.memo(TimeWatch);
