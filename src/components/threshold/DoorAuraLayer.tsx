interface Props {
  active: boolean;
  reducedMotion: boolean;
}

const DoorAuraLayer = ({ active, reducedMotion }: Props) => {
  return (
    <div
      aria-hidden="true"
      className={`door-hover-aura ${active ? "is-active" : ""} ${reducedMotion ? "is-reduced" : ""}`}
    >
      <div className="door-hover-aura-core" />
      <div className="door-hover-aura-halo" />
    </div>
  );
};

export default DoorAuraLayer;
