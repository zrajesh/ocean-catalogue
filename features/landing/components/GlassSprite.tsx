export function GlassSprite() {
  return (
    <svg width="0" height="0" style={{ position: "absolute" }} aria-hidden="true">
      <defs>
        <symbol id="wine" viewBox="0 0 100 200">
          <path d="M26 10h48c2 52-8 88-24 94-16-6-26-42-24-94z" fill="currentColor" fillOpacity=".1" stroke="currentColor" strokeWidth="1.6" />
          <path d="M28 52c14 5 30 5 44 0" stroke="currentColor" strokeWidth="1.2" fill="none" opacity=".6" />
          <path d="M50 104v72M30 184q20-10 40 0" stroke="currentColor" strokeWidth="1.6" fill="none" />
        </symbol>
        <symbol id="beer" viewBox="0 0 100 200">
          <path d="M24 20h52l-6 164H30z" fill="currentColor" fillOpacity=".1" stroke="currentColor" strokeWidth="1.6" />
          <path d="M24 20c4-14 14-14 18-8 4-8 14-8 18 0 4-6 12-4 16 8" fill="none" stroke="currentColor" strokeWidth="1.6" />
          <path d="M30 62h40" stroke="currentColor" strokeWidth="1.2" opacity=".6" />
        </symbol>
        <symbol id="cup" viewBox="0 0 120 200">
          <path d="M20 70h64c0 40-12 62-32 62S20 110 20 70z" fill="currentColor" fillOpacity=".1" stroke="currentColor" strokeWidth="1.6" />
          <path d="M84 82h10a14 14 0 010 28H80" fill="none" stroke="currentColor" strokeWidth="1.6" />
          <ellipse cx="52" cy="140" rx="46" ry="8" fill="none" stroke="currentColor" strokeWidth="1.6" />
          <path d="M34 52c-4-8 4-12 0-20M52 52c-4-8 4-12 0-20" stroke="currentColor" strokeWidth="1.2" fill="none" opacity=".6" />
        </symbol>
        <symbol id="tumbler" viewBox="0 0 100 200">
          <path d="M26 50h48l-4 120H30z" fill="currentColor" fillOpacity=".1" stroke="currentColor" strokeWidth="1.6" />
          <path d="M29 150h42" stroke="currentColor" strokeWidth="1.2" opacity=".6" />
          <path d="M28 80h44" stroke="currentColor" strokeWidth="1.2" opacity=".4" />
        </symbol>
      </defs>
    </svg>
  );
}
