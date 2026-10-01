import type {ReactNode} from 'react';
import styles from './styles.module.css';

/**
 * How an agent that has never seen your app uses a message type, and which
 * part of your contract it reads at each step: the selection card (the
 * one-line description) or the use card (the help).
 */
const steps = [
  {title: 'Searches', text: "The capabilities first, then the message types in the user's words", card: 'Selection card: name and description'},
  {title: 'Chooses', text: 'From a short list, by name and description alone', card: 'Selection card'},
  {title: 'Reads the help', text: 'Of the one it chose', card: 'Use card'},
  {title: 'Calls it', text: 'No screen, no one to ask. An error is its only guide', card: 'Use card and error texts'},
];

export default function AgentCards(): ReactNode {
  return (
    <figure className={styles.figure}>
      <ol className={styles.steps} role="list">
        {steps.map((step, i) => (
          <li key={step.title} className={styles.step}>
            <span className={styles.n} aria-hidden="true">{i + 1}</span>
            <strong>{step.title}</strong>
            <span className={styles.text}>{step.text}</span>
            <span className={styles.card}>
              <span className={styles.srOnly}>Reads: </span>
              {step.card}
            </span>
          </li>
        ))}
      </ol>
      <figcaption className={styles.caption}>
        Steps 1 and 2 read your selection card; steps 3 and 4 read your use card, and step 4 also your error texts.
      </figcaption>
    </figure>
  );
}
