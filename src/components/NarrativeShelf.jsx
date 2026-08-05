import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { PULL, SHELF } from "../data/quotes";

export default function NarrativeShelf({ play = () => {} }) {
  const [bookIdx, setBookIdx] = useState(0);
  const book = SHELF[bookIdx];

  return (
    <section id="shelf" className="soft-band">
      <div className="section-inner">
        <div className="section-head">
          <p className="kicker">Narrative shelf</p>
          <h2>Four books. One mental scaffold.</h2>
          <p className="lede">
            Lines from books often tied to Jensen Huang’s reading—used here so
            Sedona’s elevation / inflection / positioning / competence story lands
            in the body before the math.
          </p>
        </div>

        <div className="pull-row">
          {PULL.map((p) => (
            <motion.blockquote
              key={p.source}
              className="pull-card"
              whileHover={{ y: -4 }}
              onHoverStart={() => play("tick")}
            >
              <p>“{p.line}”</p>
              <footer>
                <span>{p.source}</span>
                <em>{p.bridge}</em>
              </footer>
            </motion.blockquote>
          ))}
        </div>

        <div className="audience-tabs" role="tablist" aria-label="Book shelf">
          {SHELF.map((b, i) => (
            <button
              key={b.book}
              type="button"
              role="tab"
              aria-selected={bookIdx === i}
              onClick={() => {
                setBookIdx(i);
                play("select");
              }}
            >
              {b.book}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={book.book}
            className="shelf-panel"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25 }}
          >
            <header className="shelf-head">
              <div>
                <h3>{book.book}</h3>
                <p>{book.author}</p>
              </div>
              {book.note ? <span className="shelf-note">{book.note}</span> : null}
            </header>

            <div className="quote-stack">
              {book.quotes.map((q) => (
                <article key={q.id} className="quote-card">
                  <p className="quote-en">“{q.text}”</p>
                  {q.attribution ? (
                    <p className="quote-attr">{q.attribution}</p>
                  ) : null}
                  <p className="quote-bridge">
                    <strong>→ Sedona</strong> {q.sedona}
                  </p>
                </article>
              ))}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
