import styles from "./SiteChrome.module.css";

export function SiteHeader() {
  return (
    <header className={styles.header}>
      <p className={styles.wordmark}>Itzfizz</p>
      <p className={styles.caption}>
        Pick-up point network
        <br />
        Performance review 2026
      </p>
    </header>
  );
}

export function ClosingNote() {
  return (
    <>
      <section className={styles.closing}>
        <p className={styles.closingText}>
          Every parcel that reaches a pick-up point instead of a doorstep is one
          fewer missed delivery, one fewer phone call, one fewer van circling the
          block. <em>Four numbers, one route, measured across 2026.</em>
        </p>
        <hr className={styles.rule} />
      </section>
      <footer className={styles.footer}>
        <p>Itzfizz</p>
        <p>Figures from internal network data, Jan–Dec 2026</p>
      </footer>
    </>
  );
}
