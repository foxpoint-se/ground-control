import { useState } from "react";

export const ClearAndConfirmButton = ({ onClick }: { onClick: () => void }) => {
  const [isConfirming, setIsConfirming] = useState(false);
  return (
    <>
      {isConfirming ? (
        <>
          <button
            className="btn btn-xs btn-error mr-sm"
            onClick={() => {
              onClick();
              setIsConfirming(false);
            }}
          >
            Confirm
          </button>
          <button
            className="btn btn-xs"
            onClick={() => {
              setIsConfirming(false);
            }}
          >
            Cancel
          </button>
        </>
      ) : (
        <button
          onClick={() => {
            setIsConfirming(true);
          }}
          className="btn btn-xs"
        >
          Clear
        </button>
      )}
    </>
  );
};
