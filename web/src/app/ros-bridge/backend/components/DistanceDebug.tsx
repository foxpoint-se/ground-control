import { Toggle } from "@/app/components/Toggle";
import { Coordinate } from "@/app/components/topics";
import { useEffect, useRef, useState } from "react";
import { ClearAndConfirmButton } from "@/app/components/ClearAndConfirmButton";

const RecordingCircle = ({ isRecording }: { isRecording: boolean }) => {
  return (
    <div
      className={`w-4 h-4 rounded-full ${
        isRecording ? "bg-red-400 animate-pulse" : "bg-neutral-400"
      }`}
    ></div>
  );
};

export type Entry = {
  type: "gnss" | "localization";
  receivedAt: number;
} & Coordinate;

const Log = ({
  entries,
  onClickEntry,
}: {
  entries: Entry[];
  onClickEntry: (e: Entry) => void;
}) => {
  return (
    <div className="border border-neutral-200 h-[500px]">
      <Table entries={entries} onClickEntry={onClickEntry} />
    </div>
  );
};

export const DistanceDebug = ({
  isRecording,
  setIsRecording,
  entries,
  onClearEntries,
  onClickEntry,
}: {
  isRecording: boolean;
  setIsRecording: (isRecording: boolean) => void;
  entries: Entry[];
  onClearEntries: () => void;
  onClickEntry: (entry: Entry) => void;
}) => {
  const divRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (divRef.current) {
      divRef.current.scroll(0, divRef.current.scrollHeight);
    }
  }, [entries.length]);

  return (
    <div>
      <div className="label-text mb-md">Distance debug</div>
      <div className="flex justify-between items-center mb-sm">
        <Toggle
          isToggledOn={isRecording}
          onToggleChange={setIsRecording}
          label="Record?"
        />
        <RecordingCircle isRecording={isRecording} />
      </div>
      <div className="mb-md">
        <ClearAndConfirmButton onClick={onClearEntries} />
      </div>
      <div ref={divRef} id="scroller" className="max-h-[500px] overflow-y-auto">
        <Log entries={entries} onClickEntry={onClickEntry} />
      </div>
    </div>
  );
};

const Table = ({
  entries,
  onClickEntry,
}: {
  entries: Entry[];
  onClickEntry: (e: Entry) => void;
}) => {
  return (
    <table className="table table-xs">
      <thead>
        <tr>
          <th>Recorded location</th>
        </tr>
      </thead>
      <tbody>
        {entries.map((entry) => {
          return (
            <tr
              key={`${entry.type}${entry.receivedAt}`}
              className={`${
                entry.type === "gnss" ? "bg-green-200" : ""
              } [overflow-anchor:none]`}
            >
              <td>
                <LogEntry
                  entry={entry}
                  // onHover={() => {
                  //   console.log("HEJ HEJ", entry);
                  // }}
                  onClick={onClickEntry}
                />
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};

const LogEntry = ({
  entry,
  onHover,
  onClick,
}: {
  entry: Entry;
  onHover?: () => void;
  onClick: (e: Entry) => void;
}) => {
  const [isClicked, setIsClicked] = useState(false);
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    if (isHovering && onHover) {
      onHover();
    }
  }, [isHovering]);

  const handleClick = () => {
    setIsClicked(!isClicked);
    onClick(entry);
  };

  return (
    <>
      <span
        role="button"
        className={`${
          isClicked ? "border border-neutral-500" : ""
        } w-full inline-block`}
        onMouseEnter={() => {
          setIsHovering(true);
        }}
        onMouseLeave={() => {
          setIsHovering(false);
        }}
        onClick={handleClick}
      >
        {entry.receivedAt}
      </span>
      {isClicked && (
        <div>
          <div>lat: {entry.lat},</div>
          <div>lon: {entry.lon}</div>
        </div>
      )}
    </>
  );
};
