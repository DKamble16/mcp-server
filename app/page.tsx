import styles from "./page.module.css";

export default function Home() {
  return (
    <main className={styles.hero}>
      <section className={styles.panel}>
        <p className={styles.kicker}>ChatGPT App Surface</p>
        <h1 className={styles.title}>Hello, world.</h1>
        <p className={styles.body}>
          This minimal UI is ready to be embedded inside ChatGPT via the MCP
          server route at <code>/mcp</code>. Customize this section to render
          your tool output.
        </p>
        <div className={styles.ctaRow}>
          <button className={styles.cta}>Hello World</button>
          <p className={styles.tagline}>The simplest possible ChatGPT widget.</p>
        </div>
      </section>
    </main>
  );
}
