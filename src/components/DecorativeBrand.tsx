export function DecorativeBrand({ value, accessibleName }: { value: string; accessibleName: string }) {
  return <p className="decorative-brand" role="img" aria-label={accessibleName}><span aria-hidden="true">{value}</span></p>;
}
import "./decorative-brand.css";
