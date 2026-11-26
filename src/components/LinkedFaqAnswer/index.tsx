import {useEffect, useRef, type ReactNode} from 'react';
import clsx from 'clsx';
import {useLocation} from '@docusaurus/router';
import {useAnchorTargetClassName} from '@docusaurus/theme-common';
import useBrokenLinks from '@docusaurus/useBrokenLinks';
import styles from './styles.module.css';

type Props = {
  id: string;
  question: string;
  children: ReactNode;
};

/** A fragment inside native details reveals the answer even before React hydrates. */
export default function LinkedFaqAnswer({id, question, children}: Props): ReactNode {
  const anchorClassName = useAnchorTargetClassName(id);
  useBrokenLinks().collectAnchor(id);

  const answerRef = useRef<HTMLDivElement>(null);
  const {hash} = useLocation();
  useEffect(() => {
    // Client navigation or a remount can skip the browser's fragment reveal.
    const answer = answerRef.current;
    const details = answer?.closest('details');
    if (hash === `#${id}` && details && !details.open) {
      details.open = true;
      answer?.scrollIntoView();
    }
  }, [hash, id]);

  return (
    <details className={clsx('alert alert--info', styles.details)} suppressHydrationWarning>
      <summary>{question}</summary>
      <div id={id} ref={answerRef} className={clsx(styles.answer, anchorClassName)}>
        {children}
      </div>
    </details>
  );
}
