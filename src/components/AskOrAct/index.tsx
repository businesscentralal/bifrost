import type {ReactNode} from 'react';
import Translate from '@docusaurus/Translate';
import styles from './styles.module.css';

/**
 * For users: the difference between asking a question and asking for a change.
 * A question only reads. A change is proposed first and can be previewed; most
 * assistants ask before they act. Bifröst itself does not ask: it runs as you.
 */
export default function AskOrAct(): ReactNode {
  return (
    <figure className={styles.figure}>
      <div className={styles.lane}>
        <div className={styles.laneTitle}>
          <Translate id="askOrAct.lookUp.title">Look something up</Translate>
        </div>
        <ol className={styles.path} role="list">
          <li>
            <Translate id="askOrAct.youAsk">You ask</Translate>
          </li>
          <li>
            <Translate id="askOrAct.lookUp.reads">The assistant reads from Business Central, as you</Translate>
          </li>
          <li className={styles.end}>
            <Translate id="askOrAct.lookUp.answer">You get the answer. Nothing changes</Translate>
          </li>
        </ol>
      </div>
      <div className={styles.lane}>
        <div className={styles.laneTitle}>
          <Translate id="askOrAct.change.title">Change something</Translate>
        </div>
        <ol className={styles.path} role="list">
          <li>
            <Translate id="askOrAct.youAsk">You ask</Translate>
          </li>
          <li>
            <Translate id="askOrAct.change.proposes">The assistant proposes what it will do</Translate>
          </li>
          <li className={styles.safe}>
            <Translate
              id="askOrAct.change.preview"
              values={{
                phrase: (
                  <em>
                    <Translate id="askOrAct.change.previewPhrase">"show me first"</Translate>
                  </em>
                ),
              }}>
              {'Say {phrase} to see what posting would do'}
            </Translate>
          </li>
          <li className={styles.confirm}>
            <Translate id="askOrAct.change.confirm">
              You say yes (most assistants ask first; if yours does not, tell it to)
            </Translate>
          </li>
          <li className={styles.end}>
            <Translate id="askOrAct.change.done">Business Central does it, with your rights, and logs it</Translate>
          </li>
        </ol>
      </div>
      <figcaption className={styles.caption}>
        <Translate id="askOrAct.caption">A question only reads; a change waits for your yes.</Translate>
      </figcaption>
    </figure>
  );
}
