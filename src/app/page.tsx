'use client';

import styles from "./page.module.css";
import { EmailValidation } from "@/components/EmailValidation";

export default function Home() {
  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <EmailValidation />
      </main>
    </div>
  );
}
