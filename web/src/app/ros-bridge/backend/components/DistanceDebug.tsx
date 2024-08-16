import { Toggle } from "@/app/components/Toggle";
import { Coordinate } from "@/app/components/topics";
import { useEffect, useRef } from "react";
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

const Log = ({ entries }: { entries: Entry[] }) => {
  return (
    <div className="border border-neutral-200 h-[500px]">
      <Table entries={entries} />
    </div>
  );
};

export const DistanceDebug = ({
  isRecording,
  setIsRecording,
  entries,
  onClearEntries,
}: {
  isRecording: boolean;
  setIsRecording: (isRecording: boolean) => void;
  entries: Entry[];
  onClearEntries: () => void;
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
        <Log entries={entries} />
      </div>
    </div>
  );
};

const Table = ({ entries }: { entries: Entry[] }) => {
  return (
    <table className="table table-xs">
      <thead>
        <tr>
          <th>Recorded location</th>
        </tr>
      </thead>
      <tbody>
        {entries.map(({ receivedAt, type }) => {
          return (
            <tr
              key={`${type}${receivedAt}`}
              className={`${
                type === "gnss" ? "bg-green-200" : ""
              } [overflow-anchor:none]`}
            >
              <td>{receivedAt}</td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};
