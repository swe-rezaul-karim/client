import { useEffect, useState } from "react";

export default function CallTimes() {
const [totalCallTimes, setTotalCallTimes] = useState(0)
  useEffect(() => {
    const setSecInCall = () => {
      setTotalCallTimes((pre) => pre + 1);
      setTimeout(setSecInCall, 1000);
    };
    setSecInCall();
    return () => setTotalCallTimes(0);
  }, []);
  return (
    <div
      className={`text-dark_text_2 ${
        totalCallTimes !== 0 ? "block" : "hidden"
      }`}
    >
      {parseInt(totalCallTimes / 3600) >= 0 ? (
        <>
          <span>
            {parseInt(totalCallTimes / 3600).toString().length < 2
              ? "0" + parseInt(totalCallTimes / 3600)
              : parseInt(totalCallTimes / 3600)}
          </span>
          <span>:</span>
        </>
      ) : null}
      <span>
        {parseInt(totalCallTimes / 60).toString().length < 2
          ? "0" + parseInt(totalCallTimes / 60)
          : parseInt(totalCallTimes / 60)}
      </span>
      <span>:</span>
      <span>
        {(totalCallTimes % 60).toString().length < 2
          ? "0" + (totalCallTimes % 60)
          : totalCallTimes % 60}
      </span>
    </div>
  );
}
