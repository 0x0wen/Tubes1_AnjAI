"use client";
import Link from "next/link";

type ResultsProps = {
  finalstate: number[];
  time_taken: number;
  hurestic: number;
  iterations: number;
  algorithm: string;
  restarts: number;
  iterRestarts: number;
  frekuensi: number;
};

export default function Results({ results }: { results: ResultsProps }) {
  const time_taken = results.time_taken.toFixed(3);
  const algo = results.algorithm;

  return (
    <div className="flex flex-row gap-6 justify-start items-start fixed left-[140px] bottom-[40px]">
      <div className="results-container">
        <h1 className="results-title">Results</h1>
        <div className="results-content">
          <p>
            <strong>Objective Function Value:</strong> {results.hurestic}
          </p>
          <p>
            <strong>Total Duration:</strong> {time_taken} s
          </p>
          {algo == "steep" || algo == "stoc" || algo == "side" ? (
            <p>
              <strong>Iterations:</strong> {results.iterations}
            </p>
          ) : null}
          {algo == "rando" ? (
            <>
              <p>
                <strong>Restarts:</strong> {results.restarts}
              </p>
              <p>
                <strong>Iterations per Restart:</strong> {results.iterRestarts}
              </p>
            </>
          ) : null}
          <Link
            href="/plot/plotObjFunc.html"
            target="_blank"
            className="plotBut"
            id="plotObjFunc"
          >
            Plot Objective Function
          </Link>
          {algo == "simul" ? (
            <>
              <p>
                <strong>Frequency:</strong> {results.frekuensi}
              </p>
              <Link
                href="/plot/plotAcceptanceProb.html"
                target="_blank"
                className="plotBut"
                id="plotAnal"
              >
                Acceptance Probability Plot
              </Link>
            </>
          ) : null}
        </div>
      </div>
    </div>
  );
}
