'use client';
import Link from 'next/link';

export default function Results() {
  return (
    <div className="flex flex-row gap-6 justify-start items-start fixed left-[140px] bottom-[40px]">
        <div className="results-container">
          <h1 className="results-title">Results</h1>
          <div className="results-content">
            <p>
              <strong>Objective Function Value:</strong> 123123123
            </p>
            <p>
              <strong>Total Duration:</strong> 123123123 s
            </p>
            <Link href="/plot/plotObjFunc.html" target="_blank" className="plotBut" id="plotObjFunc">
                Plot Objective Function
            </Link>
          </div>
        </div>
        <div className="results-container">
          <h1 className="results-title">Simulated Annealing</h1>
          <div className="results-content">
            <p>
              <strong>Objective Function Value:</strong> 123123123
            </p>
            <p>
              <strong>Total Duration:</strong> 123123123 s
            </p>
            <button className="plotBut" id="plotAnal">
            Acceptance Probability Plot
            </button>
          </div>
        </div>
    </div>
  );
}
