import {useEffect, useRef, useState} from 'react';
import type {ReactNode} from 'react';
import {translate} from '@docusaurus/Translate';
import styles from './styles.module.css';

type Props = {
  /** The text a reader pastes into their assistant. */
  text: string;
  /** Short label for screen readers, e.g. "Step 1". Optional. */
  label?: string;
};

/** Selects the text of a node, so a reader can press Ctrl+C when the clipboard API is not available. */
function selectNode(node: HTMLElement): boolean {
  const selection = window.getSelection();
  if (!selection) return false;
  const range = document.createRange();
  range.selectNodeContents(node);
  selection.removeAllRanges();
  selection.addRange(range);
  try {
    return document.execCommand('copy');
  } catch {
    return false;
  }
}

/**
 * A prompt in a block with a Copy button. The button is added after the page has loaded,
 * because without JavaScript it could not do anything.
 */
export default function CopyPrompt({text, label}: Props): ReactNode {
  const codeRef = useRef<HTMLElement>(null);
  const timer = useRef<number | undefined>(undefined);
  const [ready, setReady] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setReady(true);
    return () => {
      if (timer.current !== undefined) window.clearTimeout(timer.current);
    };
  }, []);

  const flash = () => {
    setCopied(true);
    if (timer.current !== undefined) window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setCopied(false), 2000);
  };

  const copy = async () => {
    try {
      if (!navigator.clipboard) throw new Error('no clipboard');
      await navigator.clipboard.writeText(text);
      flash();
    } catch {
      // Fallback: select the text, and copy it if the browser lets us.
      if (codeRef.current && selectNode(codeRef.current)) flash();
    }
  };

  const copyLabel = translate({id: 'useCases.copy', message: 'Copy'});
  const copiedLabel = translate({id: 'useCases.copied', message: 'Copied'});

  return (
    <div className={styles.promptBox}>
      <pre className={styles.prompt}>
        <code ref={codeRef}>{text}</code>
      </pre>
      {ready && (
        <div className={styles.promptBar}>
          <button type="button" className={styles.copyButton} onClick={copy}>
            {copied ? copiedLabel : copyLabel}
            {label ? <span className={styles.srOnly}>{` (${label})`}</span> : null}
          </button>
          <span className={styles.srOnly} role="status">
            {copied ? copiedLabel : ''}
          </span>
        </div>
      )}
    </div>
  );
}
