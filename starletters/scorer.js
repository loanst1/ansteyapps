// StarLetters — formation-based handwriting scorer.
// Scores a child's ink against the canonical stroke path from strokes.js.
// Components:
//   • pathAccuracy: mean nearest-point distance from ink to ideal path
//   • startPoint:   how close first ink point is to the START DOT
//   • strokeOrder:  # of strokes user drew vs ideal (soft match)
//   • coverage:     % of ideal path length that user got within 15 units of
//
// Returns { total, path, start, order, coverage, stars(1-5), tip }.

(function () {
  // Resample a polyline into ~N evenly-spaced points.
  function resample(points, N = 40) {
    if (points.length < 2) return points.slice();
    let total = 0;
    const segs = [];
    for (let i = 1; i < points.length; i++) {
      const dx = points[i][0] - points[i-1][0];
      const dy = points[i][1] - points[i-1][1];
      const d = Math.hypot(dx, dy);
      total += d;
      segs.push(d);
    }
    if (total < 0.001) return [points[0]];
    const step = total / (N - 1);
    const out = [points[0].slice()];
    let acc = 0, iSeg = 0, remaining = segs[0];
    let cur = points[0].slice();
    for (let k = 1; k < N - 1; k++) {
      const target = k * step;
      while (acc + remaining < target && iSeg < segs.length - 1) {
        acc += remaining;
        iSeg++;
        cur = points[iSeg].slice();
        remaining = segs[iSeg];
      }
      const need = target - acc;
      const t = remaining > 0 ? need / remaining : 0;
      const nx = points[iSeg][0] + t * (points[iSeg + 1][0] - points[iSeg][0]);
      const ny = points[iSeg][1] + t * (points[iSeg + 1][1] - points[iSeg][1]);
      out.push([nx, ny]);
    }
    out.push(points[points.length - 1].slice());
    return out;
  }

  // Nearest-point distance from p to a polyline.
  function distToPolyline(p, line) {
    let best = Infinity;
    for (let i = 1; i < line.length; i++) {
      const [ax, ay] = line[i - 1];
      const [bx, by] = line[i];
      const dx = bx - ax, dy = by - ay;
      const len2 = dx*dx + dy*dy;
      let t = 0;
      if (len2 > 0) t = Math.max(0, Math.min(1, ((p[0]-ax)*dx + (p[1]-ay)*dy) / len2));
      const px = ax + t*dx, py = ay + t*dy;
      const d = Math.hypot(p[0]-px, p[1]-py);
      if (d < best) best = d;
    }
    return best;
  }

  // Rescale ink from canvas coords into the same 100x100 letter box as strokes.
  function normaliseInk(strokes, guideBox) {
    // guideBox: {x, y, w, h} in canvas coords — the ideal letter's 100x100 box
    if (!strokes.length) return [];
    return strokes.map(s => s.map(p => [
      ((p.x - guideBox.x) / guideBox.w) * 100,
      ((p.y - guideBox.y) / guideBox.h) * 100
    ]));
  }

  // Ideal path total length (sum across strokes)
  function pathLength(strokes) {
    let L = 0;
    strokes.forEach(s => {
      for (let i = 1; i < s.length; i++) {
        L += Math.hypot(s[i][0]-s[i-1][0], s[i][1]-s[i-1][1]);
      }
    });
    return L;
  }

  window.LetterScorer = {

    /**
     * @param {Array<Array<{x,y}>>} userStrokes — raw ink strokes in canvas coords
     * @param {Object} guideBox — {x, y, w, h} of the ideal letter box on canvas
     * @param {Array<Array<[x,y]>>} idealStrokes — from StrokePaths.get(char)
     */
    score(userStrokes, guideBox, idealStrokes) {
      if (!idealStrokes || !idealStrokes.length) {
        return { total: 0, path: 0, start: 0, order: 0, coverage: 0, stars: 0, tip: 'No guide available.' };
      }
      if (!userStrokes.length) {
        return { total: 0, path: 0, start: 0, order: 0, coverage: 0, stars: 0, tip: 'Try tracing the letter!' };
      }

      const normInk = normaliseInk(userStrokes, guideBox);
      const flatInk = [];
      normInk.forEach(s => resample(s, 40).forEach(p => flatInk.push(p)));
      if (!flatInk.length) return { total: 5, path: 0, start: 0, order: 0, coverage: 0, stars: 0, tip: 'Try again!' };

      // Flatten the ideal path into a single polyline for path-distance scoring
      const flatIdeal = [];
      idealStrokes.forEach(s => resample(s, 40).forEach(p => flatIdeal.push(p)));

      // ---- 1. Path accuracy: mean distance from ink to ideal path ----
      let sumD = 0;
      for (const p of flatInk) sumD += distToPolyline(p, flatIdeal);
      const meanD = sumD / flatInk.length;
      // 100 = perfect (0 units). 0 = 25+ units off.
      const pathScore = Math.max(0, Math.min(100, 100 - (meanD * 4)));

      // ---- 2. Start point: first ink near first waypoint ----
      const startDot = idealStrokes[0][0];
      const inkStart = normInk[0][0];
      const startDist = Math.hypot(startDot[0] - inkStart[0], startDot[1] - inkStart[1]);
      const startScore = Math.max(0, Math.min(100, 100 - startDist * 3));

      // ---- 3. Stroke order/count ----
      const idealN = idealStrokes.length;
      const userN = userStrokes.length;
      const diff = Math.abs(idealN - userN);
      const orderScore = Math.max(0, 100 - diff * 20);

      // ---- 4. Coverage: % of ideal path within 15 units of some ink point ----
      let hit = 0;
      for (const p of flatIdeal) {
        // find nearest ink point
        let best = Infinity;
        for (const q of flatInk) {
          const d = Math.hypot(p[0]-q[0], p[1]-q[1]);
          if (d < best) best = d;
          if (best < 5) break;
        }
        if (best <= 15) hit++;
      }
      const coverage = Math.round(100 * hit / flatIdeal.length);

      // ---- Weighted total ----
      const total = Math.round(
        pathScore  * 0.55 +
        startScore * 0.15 +
        orderScore * 0.10 +
        coverage   * 0.20
      );

      // Stars (1..5)
      let stars = 1;
      if (total >= 88) stars = 5;
      else if (total >= 76) stars = 4;
      else if (total >= 62) stars = 3;
      else if (total >= 48) stars = 2;

      // Tip
      let tip = 'Great writing!';
      if (startScore < 60) tip = 'Try starting from the green dot.';
      else if (orderScore < 60) tip = `That letter needs ${idealN} stroke${idealN>1?'s':''}. You drew ${userN}.`;
      else if (pathScore < 55) tip = 'Follow the dotted guide more closely.';
      else if (coverage < 55) tip = 'Try covering all of the letter shape.';
      else if (total >= 88) tip = 'Perfect formation!';
      else if (total >= 76) tip = 'Very neat!';
      else tip = 'Nice work!';

      return {
        total, path: Math.round(pathScore), start: Math.round(startScore),
        order: Math.round(orderScore), coverage, stars, tip
      };
    },

    // Utility: turn a normalised stroke path into canvas coordinates.
    toCanvas(idealStrokes, box) {
      return idealStrokes.map(s => s.map(([x, y]) => ({
        x: box.x + (x / 100) * box.w,
        y: box.y + (y / 100) * box.h
      })));
    },

    // Draw the dotted guide + start dot + direction arrow on a canvas ctx.
    drawGuide(ctx, idealStrokes, box, opts = {}) {
      const dashed = opts.dashed !== false;
      const startDot = opts.startDot !== false;
      const arrows = opts.arrows !== false;
      const strokeStyle = opts.stroke || 'rgba(255,255,255,0.30)';
      const startCol = opts.startCol || '#3FD6A0';
      const arrowCol = opts.arrowCol || 'rgba(255,214,10,0.85)';

      idealStrokes.forEach((s, si) => {
        const pts = s.map(([x, y]) => ({ x: box.x + (x/100)*box.w, y: box.y + (y/100)*box.h }));
        ctx.save();
        ctx.strokeStyle = strokeStyle;
        ctx.lineWidth = Math.max(3, box.w * 0.05);
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        if (dashed) ctx.setLineDash([4, 8]);
        ctx.beginPath();
        pts.forEach((p, i) => i ? ctx.lineTo(p.x, p.y) : ctx.moveTo(p.x, p.y));
        ctx.stroke();
        ctx.setLineDash([]);
        // Arrow at midpoint of each segment (only for first stroke to reduce clutter)
        if (arrows && si === 0) {
          for (let i = 1; i < pts.length; i++) {
            const a = pts[i-1], b = pts[i];
            const mx = (a.x + b.x)/2, my = (a.y + b.y)/2;
            const ang = Math.atan2(b.y - a.y, b.x - a.x);
            const size = box.w * 0.045;
            ctx.fillStyle = arrowCol;
            ctx.beginPath();
            ctx.moveTo(mx + Math.cos(ang) * size, my + Math.sin(ang) * size);
            ctx.lineTo(mx + Math.cos(ang + 2.6) * size, my + Math.sin(ang + 2.6) * size);
            ctx.lineTo(mx + Math.cos(ang - 2.6) * size, my + Math.sin(ang - 2.6) * size);
            ctx.closePath();
            ctx.fill();
          }
        }
        ctx.restore();
      });

      // Start dot
      if (startDot && idealStrokes[0] && idealStrokes[0][0]) {
        const [sx, sy] = idealStrokes[0][0];
        const cx = box.x + (sx/100)*box.w;
        const cy = box.y + (sy/100)*box.h;
        ctx.save();
        ctx.fillStyle = startCol;
        ctx.shadowColor = startCol;
        ctx.shadowBlur = 12;
        ctx.beginPath();
        ctx.arc(cx, cy, box.w * 0.035, 0, Math.PI*2);
        ctx.fill();
        ctx.restore();
      }
    }
  };
})();
