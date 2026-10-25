/**
 * LifeSphere AI-X — Off-Thread Web Worker for Time-Series Processing & Artifact Filtering
 * 
 * Offloads rolling median filtering, noise spike suppression, and rolling averages
 * from the main React UI thread to preserve 60 FPS UI performance.
 */

self.onmessage = (event: MessageEvent) => {
  const { type, data, windowSize } = event.data;

  if (type === 'FILTER_SIGNAL') {
    const rawReadings: Array<{ timestamp: string; value: number }> = data || [];
    const size = windowSize || 5;

    const filtered = rawReadings.map((reading, i) => {
      const startIdx = Math.max(0, i - Math.floor(size / 2));
      const endIdx = Math.min(rawReadings.length, i + Math.floor(size / 2) + 1);
      const windowVals = rawReadings.slice(startIdx, endIdx).map((r) => r.value);

      windowVals.sort((a, b) => a - b);
      const median =
        windowVals.length % 2 === 1
          ? windowVals[Math.floor(windowVals.length / 2)]
          : (windowVals[windowVals.length / 2 - 1] + windowVals[windowVals.length / 2]) / 2;

      const rawVal = reading.value;
      const deviation = Math.abs(rawVal - median);
      const isArtifact = deviation > 35; // Spike > 35 bpm

      return {
        timestamp: reading.timestamp,
        rawValue: rawVal,
        filteredValue: Math.round(median * 10) / 10,
        isArtifact,
        qualityScore: isArtifact ? 0.3 : 1.0,
      };
    });

    self.postMessage({
      type: 'SIGNAL_FILTERED',
      result: filtered,
    });
  }
};
