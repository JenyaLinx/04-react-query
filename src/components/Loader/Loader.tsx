import css from "./Loader.module.css";

export default function Loader() {
  return (
    <div className={css.loader}>
      <div className={css.spinner}></div>

      <p className={css.text}>Loading movies...</p>
    </div>
  );
}